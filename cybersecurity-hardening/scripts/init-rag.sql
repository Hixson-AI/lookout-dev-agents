-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Findings table for storing security issues
CREATE TABLE IF NOT EXISTS findings (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    file TEXT NOT NULL,
    message TEXT NOT NULL,
    repository TEXT NOT NULL,
    code_context TEXT,
    embedding vector(1536),
    metadata JSONB,
    is_false_positive BOOLEAN DEFAULT FALSE,
    confidence_score FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pattern clusters for learned patterns
CREATE TABLE IF NOT EXISTS pattern_clusters (
    id SERIAL PRIMARY KEY,
    cluster_name TEXT NOT NULL,
    description TEXT,
    embedding vector(1536),
    finding_count INTEGER DEFAULT 0,
    false_positive_rate FLOAT DEFAULT 0.0,
    avg_confidence FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Feedback table for learning
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    finding_id INTEGER REFERENCES findings(id),
    feedback_type VARCHAR(20) NOT NULL, -- true-positive, false-positive, needs-review
    user_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scan history table
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
);

-- Indexes for vector similarity search
CREATE INDEX IF NOT EXISTS findings_embedding_idx ON findings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS pattern_clusters_embedding_idx ON pattern_clusters USING ivfflat (embedding vector_cosine_ops);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS findings_repository_idx ON findings(repository);
CREATE INDEX IF NOT EXISTS findings_severity_idx ON findings(severity);
CREATE INDEX IF NOT EXISTS findings_type_idx ON findings(type);
CREATE INDEX IF NOT EXISTS findings_false_positive_idx ON findings(is_false_positive);
CREATE INDEX IF NOT EXISTS feedback_finding_id_idx ON feedback(finding_id);
CREATE INDEX IF NOT EXISTS scan_history_repository_idx ON scan_history(repository);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON findings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pattern_clusters_updated_at BEFORE UPDATE ON pattern_clusters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
