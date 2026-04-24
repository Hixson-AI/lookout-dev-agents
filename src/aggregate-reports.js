#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';

function parseMarkdownReport(reportPath) {
  const content = fs.readFileSync(reportPath, 'utf8');
  const lines = content.split('\n');
  
  const report = {
    agent: '',
    generated: '',
    issues: [],
    totalIssues: 0,
    learning: null,
  };
  
  let currentSection = null;
  let currentIssue = null;
  
  for (const line of lines) {
    if (line.startsWith('#')) {
      currentSection = line.replace(/^#+\s*/, '').toLowerCase();
      if (currentSection.includes('review') || currentSection.includes('scan')) {
        report.agent = line.replace(/^#+\s*/, '');
      }
    } else if (line.startsWith('Generated:')) {
      report.generated = line.replace('Generated:', '').trim();
    } else if (line.startsWith('Total Issues:')) {
      report.totalIssues = parseInt(line.replace('Total Issues:', '').trim()) || 0;
    } else if (line.startsWith('## Learning Insights')) {
      currentSection = 'learning';
      report.learning = { totalFindings: 0, falsePositives: 0, avgConfidence: 0 };
    } else if (currentSection === 'learning' && line.startsWith('-')) {
      if (line.includes('Total findings')) {
        report.learning.totalFindings = parseInt(line.match(/\d+/)?.[0] || 0);
      } else if (line.includes('False positives')) {
        report.learning.falsePositives = parseInt(line.match(/\d+/)?.[0] || 0);
      } else if (line.includes('Average confidence')) {
        const match = line.match(/(\d+)%/);
        report.learning.avgConfidence = match ? parseInt(match[1]) / 100 : 0;
      }
    } else if (line.startsWith(`- **[HIGH]`)) {
      if (currentIssue) report.issues.push(currentIssue);
      currentIssue = { severity: 'high', content: line };
    } else if (line.startsWith(`- **[MEDIUM]`)) {
      if (currentIssue) report.issues.push(currentIssue);
      currentIssue = { severity: 'medium', content: line };
    } else if (line.startsWith(`- **[LOW]`)) {
      if (currentIssue) report.issues.push(currentIssue);
      currentIssue = { severity: 'low', content: line };
    } else if (currentIssue && line.trim().startsWith('-')) {
      currentIssue.content += '\n  ' + line.trim();
    }
  }
  
  if (currentIssue) report.issues.push(currentIssue);
  
  return report;
}

function aggregateAllReports() {
  const agents = fs.readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .map(d => ({
      name: d.name,
      path: path.join(REPO_ROOT, d.name),
      reportsDir: path.join(REPO_ROOT, d.name, 'reports'),
    }));
  
  const allReports = [];
  
  for (const agent of agents) {
    if (!fs.existsSync(agent.reportsDir)) continue;
    
    const reports = fs.readdirSync(agent.reportsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();
    
    if (reports.length > 0) {
      const latestReport = path.join(agent.reportsDir, reports[0]);
      const parsed = parseMarkdownReport(latestReport);
      parsed.agentName = agent.name;
      allReports.push(parsed);
    }
  }
  
  return allReports;
}

function printAggregateDashboard(reports) {
  console.log(`\n${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${BLUE}║${RESET}        ${BOLD}Lookout Dev Agents - Unified Report${RESET}          ${BOLD}${BLUE}║${RESET}`);
  console.log(`${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${RESET}\n`);
  
  if (reports.length === 0) {
    console.log(`${YELLOW}No reports found. Run agents first.${RESET}\n`);
    return;
  }
  
  let totalIssues = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  
  for (const report of reports) {
    totalIssues += report.totalIssues;
    highCount += report.issues.filter(i => i.severity === 'high').length;
    mediumCount += report.issues.filter(i => i.severity === 'medium').length;
    lowCount += report.issues.filter(i => i.severity === 'low').length;
    
    console.log(`${BOLD}${report.agentName}${RESET}`);
    console.log(`  ${report.agent}`);
    console.log(`  Generated: ${report.generated}`);
    console.log(`  Issues: ${report.totalIssues} (${RED}${report.issues.filter(i => i.severity === 'high').length} HIGH${RESET}, ${YELLOW}${report.issues.filter(i => i.severity === 'medium').length} MEDIUM${RESET}, ${BLUE}${report.issues.filter(i => i.severity === 'low').length} LOW${RESET})`);
    
    if (report.learning) {
      const fpRate = report.learning.totalFindings > 0 
        ? ((report.learning.falsePositives / report.learning.totalFindings) * 100).toFixed(1)
        : 0;
      console.log(`  Learning: ${report.learning.totalFindings} findings, ${fpRate}% FP rate, ${(report.learning.avgConfidence * 100).toFixed(0)}% avg confidence`);
    }
    
    if (report.issues.length > 0 && report.issues.length <= 5) {
      console.log(`  Top issues:`);
      report.issues.slice(0, 5).forEach(issue => {
        const color = issue.severity === 'high' ? RED : issue.severity === 'medium' ? YELLOW : BLUE;
        console.log(`    ${color}•${RESET} ${issue.content.split(':')[1]?.trim() || issue.content.substring(0, 80)}`);
      });
    }
    console.log();
  }
  
  console.log(`${BOLD}Summary${RESET}`);
  console.log(`  Total Issues: ${totalIssues}`);
  console.log(`  ${RED}High: ${highCount}${RESET} | ${YELLOW}Medium: ${mediumCount}${RESET} | ${BLUE}Low: ${lowCount}${RESET}`);
  console.log();
  
  // Generate unified report file
  const outputPath = path.join(REPO_ROOT, 'unified-report.md');
  let unifiedReport = `# Lookout Dev Agents - Unified Report\n\n`;
  unifiedReport += `Generated: ${new Date().toISOString()}\n\n`;
  unifiedReport += `## Summary\n\n`;
  unifiedReport += `- Total Issues: ${totalIssues}\n`;
  unifiedReport += `- High Severity: ${highCount}\n`;
  unifiedReport += `- Medium Severity: ${mediumCount}\n`;
  unifiedReport += `- Low Severity: ${lowCount}\n\n`;
  
  for (const report of reports) {
    unifiedReport += `## ${report.agentName}\n\n`;
    unifiedReport += `Generated: ${report.generated}\n`;
    unifiedReport += `Issues: ${report.totalIssues}\n\n`;
    
    if (report.issues.length > 0) {
      unifiedReport += `### Issues\n\n`;
      report.issues.forEach(issue => {
        unifiedReport += `- [${issue.severity.toUpperCase()}] ${issue.content}\n`;
      });
    }
    unifiedReport += '\n';
  }
  
  fs.writeFileSync(outputPath, unifiedReport);
  console.log(`${GREEN}Unified report saved to: ${outputPath}${RESET}\n`);
}

function main() {
  const reports = aggregateAllReports();
  printAggregateDashboard(reports);
}

main();
