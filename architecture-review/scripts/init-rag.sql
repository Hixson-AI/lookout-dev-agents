-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge documents (shared with other agents)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    source_path TEXT,
    document_type VARCHAR(50),
    topics TEXT[],
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(source, source_path)
);

-- Knowledge chunks for granular retrieval
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agent findings (shared table, scoped by agent_name)
CREATE TABLE IF NOT EXISTS agent_findings (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL DEFAULT 'architecture-review',
    finding_type VARCHAR(50) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    file_path TEXT NOT NULL,
    message TEXT NOT NULL,
    code_context TEXT,
    repository TEXT NOT NULL,
    principle_reference TEXT,
    embedding vector(1536),
    metadata JSONB,
    is_false_positive BOOLEAN DEFAULT FALSE,
    false_positive_feedback TEXT,
    confidence_score FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Feedback table (shared, agent-scoped)
CREATE TABLE IF NOT EXISTS agent_feedback (
    id SERIAL PRIMARY KEY,
    finding_id INTEGER REFERENCES agent_findings(id) ON DELETE CASCADE,
    agent_name VARCHAR(50) NOT NULL DEFAULT 'architecture-review',
    feedback_type VARCHAR(20) NOT NULL,
    user_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scan history (shared, agent-scoped)
CREATE TABLE IF NOT EXISTS scan_history (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL DEFAULT 'architecture-review',
    repository TEXT NOT NULL,
    total_findings INTEGER DEFAULT 0,
    high_severity INTEGER DEFAULT 0,
    medium_severity INTEGER DEFAULT 0,
    low_severity INTEGER DEFAULT 0,
    scan_duration_ms INTEGER,
    learning_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for vector similarity search
CREATE INDEX IF NOT EXISTS knowledge_docs_embedding_idx ON knowledge_documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS agent_findings_embedding_idx ON agent_findings USING ivfflat (embedding vector_cosine_ops);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS knowledge_docs_type_idx ON knowledge_documents(document_type);
CREATE INDEX IF NOT EXISTS knowledge_docs_source_idx ON knowledge_documents(source);
CREATE INDEX IF NOT EXISTS agent_findings_repo_idx ON agent_findings(repository);
CREATE INDEX IF NOT EXISTS agent_findings_type_idx ON agent_findings(finding_type);
CREATE INDEX IF NOT EXISTS agent_findings_severity_idx ON agent_findings(severity);
CREATE INDEX IF NOT EXISTS agent_findings_agent_idx ON agent_findings(agent_name);
CREATE INDEX IF NOT EXISTS agent_findings_false_positive_idx ON agent_findings(is_false_positive);
CREATE INDEX IF NOT EXISTS agent_feedback_finding_idx ON agent_feedback(finding_id);
CREATE INDEX IF NOT EXISTS scan_history_agent_repo_idx ON scan_history(agent_name, repository);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_knowledge_docs_updated_at ON knowledge_documents;
CREATE TRIGGER update_knowledge_docs_updated_at BEFORE UPDATE ON knowledge_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_findings_updated_at ON agent_findings;
CREATE TRIGGER update_agent_findings_updated_at BEFORE UPDATE ON agent_findings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
