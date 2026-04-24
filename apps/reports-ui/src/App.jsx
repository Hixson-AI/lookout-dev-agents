import React, { useState, useEffect } from 'react';
import ReportList from './components/ReportList';
import ReportDetail from './components/ReportDetail';
import Settings from './components/Settings';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3456';

const IDE_PROTOCOLS = {
  vscode: { name: 'VS Code', protocol: 'vscode://file/' },
  windsurf: { name: 'Windsurf', protocol: 'windsurf://file/' },
  cursor: { name: 'Cursor', protocol: 'cursor://file/' },
  jetbrains: { name: 'JetBrains', protocol: 'jetbrains://idea/open?file=' },
  file: { name: 'System Default', protocol: 'file://' }
};

export default function App() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState([]);
  const [ideProtocol, setIdeProtocol] = useState(localStorage.getItem('ide-protocol') || 'windsurf');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/agents`)
      .then(r => r.json())
      .then(setAgents)
      .catch(setError);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedAgent
      ? `${API_BASE}/reports?agent=${encodeURIComponent(selectedAgent)}`
      : `${API_BASE}/reports`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [selectedAgent]);

  const openReport = (id) => {
    fetch(`${API_BASE}/reports/${id}`)
      .then(r => r.json())
      .then(setSelectedReport)
      .catch(setError);
  };

  const buildIdeUrl = (filePath, lineNumber) => {
    const proto = IDE_PROTOCOLS[ideProtocol];
    if (!proto) return filePath;
    
    if (ideProtocol === 'jetbrains') {
      let url = `${proto.protocol}${encodeURIComponent(filePath)}`;
      if (lineNumber) url += `&line=${lineNumber}`;
      return url;
    }
    
    let url = `${proto.protocol}${filePath}`;
    if (lineNumber) url += `:${lineNumber}`;
    return url;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agent Reports</h1>
        <div className="header-actions">
          <select
            value={selectedAgent}
            onChange={e => setSelectedAgent(e.target.value)}
            className="agent-filter"
          >
            <option value="">All Agents</option>
            {agents.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button onClick={() => setShowSettings(!showSettings)} className="settings-btn">
            Settings
          </button>
        </div>
      </header>

      {showSettings && (
        <Settings
          ideProtocol={ideProtocol}
          setIdeProtocol={p => {
            setIdeProtocol(p);
            localStorage.setItem('ide-protocol', p);
          }}
          protocols={IDE_PROTOCOLS}
          onClose={() => setShowSettings(false)}
        />
      )}

      <main className="app-main">
        {error && (
          <div className="error-banner">
            Error: {error.message || 'Failed to load data'}
          </div>
        )}

        {selectedReport ? (
          <ReportDetail
            report={selectedReport}
            onBack={() => setSelectedReport(null)}
            buildIdeUrl={buildIdeUrl}
          />
        ) : (
          <ReportList
            reports={reports}
            loading={loading}
            onSelect={openReport}
          />
        )}
      </main>
    </div>
  );
}
