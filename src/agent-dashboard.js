#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const AGENT_COLORS = {
  'cybersecurity-hardening': '\x1b[31m', // red
  'architecture-review': '\x1b[36m', // cyan
};

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';

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
          name: entry.name,
          displayName: nameMatch ? nameMatch[1].trim() : entry.name,
          description: descMatch ? descMatch[1].trim() : 'No description',
          version: versionMatch ? versionMatch[1] : pkg.version,
          path: agentPath,
          color: AGENT_COLORS[entry.name] || BLUE,
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

function formatStatus(status) {
  switch (status) {
    case 'ready': return `${GREEN}●${RESET} Ready`;
    case 'needs-config': return `${YELLOW}○${RESET} Needs .env`;
    case 'needs-install': return `${YELLOW}○${RESET} Needs npm install`;
    default: return `${RED}●${RESET} Unknown`;
  }
}

function formatDate(date) {
  if (!date) return 'Never';
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Recently';
}

function printHeader() {
  console.log(`\n${BOLD}${MAGENTA}╔════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${MAGENTA}║${RESET}        ${BOLD}Lookout Dev Agents Dashboard${RESET}              ${BOLD}${MAGENTA}║${RESET}`);
  console.log(`${BOLD}${MAGENTA}╚════════════════════════════════════════════════════════════╝${RESET}\n`);
}

function printAgentList(agents) {
  console.log(`${BOLD}Available Agents:${RESET}\n`);
  
  agents.forEach((agent, idx) => {
    const { status, lastReport, lastReportDate } = getAgentStatus(agent);
    console.log(`${agent.color}[${idx + 1}]${RESET} ${BOLD}${agent.displayName}${RESET}`);
    console.log(`    ${agent.description}`);
    console.log(`    Status: ${formatStatus(status)} | Version: ${agent.version}`);
    if (lastReport) {
      console.log(`    Last report: ${lastReport} (${formatDate(lastReportDate)})`);
    }
    console.log();
  });
}

function printMenu() {
  console.log(`${BOLD}Actions:${RESET}`);
  console.log(`  ${GREEN}[r]${RESET} Run all agents`);
  console.log(`  ${GREEN}[1-N]${RESET} Run specific agent`);
  console.log(`  ${GREEN}[s]${RESET} Show agent stats`);
  console.log(`  ${GREEN}[i]${RESET} Initialize all agents`);
  console.log(`  ${GREEN}[q]${RESET} Quit\n`);
}

function runAgent(agent) {
  console.log(`\n${BOLD}Running ${agent.displayName}...${RESET}\n`);
  
  try {
    execSync('npm run scan', { cwd: agent.path, stdio: 'inherit' });
    console.log(`\n${GREEN}✓${RESET} ${agent.displayName} completed successfully\n`);
  } catch (error) {
    console.log(`\n${RED}✗${RESET} ${agent.displayName} failed\n`);
  }
}

function showAgentStats(agent) {
  console.log(`\n${BOLD}${agent.displayName} Statistics${RESET}\n`);
  
  try {
    const output = execSync('npm run stats', { cwd: agent.path, encoding: 'utf8' });
    console.log(output);
  } catch (error) {
    console.log(`Stats not available (run npm run stats in ${agent.name})`);
  }
}

function initializeAgent(agent) {
  const envPath = path.join(agent.path, '.env');
  if (!fs.existsSync(envPath)) {
    const envExamplePath = path.join(agent.path, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log(`${GREEN}✓${RESET} Created .env for ${agent.displayName}`);
    }
  }
  
  try {
    execSync('npm install', { cwd: agent.path, stdio: 'inherit' });
    console.log(`${GREEN}✓${RESET} Dependencies installed for ${agent.displayName}`);
  } catch (error) {
    console.log(`${YELLOW}○${RESET} npm install failed for ${agent.displayName}`);
  }
  
  try {
    execSync('npm run init-rag', { cwd: agent.path, stdio: 'inherit' });
    console.log(`${GREEN}✓${RESET} RAG initialized for ${agent.displayName}`);
  } catch (error) {
    console.log(`${YELLOW}○${RESET} RAG init failed for ${agent.displayName} (docker-compose may need to be started)`);
  }
}

function main() {
  printHeader();
  
  const agents = discoverAgents();
  printAgentList(agents);
  printMenu();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Use: node src/agent-dashboard.js [command]');
    console.log('Commands: run-all, run [agent-name], stats [agent-name], init-all, init [agent-name]');
    return;
  }
  
  const command = args[0];
  
  if (command === 'run-all') {
    console.log(`${BOLD}Running all agents...${RESET}\n`);
    for (const agent of agents) {
      runAgent(agent);
    }
  } else if (command === 'run') {
    const agentName = args[1];
    const agent = agents.find(a => a.name === agentName);
    if (agent) {
      runAgent(agent);
    } else {
      console.log(`Agent not found: ${agentName}`);
    }
  } else if (command === 'stats') {
    const agentName = args[1];
    if (agentName) {
      const agent = agents.find(a => a.name === agentName);
      if (agent) showAgentStats(agent);
    } else {
      for (const agent of agents) {
        showAgentStats(agent);
      }
    }
  } else if (command === 'init-all') {
    console.log(`${BOLD}Initializing all agents...${RESET}\n`);
    for (const agent of agents) {
      console.log(`\nInitializing ${agent.displayName}...`);
      initializeAgent(agent);
    }
  } else if (command === 'init') {
    const agentName = args[1];
    const agent = agents.find(a => a.name === agentName);
    if (agent) {
      initializeAgent(agent);
    } else {
      console.log(`Agent not found: ${agentName}`);
    }
  } else {
    console.log(`Unknown command: ${command}`);
  }
}

main();
