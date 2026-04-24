-- General RAG Database for Platform Knowledge
-- This stores architecture docs, slices, standards, vision, etc. that all agents use

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge documents table (architecture docs, slices, standards, etc.)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,  -- e.g., 'architecture', 'lookout-api', 'lookout-control'
  source_path TEXT,       -- e.g., 'docs/01-introduction.md', 'slices/slice_1.md'
  document_type TEXT NOT NULL,  -- 'architecture', 'slice', 'standard', 'vision', 'product'
  topics TEXT[],          -- Array of topic tags
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document chunks for better retrieval (split long docs into chunks)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent-specific RAG table (findings, feedback, learning)
CREATE TABLE IF NOT EXISTS agent_findings (
  id SERIAL PRIMARY KEY,
  agent_name TEXT NOT NULL,  -- e.g., 'cybersecurity-hardening'
  finding_type TEXT NOT NULL,  -- e.g., 'secret', 'code', 'infrastructure'
  severity TEXT NOT NULL,
  file_path TEXT,
  message TEXT,
  code_context TEXT,
  repository TEXT,
  embedding vector(1536),
  confidence_score FLOAT DEFAULT 0.5,
  is_false_positive BOOLEAN DEFAULT FALSE,
  false_positive_feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent scan history
CREATE TABLE IF NOT EXISTS agent_scan_history (
  id SERIAL PRIMARY KEY,
  agent_name TEXT NOT NULL,
  repository TEXT NOT NULL,
  total_findings INTEGER DEFAULT 0,
  high_severity INTEGER DEFAULT 0,
  medium_severity INTEGER DEFAULT 0,
  low_severity INTEGER DEFAULT 0,
  scan_duration_ms INTEGER,
  learning_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings ON knowledge_documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embeddings ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_agent_findings_embeddings ON agent_findings USING ivfflat (embedding vector_cosine_ops);

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_source ON knowledge_documents(source);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_type ON knowledge_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_agent_findings_agent ON agent_findings(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_findings_type ON agent_findings(finding_type);
CREATE INDEX IF NOT EXISTS idx_agent_findings_false_positive ON agent_findings(is_false_positive);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_knowledge_documents_updated_at
  BEFORE UPDATE ON knowledge_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
