import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export class GeneralRAGStore {
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
    await this.pool.connect();
    console.log('Connected to General RAG database');
  }

  async disconnect() {
    await this.pool.end();
    console.log('Disconnected from General RAG database');
  }

  // Store a knowledge document (architecture, slice, standard, etc.)
  async storeDocument(doc) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO knowledge_documents (title, content, source, source_path, document_type, topics, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [doc.title, doc.content, doc.source, doc.sourcePath, doc.documentType, doc.topics, doc.embedding]
      );

      const docId = result.rows[0]?.id;

      // If document is long, chunk it for better retrieval
      if (doc.content.length > 2000 && docId) {
        const chunks = this.chunkContent(doc.content, 1000);
        for (let i = 0; i < chunks.length; i++) {
          await client.query(
            `INSERT INTO knowledge_chunks (document_id, chunk_index, content, embedding)
             VALUES ($1, $2, $3, $4)`,
            [docId, i, chunks[i].content, chunks[i].embedding]
          );
        }
      }

      await client.query('COMMIT');
      return docId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Search general knowledge by similarity
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

  // Search knowledge chunks (for more granular retrieval)
  async searchKnowledgeChunks(queryEmbedding, limit = 5, documentType = null) {
    let query = `
      SELECT kc.id, kc.content, kc.chunk_index,
             kd.title, kd.source, kd.source_path, kd.document_type,
             1 - (kc.embedding <=> $1) as similarity
      FROM knowledge_chunks kc
      JOIN knowledge_documents kd ON kc.document_id = kd.id
      WHERE 1 - (kc.embedding <=> $1) > 0.7
    `;
    const params = [queryEmbedding];

    if (documentType) {
      query += ` AND kd.document_type = $${params.length + 1}`;
      params.push(documentType);
    }

    query += ` ORDER BY similarity DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Agent-specific: store a finding
  async storeAgentFinding(agentName, finding, embedding) {
    const result = await this.pool.query(
      `INSERT INTO agent_findings 
       (agent_name, finding_type, severity, file_path, message, code_context, repository, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [agentName, finding.type, finding.severity, finding.file, finding.message, finding.code_context, finding.repository, embedding]
    );
    return result.rows[0].id;
  }

  // Agent-specific: find similar findings
  async findSimilarAgentFindings(agentName, queryEmbedding, limit = 5, threshold = 0.75) {
    const result = await this.pool.query(
      `SELECT id, finding_type, severity, file_path, message, code_context, repository,
              confidence_score, is_false_positive,
              1 - (embedding <=> $1) as similarity
       FROM agent_findings
       WHERE agent_name = $2
         AND 1 - (embedding <=> $1) > $3
       ORDER BY similarity DESC
       LIMIT $4`,
      [queryEmbedding, agentName, threshold, limit]
    );
    return result.rows;
  }

  // Agent-specific: mark as false positive
  async markAsFalsePositive(findingId, feedback = null) {
    await this.pool.query(
      `UPDATE agent_findings
       SET is_false_positive = TRUE,
           false_positive_feedback = $2
       WHERE id = $1`,
      [findingId, feedback]
    );
  }

  // Get learning stats for an agent
  async getAgentStats(agentName) {
    const result = await this.pool.query(
      `SELECT 
        COUNT(*) as total_findings,
        COUNT(*) FILTER (WHERE is_false_positive = TRUE) as false_positives,
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT repository) as repositories_scanned
       FROM agent_findings
       WHERE agent_name = $1`,
      [agentName]
    );
    return result.rows[0];
  }

  // Get general knowledge stats
  async getKnowledgeStats() {
    const result = await this.pool.query(
      `SELECT 
        COUNT(*) as total_documents,
        document_type,
        COUNT(*) as count
       FROM knowledge_documents
       GROUP BY document_type`
    );
    return result.rows;
  }

  // Helper: chunk content into smaller pieces
  chunkContent(content, maxChunkSize) {
    const chunks = [];
    const sentences = content.split(/(?<=[.!?])\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
        chunks.push({ content: currentChunk.trim(), embedding: null });
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push({ content: currentChunk.trim(), embedding: null });
    }

    return chunks;
  }
}
