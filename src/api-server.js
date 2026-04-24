#!/usr/bin/env node

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execSync);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3457;

app.use(express.json());

function discoverAgents() {
  const agents = [];
  const entries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      const agentPath = path.join(REPO_ROOT, entry.name);
      const skillPath = path.join(agentPath, 'SKILL.md');
      const pkgPath = path.join(agentPath, 'package.json');
      
      if (fs.existsSync(skillPath) && fs.existsSync(pkgPath)) {
        const skillContent = fs.readFileSync(skillPath, 'utf8');
        const nameMatch = skillContent.match(/^name:\s*(.+)$/m);
        const descMatch = skillContent.match(/^description:\s*(.+)$/m);
        const versionMatch = skillContent.match(/version:\s*"([^"]+)"/);
        
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        
        agents.push({
          id: entry.name,
          displayName: nameMatch ? nameMatch[1].trim() : entry.name,
          description: descMatch ? descMatch[1].trim() : 'No description',
          version: versionMatch ? versionMatch[1] : pkg.version,
          path: agentPath,
        });
      }
    }
  }
  
  return agents;
}

function getAgentStatus(agent) {
  const reportsDir = path.join(agent.path, 'reports');
  const envPath = path.join(agent.path, '.env');
  const nodeModulesPath = path.join(agent.path, 'node_modules');
  
  let status = 'ready';
  let lastReport = null;
  let lastReportDate = null;
  
  if (!fs.existsSync(envPath)) {
    status = 'needs-config';
  } else if (!fs.existsSync(nodeModulesPath)) {
    status = 'needs-install';
  }
  
  if (fs.existsSync(reportsDir)) {
    const reports = fs.readdirSync(reportsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();
    
    if (reports.length > 0) {
      lastReport = reports[0];
      const stats = fs.statSync(path.join(reportsDir, lastReport));
      lastReportDate = stats.mtime;
    }
  }
  
  return { status, lastReport, lastReportDate };
}

function parseReport(reportPath) {
  try {
    const content = fs.readFileSync(reportPath, 'utf8');
    const totalMatch = content.match(/Total Issues:\s*(\d+)/);
    const totalIssues = totalMatch ? parseInt(totalMatch[1]) : 0;
    
    const highMatch = content.match(/\*\*\[HIGH\]\*\*/g);
    const mediumMatch = content.match(/\*\*\[MEDIUM\]\*\*/g);
    const lowMatch = content.match(/\*\*\[LOW\]\*\*/g);
    
    const learningMatch = content.match(/Total findings in knowledge base:\s*(\d+)/);
    const learningTotal = learningMatch ? parseInt(learningMatch[1]) : 0;
    
    return {
      totalIssues,
      high: highMatch ? highMatch.length : 0,
      medium: mediumMatch ? mediumMatch.length : 0,
      low: lowMatch ? lowMatch.length : 0,
      learningTotal,
    };
  } catch {
    return null;
  }
}

// GET /agents - List all agents
app.get('/agents', (req, res) => {
  const agents = discoverAgents();
  const agentsWithStatus = agents.map(agent => ({
    ...agent,
    status: getAgentStatus(agent),
  }));
  res.json({ agents: agentsWithStatus });
});

// GET /agents/:id - Get specific agent details
app.get('/agents/:id', (req, res) => {
  const agents = discoverAgents();
  const agent = agents.find(a => a.id === req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  const status = getAgentStatus(agent);
  const reportData = status.lastReport ? parseReport(path.join(agent.path, 'reports', status.lastReport)) : null;
  
  res.json({
    ...agent,
    status,
    report: reportData,
  });
});

// POST /agents/:id/run - Run a specific agent
app.post('/agents/:id/run', async (req, res) => {
  const agents = discoverAgents();
  const agent = agents.find(a => a.id === req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  res.json({ message: `Running ${agent.displayName}...`, agentId: agent.id });
  
  // Run in background
  (async () => {
    try {
      exec('npm run scan', { cwd: agent.path });
    } catch (error) {
      console.error(`Failed to run ${agent.id}:`, error.message);
    }
  })();
});

// POST /agents/run-all - Run all agents
app.post('/agents/run-all', async (req, res) => {
  const agents = discoverAgents();
  
  res.json({ message: `Running ${agents.length} agents...`, agentCount: agents.length });
  
  // Run in background
  (async () => {
    for (const agent of agents) {
      try {
        exec('npm run scan', { cwd: agent.path });
      } catch (error) {
        console.error(`Failed to run ${agent.id}:`, error.message);
      }
    }
  })();
});

// GET /agents/:id/stats - Get agent learning stats
app.get('/agents/:id/stats', (req, res) => {
  const agents = discoverAgents();
  const agent = agents.find(a => a.id === req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  try {
    const output = exec('npm run stats', { cwd: agent.path, encoding: 'utf8' });
    res.json({ 
      agentId: agent.id,
      stats: output,
      raw: output,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats', message: error.message });
  }
});

// GET /reports/unified - Get unified report
app.get('/reports/unified', (req, res) => {
  const unifiedReportPath = path.join(REPO_ROOT, 'unified-report.md');
  
  if (!fs.existsSync(unifiedReportPath)) {
    return res.status(404).json({ error: 'Unified report not found. Run aggregate-reports first.' });
  }
  
  const content = fs.readFileSync(unifiedReportPath, 'utf8');
  res.json({ report: content });
});

// POST /reports/unified - Generate unified report
app.post('/reports/unified', (req, res) => {
  try {
    exec('node src/aggregate-reports.js', { cwd: REPO_ROOT, encoding: 'utf8' });
    const unifiedReportPath = path.join(REPO_ROOT, 'unified-report.md');
    const content = fs.readFileSync(unifiedReportPath, 'utf8');
    res.json({ message: 'Unified report generated', report: content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate unified report', message: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Dev Agents API running on http://localhost:${PORT}`);
  console.log(`Try: curl http://localhost:${PORT}/agents`);
});
