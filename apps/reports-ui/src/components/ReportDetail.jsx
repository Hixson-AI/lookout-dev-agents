import React, { useState } from 'react';

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function ReportDetail({ report, onBack, buildIdeUrl }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const findings = report.findings || [];
  const filtered = findings
    .filter(f => filter === 'all' || f.severity === filter)
    .filter(f => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        f.message?.toLowerCase().includes(q) ||
        f.file_path?.toLowerCase().includes(q) ||
        f.repository?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return (
    <div className="report-detail">
      <button onClick={onBack} className="back-btn">&larr; Back to reports</button>

      <div className="detail-header">
        <div className="detail-meta">
          <span className="agent-badge large">{report.agent_name}</span>
          <span className="report-type">{report.report_type}</span>
        </div>
        <h2>{report.title}</h2>
        <p className="detail-date">
          {new Date(report.created_at).toLocaleString()}
        </p>
      </div>

      <div className="detail-stats">
        <div className="stat-box">
          <span className="stat-number">{findings.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-box high">
          <span className="stat-number">{findings.filter(f => f.severity === 'high').length}</span>
          <span className="stat-label">High</span>
        </div>
        <div className="stat-box medium">
          <span className="stat-number">{findings.filter(f => f.severity === 'medium').length}</span>
          <span className="stat-label">Medium</span>
        </div>
        <div className="stat-box low">
          <span className="stat-number">{findings.filter(f => f.severity === 'low').length}</span>
          <span className="stat-label">Low</span>
        </div>
      </div>

      <div className="findings-controls">
        <input
          type="text"
          placeholder="Search findings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-buttons">
          {['all', 'high', 'medium', 'low'].map(sev => (
            <button
              key={sev}
              className={`filter-btn ${filter === sev ? 'active' : ''} ${sev}`}
              onClick={() => setFilter(sev)}
            >
              {sev === 'all' ? 'All' : sev}
            </button>
          ))}
        </div>
      </div>

      <div className="findings-list">
        {filtered.length === 0 ? (
          <div className="empty">No findings match your criteria</div>
        ) : (
          filtered.map((finding, i) => (
            <div key={finding.id || i} className={`finding-card ${finding.severity}`}>
              <div className="finding-header">
                <span className={`severity-tag ${finding.severity}`}>
                  {finding.severity.toUpperCase()}
                </span>
                {finding.finding_type && (
                  <span className="finding-type">{finding.finding_type}</span>
                )}
              </div>

              <p className="finding-message">{finding.message}</p>

              {finding.file_path && (
                <div className="finding-location">
                  <a
                    href={buildIdeUrl(finding.file_path, finding.line_number)}
                    className="file-link"
                    title="Click to open in IDE"
                    onClick={e => {
                      // Let the protocol handler work
                    }}
                  >
                    {finding.file_path}
                    {finding.line_number && `:${finding.line_number}`}
                  </a>
                  {finding.repository && (
                    <span className="repository-tag">{finding.repository}</span>
                  )}
                </div>
              )}

              {finding.code_context && (
                <pre className="code-context">{finding.code_context}</pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
