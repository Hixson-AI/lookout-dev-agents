import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function initRAG() {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5435'),
    database: process.env.POSTGRES_DB || 'agents_rag',
    user: process.env.POSTGRES_USER || 'agent_user',
    password: process.env.POSTGRES_PASSWORD || 'changeme',
  });

  try {
    console.log('Connecting to RAG store...');
    await pool.connect();
    console.log('Connected to RAG store');

    // Read and execute init-general-rag.sql
    const initSqlPath = path.join(__dirname, '../../scripts/init-general-rag.sql');
    if (fs.existsSync(initSqlPath)) {
      const sql = fs.readFileSync(initSqlPath, 'utf8');
      await pool.query(sql);
      console.log('✅ RAG store initialized successfully');
      console.log('Database schema created via init-rag.sql on first run');
    } else {
      console.log('ℹ️  init-general-rag.sql not found, skipping schema creation');
    }

    // Read and execute init-reports.sql
    const reportsSqlPath = path.join(__dirname, '../../scripts/init-reports.sql');
    if (fs.existsSync(reportsSqlPath)) {
      const sql = fs.readFileSync(reportsSqlPath, 'utf8');
      await pool.query(sql);
      console.log('✅ Reports schema initialized successfully');
    } else {
      console.log('ℹ️  init-reports.sql not found, skipping reports schema creation');
    }

    // Create findings table if it doesn't exist (for compatibility)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS findings (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        file TEXT,
        message TEXT,
        repository TEXT,
        code_context TEXT,
        embedding vector(1536),
        metadata JSONB DEFAULT '{}',
        confidence_score FLOAT DEFAULT 0.5,
        is_false_positive BOOLEAN DEFAULT FALSE,
        line_number INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        finding_id INTEGER REFERENCES findings(id) ON DELETE CASCADE,
        feedback_type TEXT NOT NULL,
        user_comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS scan_history (
        id SERIAL PRIMARY KEY,
        repository TEXT NOT NULL,
        total_findings INTEGER DEFAULT 0,
        high_severity INTEGER DEFAULT 0,
        medium_severity INTEGER DEFAULT 0,
        low_severity INTEGER DEFAULT 0,
        scan_duration_ms INTEGER,
        learning_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_findings_embedding ON findings USING ivfflat (embedding vector_cosine_ops)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_findings_type ON findings(type)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_findings_repository ON findings(repository)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_findings_false_positive ON findings(is_false_positive)
    `);

    console.log('✅ Resource usage agent schema initialized successfully');

  } catch (error) {
    console.error('Failed to initialize RAG store:', error);
    throw error;
  } finally {
    await pool.end();
    console.log('Disconnected from RAG store');
  }
}

initRAG().catch(console.error);
