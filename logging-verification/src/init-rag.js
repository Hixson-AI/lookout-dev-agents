import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function initRag() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    user: process.env.POSTGRES_USER || 'lookout',
    password: process.env.POSTGRES_PASSWORD || 'lookout',
    database: process.env.POSTGRES_DB || 'logging_verification'
  });

  try {
    await client.connect();
    console.log('✅ Connected to Postgres');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS findings (
        id SERIAL PRIMARY KEY,
        file_path TEXT NOT NULL,
        line_number INTEGER,
        message TEXT NOT NULL,
        severity TEXT NOT NULL,
        finding_type TEXT NOT NULL,
        code_context TEXT,
        repository TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        embedding vector(1536)
      )
    `);

    // Create pgvector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Create index for similarity search
    await client.query(`
      CREATE INDEX IF NOT EXISTS findings_embedding_idx 
      ON findings USING ivfflat (embedding vector_cosine_ops)
    `);

    console.log('✅ RAG tables initialized');
  } catch (error) {
    console.error('Error initializing RAG:', error);
  } finally {
    await client.end();
  }
}

initRag();
