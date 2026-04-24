import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const AGENT_NAME = 'architecture-review';

export class ArchitectureRAGStore {
  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5436'),
      database: process.env.POSTGRES_DB || 'agents_rag',
      user: process.env.POSTGRES_USER || 'agent_user',
      password: process.env.POSTGRES_PASSWORD || 'changeme',
    });
  }

  async connect() {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
      console.log('Connected to Architecture RAG store');
    } finally {
      client.release();
    }
  }

  async disconnect() {
    await this.pool.end();
    console.log('Disconnected from Architecture RAG store');
  }

  // -- Knowledge Documents --

  async storeDocument(doc) {
    const result = await this.pool.query(
      `INSERT INTO knowledge_documents (title, content, source, source_path, document_type, topics, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (source, source_path) DO UPDATE SET
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         document_type = EXCLUDED.document_type,
         topics = EXCLUDED.topics,
         embedding = EXCLUDED.embedding,
         updated_at = NOW()
       RETURNING id`,
      [doc.title, doc.content, doc.source, doc.sourcePath, doc.documentType, doc.topics, doc.embedding]
    );
    return result.rows[0]?.id;
  }

  async searchKnowledge(queryEmbedding, limit = 5, documentType = null) {
    let query = `
      SELECT id, title, content, source, source_path, document_type, topics,
             1 - (embedding <=> $1) as similarity
      FROM knowledge_documents
      WHERE 1 - (embedding <=> $1) > 0.7
    `;
    const params = [queryEmbedding];

    if (documentType) {
      query += ` AND document_type = $${params.length + 1}`;
      params.push(documentType);
    }

    query += ` ORDER BY similarity DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // -- Findings --

  async storeFinding(finding) {
    const result = await this.pool.query(
      `INSERT INTO agent_findings (agent_name, finding_type, severity, file_path, message, code_context, repository, principle_reference, embedding, metadata, confidence_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        AGENT_NAME,
        finding.type,
        finding.severity,
        finding.file,
        finding.message,
        finding.code_context || null,
        finding.repository,
        finding.principle_reference || null,
        finding.embedding ? `[${finding.embedding.join(',')}]` : null,
        finding.metadata || {},
        finding.confidence_score || 0.5,
      ]
    );
    return result.rows[0].id;
  }

  async findSimilarFindings(embedding, limit = 5, threshold = 0.75) {
    const result = await this.pool.query(
      `SELECT id, finding_type, severity, file_path, message, repository, principle_reference, is_false_positive, confidence_score,
              1 - (embedding <=> $1) as similarity
       FROM agent_findings
       WHERE agent_name = $2
         AND 1 - (embedding <=> $1) > $3
       ORDER BY embedding <=> $1
       LIMIT $4`,
      [`[${embedding.join(',')}]`, AGENT_NAME, threshold, limit]
    );
    return result.rows;
  }

  async markFalsePositive(findingId, comment) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE agent_findings SET is_false_positive = TRUE WHERE id = $1 AND agent_name = $2',
        [findingId, AGENT_NAME]
      );

      await client.query(
        'INSERT INTO agent_feedback (finding_id, agent_name, feedback_type, user_comment) VALUES ($1, $2, $3, $4)',
        [findingId, AGENT_NAME, 'false-positive', comment || null]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // -- Stats --

  async getLearningStats() {
    const result = await this.pool.query(
      `SELECT
        COUNT(*) as total_findings,
        COUNT(*) FILTER (WHERE is_false_positive = TRUE) as false_positives,
        COUNT(*) FILTER (WHERE is_false_positive = FALSE) as true_positives,
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT repository) as repositories_scanned
       FROM agent_findings
       WHERE agent_name = $1`,
      [AGENT_NAME]
    );
    return result.rows[0];
  }

  async getFalsePositiveRateByType() {
    const result = await this.pool.query(
      `SELECT
        finding_type as type,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_false_positive = TRUE) as false_positives,
        ROUND(COUNT(*) FILTER (WHERE is_false_positive = TRUE)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as fp_rate
       FROM agent_findings
       WHERE agent_name = $1
       GROUP BY finding_type
       ORDER BY fp_rate DESC`,
      [AGENT_NAME]
    );
    return result.rows;
  }

  async recordScanHistory(scan) {
    await this.pool.query(
      `INSERT INTO scan_history (agent_name, repository, total_findings, high_severity, medium_severity, low_severity, scan_duration_ms, learning_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        AGENT_NAME,
        scan.repository,
        scan.total_findings,
        scan.high_severity,
        scan.medium_severity,
        scan.low_severity,
        scan.scan_duration_ms,
        scan.learning_enabled,
      ]
    );
  }
}
