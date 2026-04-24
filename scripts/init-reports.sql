-- Shared reporting schema for all agents

CREATE TABLE IF NOT EXISTS agent_reports (
  id SERIAL PRIMARY KEY,
  agent_name TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'scan',
  title TEXT NOT NULL,
  summary JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_findings (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES agent_reports(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  file_path TEXT,
  line_number INTEGER,
  message TEXT NOT NULL,
  finding_type TEXT,
  code_context TEXT,
  repository TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_agent ON agent_reports(agent_name);
CREATE INDEX IF NOT EXISTS idx_reports_type ON agent_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_created ON agent_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_findings_report ON report_findings(report_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON report_findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_repository ON report_findings(repository);
