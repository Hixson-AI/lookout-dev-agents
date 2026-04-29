import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export class RAGStore {
  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5435'),
      database: process.env.POSTGRES_DB || 'agents_rag',
      user: process.env.POSTGRES_USER || 'agent_user',
      password: process.env.POSTGRES_PASSWORD || 'changeme',
    });
  }

  async connect() {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
      console.log('Connected to RAG store');
    } finally {
      client.release();
    }
  }

  async disconnect() {
    await this.pool.end();
    console.log('Disconnected from RAG store');
  }

  async storeFinding(finding) {
    const query = `
      INSERT INTO findings (type, severity, file, message, repository, code_context, embedding, metadata, confidence_score, line_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    const values = [
      finding.type,
      finding.severity,
      finding.file,
      finding.message,
      finding.repository,
      finding.code_context || null,
      finding.embedding ? `[${finding.embedding.join(',')}]` : null,
      finding.metadata || {},
      finding.confidence_score || 0.5,
      finding.line_number || null,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0].id;
  }

  async findSimilarFindings(embedding, limit = 5, threshold = 0.75) {
    const query = `
      SELECT id, type, severity, file, message, repository, is_false_positive, confidence_score, line_number,
             1 - (embedding <=> $1) as similarity
      FROM findings
      WHERE 1 - (embedding <=> $1) > $2
      ORDER BY embedding <=> $1
      LIMIT $3
    `;
    const values = [`[${embedding.join(',')}]`, threshold, limit];

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async markFalsePositive(findingId, comment) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE findings SET is_false_positive = TRUE WHERE id = $1',
        [findingId]
      );

      await client.query(
        'INSERT INTO feedback (finding_id, feedback_type, user_comment) VALUES ($1, $2, $3)',
        [findingId, 'false-positive', comment || null]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async recordScanHistory(scan) {
    const query = `
      INSERT INTO scan_history (repository, total_findings, high_severity, medium_severity, low_severity, scan_duration_ms, learning_enabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [
      scan.repository,
      scan.total_findings,
      scan.high_severity,
      scan.medium_severity,
      scan.low_severity,
      scan.scan_duration_ms,
      scan.learning_enabled,
    ];

    await this.pool.query(query, values);
  }

  async getLearningStats() {
    const query = `
      SELECT
        COUNT(*) as total_findings,
        COUNT(*) FILTER (WHERE is_false_positive = TRUE) as false_positives,
        COUNT(*) FILTER (WHERE is_false_positive = FALSE) as true_positives,
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT repository) as repositories_scanned
      FROM findings
    `;

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getFalsePositiveRateByType() {
    const query = `
      SELECT
        type,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_false_positive = TRUE) as false_positives,
        ROUND(COUNT(*) FILTER (WHERE is_false_positive = TRUE)::numeric / COUNT(*) * 100, 2) as fp_rate
      FROM findings
      GROUP BY type
      ORDER BY fp_rate DESC
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }
}
