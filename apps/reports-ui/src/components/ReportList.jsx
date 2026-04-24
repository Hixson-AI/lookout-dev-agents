import React from 'react';

const SEVERITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

export default function ReportList({ reports, loading, onSelect }) {
  if (loading) return <div className="loading">Loading reports...</div>;
  if (reports.length === 0) return <div className="empty">No reports yet. Run an agent scan to generate reports.</div>;

  return (
    <div className="report-list">
      {reports.map(report => (
        <div
          key={report.id}
          className="report-card"
          onClick={() => onSelect(report.id)}
        >
          <div className="report-card-header">
            <span className="agent-badge">{report.agent_name}</span>
            <span className="report-date">
              {new Date(report.created_at).toLocaleString()}
            </span>
          </div>
          <h3 className="report-title">{report.title}</h3>
          {report.summary?.description && (
            <p className="report-summary">{report.summary.description}</p>
          )}
          <div className="severity-badges">
            {report.severity_counts?.high > 0 && (
              <span className="severity-badge high">{report.severity_counts.high} High</span>
            )}
            {report.severity_counts?.medium > 0 && (
              <span className="severity-badge medium">{report.severity_counts.medium} Medium</span>
            )}
            {report.severity_counts?.low > 0 && (
              <span className="severity-badge low">{report.severity_counts.low} Low</span>
            )}
            {report.total_findings === 0 && (
              <span className="severity-badge clean">No issues</span>
            )}
          </div>
          <div className="report-meta">
            <span>{report.total_findings || 0} findings</span>
            <span className="report-type">{report.report_type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
