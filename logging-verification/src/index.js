import 'dotenv/config';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkTenantIdUsage } from './checks/tenant-id.js';
import { checkTelemetryPackage } from './checks/telemetry-package.js';
import { checkLogContext } from './checks/log-context.js';
import { checkMetricLabels } from './checks/metric-labels.js';
import { postReport } from './reports-api.js';
import config from '../config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scan() {
  console.log('🔍 Starting logging verification scan...');
  
  const findings = [];
  const repoRoot = path.resolve(__dirname, '..');

  for (const repoPath of config.repositories) {
    const resolvedPath = path.resolve(repoRoot, repoPath);
    const repoName = path.basename(resolvedPath);
    console.log(`\n📦 Scanning ${repoName}...`);

    const files = await glob('**/*.{ts,js,mjs,cjs}', {
      cwd: resolvedPath,
      ignore: config.excludePatterns,
      absolute: true
    });

    for (const filePath of files) {
      const relativePath = path.relative(resolvedPath, filePath);
      const content = readFileSync(filePath, 'utf-8');

      // Check TENANT_ID usage
      if (config.checks.tenantIdUsage) {
        const tenantIdFindings = checkTenantIdUsage(content, filePath, relativePath, repoName);
        findings.push(...tenantIdFindings);
      }

      // Check @lookout/telemetry package usage
      if (config.checks.telemetryPackage) {
        const telemetryFindings = checkTelemetryPackage(content, filePath, relativePath, repoName);
        findings.push(...telemetryFindings);
      }

      // Check log context
      if (config.checks.logContext) {
        const logContextFindings = checkLogContext(content, filePath, relativePath, repoName);
        findings.push(...logContextFindings);
      }

      // Check metric labels
      if (config.checks.metricLabels) {
        const metricFindings = checkMetricLabels(content, filePath, relativePath, repoName);
        findings.push(...metricFindings);
      }
    }
  }

  // Filter by severity threshold
  const severityOrder = ['low', 'medium', 'high'];
  const thresholdIndex = severityOrder.indexOf(config.severityThreshold);
  const filteredFindings = findings.filter(f => 
    severityOrder.indexOf(f.severity) >= thresholdIndex
  );

  console.log(`\n✅ Scan complete. Found ${filteredFindings.length} issues.`);

  // Generate summary
  const summary = {
    total_issues: filteredFindings.length,
    high: filteredFindings.filter(f => f.severity === 'high').length,
    medium: filteredFindings.filter(f => f.severity === 'medium').length,
    low: filteredFindings.filter(f => f.severity === 'low').length
  };

  console.log(`   High: ${summary.high}`);
  console.log(`   Medium: ${summary.medium}`);
  console.log(`   Low: ${summary.low}`);

  // Post to reports API
  if (config.reporting.apiUrl) {
    console.log(`\n📊 Submitting report to ${config.reporting.apiUrl}...`);
    await postReport({
      agent_name: 'logging-verification',
      report_type: 'logging-scan',
      title: `Logging Verification — ${new Date().toISOString().split('T')[0]}`,
      summary,
      findings: filteredFindings
    }, config.reporting.apiUrl);
    console.log('✅ Report submitted successfully');
  }

  return findings;
}

scan().catch(console.error);
