import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { RAGStore } from './rag-store.js';
import { generateEmbedding, generateFindingContext } from './embeddings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../config.json');

function loadConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return config;
  } catch (error) {
    console.error('Failed to load config:', error.message);
    process.exit(1);
  }
}

function checkDependencies(repoPath) {
  const issues = [];
  const packageJsonPath = path.join(repoPath, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (pkg.dependencies) {
      Object.entries(pkg.dependencies).forEach(([name, version]) => {
        if (version.startsWith('^')) {
          issues.push({
            type: 'dependency',
            severity: 'low',
            file: 'package.json',
            message: `Dependency ${name}@${version} uses caret semver range - consider pinning exact versions for production`,
            code_context: `"${name}": "${version}"`
          });
        }
      });
    }
  }

  return issues;
}

function checkSecrets(repoPath, excludePatterns) {
  const issues = [];
  const pattern = '**/*.{js,ts,json,yaml,yml,env,md}';

  const files = glob.sync(pattern, {
    cwd: repoPath,
    ignore: excludePatterns,
    absolute: true
  });

  const secretPatterns = [
    { pattern: /api[_-]?key\s*[:=]\s*['"]\w+['"]/i, name: 'API key' },
    { pattern: /password\s*[:=]\s*['"]\w+['"]/i, name: 'Password' },
    { pattern: /secret[_-]?key\s*[:=]\s*['"]\w+['"]/i, name: 'Secret key' },
    { pattern: /token\s*[:=]\s*['"]\w+['"]/i, name: 'Token' },
    { pattern: /private[_-]?key\s*[:=]\s*['"]/i, name: 'Private key' }
  ];

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      secretPatterns.forEach(({ pattern, name }) => {
        const matches = content.match(pattern);
        if (matches) {
          const lineNum = content.substring(0, matches.index).split('\n').length;
          issues.push({
            type: 'secret',
            severity: 'high',
            file: filePath,
            line_number: lineNum,
            message: `Potential ${name} detected in source file`,
            code_context: `Line ${lineNum}: ${matches[0]}`
          });
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  });

  return issues;
}

function checkCodePatterns(repoPath, excludePatterns) {
  const issues = [];
  const pattern = '**/*.{js,ts}';

  const files = glob.sync(pattern, {
    cwd: repoPath,
    ignore: excludePatterns,
    absolute: true
  });

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      if (/\beval\s*\(/.test(content)) {
        const match = content.match(/\beval\s*\(/);
        const lineNum = content.substring(0, match.index).split('\n').length;
        issues.push({
          type: 'code',
          severity: 'high',
          file: filePath,
          line_number: lineNum,
          message: 'Use of eval() detected - security risk',
          code_context: `Line ${lineNum}: ${content.split('\n')[lineNum - 1].trim()}`
        });
      }

      if (/\.innerHTML\s*=/.test(content)) {
        const match = content.match(/\.innerHTML\s*=/);
        const lineNum = content.substring(0, match.index).split('\n').length;
        issues.push({
          type: 'code',
          severity: 'medium',
          file: filePath,
          line_number: lineNum,
          message: 'Direct innerHTML assignment - potential XSS vulnerability',
          code_context: `Line ${lineNum}: ${content.split('\n')[lineNum - 1].trim()}`
        });
      }

      if (/https?:\/\/[^:]+:[^@]+@/.test(content)) {
        const match = content.match(/https?:\/\/[^:]+:[^@]+@/);
        const lineNum = content.substring(0, match.index).split('\n').length;
        issues.push({
          type: 'code',
          severity: 'high',
          file: filePath,
          line_number: lineNum,
          message: 'Hardcoded credentials in URL detected',
          code_context: `Line ${lineNum}: ${content.split('\n')[lineNum - 1].trim()}`
        });
      }

      if (/\bconsole\.(log|debug|info)\(/.test(content) && !filePath.includes('test')) {
        const match = content.match(/\bconsole\.(log|debug|info)\(/);
        const lineNum = content.substring(0, match.index).split('\n').length;
        issues.push({
          type: 'code',
          severity: 'low',
          file: filePath,
          line_number: lineNum,
          message: 'Console logging in production code - should be removed or use proper logger',
          code_context: `Line ${lineNum}: ${content.split('\n')[lineNum - 1].trim()}`
        });
      }
    } catch (error) {
      // Skip files that can't be read
    }
  });

  return issues;
}

function checkInfrastructure(repoPath) {
  const issues = [];
  const dockerfilePath = path.join(repoPath, 'Dockerfile');

  if (fs.existsSync(dockerfilePath)) {
    const dockerfile = fs.readFileSync(dockerfilePath, 'utf8');

    if (!/USER\s+\w+/.test(dockerfile)) {
      issues.push({
        type: 'infrastructure',
        severity: 'medium',
        file: dockerfilePath,
        line_number: 1,
        message: 'Dockerfile does not specify USER directive - containers may run as root',
        code_context: 'Missing USER directive'
      });
    }

    if (/FROM\s+\w+:\s*latest/i.test(dockerfile)) {
      const match = dockerfile.match(/FROM\s+\w+:\s*latest/i);
      const lineNum = dockerfile.substring(0, match.index).split('\n').length;
      issues.push({
        type: 'infrastructure',
        severity: 'medium',
        file: dockerfilePath,
        line_number: lineNum,
        message: 'Dockerfile uses :latest tag - use specific version tags for reproducibility',
        code_context: `Line ${lineNum}: ${dockerfile.split('\n')[lineNum - 1].trim()}`
      });
    }
  }

  return issues;
}

async function applyLearning(issues, repository, ragStore, config) {
  if (!config.rag.enabled || !config.rag.useLearnedPatterns) {
    return issues;
  }

  const enhancedIssues = [];
  let ragDisabled = false;

  for (const issue of issues) {
    try {
      if (ragDisabled) {
        enhancedIssues.push({ ...issue, confidence_score: 0.5 });
        continue;
      }

      const context = generateFindingContext(issue);
      const embedding = await generateEmbedding(context);

      // Find similar historical findings
      const similar = await ragStore.findSimilarFindings(
        embedding,
        5,
        config.rag.similarityThreshold
      );

      // Calculate confidence based on similarity
      let confidence = 0.5;
      if (similar.length > 0) {
        const avgSimilarity = similar.reduce((sum, s) => sum + s.similarity, 0) / similar.length;
        const falsePositiveRate = similar.filter(s => s.is_false_positive).length / similar.length;

        // Boost confidence if similar findings were true positives
        confidence = 0.5 + (avgSimilarity * 0.3) - (falsePositiveRate * 0.2);
        confidence = Math.max(0.1, Math.min(0.95, confidence));
      }

      // Filter out likely false positives
      if (confidence >= config.rag.confidenceThreshold) {
        enhancedIssues.push({
          ...issue,
          confidence_score: confidence,
          similar_findings: similar.length
        });
      }
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('auth previously failed')) {
        console.warn('OpenRouter auth failed — disabling RAG learning for this scan');
        config.rag.enabled = false;
        ragDisabled = true;
      } else {
        console.error(`Failed to apply learning for ${issue.file}:`, error.message);
      }
      // Include issue anyway if learning fails
      enhancedIssues.push({ ...issue, confidence_score: 0.5 });
    }
  }

  return enhancedIssues;
}

async function storeFindingsInRAG(issues, repository, ragStore, config) {
  if (!config.rag.enabled || !config.rag.storeFindings) {
    return;
  }

  for (const issue of issues) {
    try {
      const context = generateFindingContext(issue);
      const embedding = await generateEmbedding(context);

      await ragStore.storeFinding({
        ...issue,
        repository,
        embedding,
        confidence_score: issue.confidence_score || 0.5
      });
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('auth previously failed')) {
        console.warn('OpenRouter auth failed — skipping RAG storage for remaining findings');
        config.rag.enabled = false;
        return;
      }
      console.error(`Failed to store finding in RAG:`, error.message);
    }
  }
}

async function scanRepository(repoPath, config, ragStore) {
  console.log(`\nScanning ${repoPath}...`);
  const issues = [];

  if (config.checks.dependencies) {
    issues.push(...checkDependencies(repoPath));
  }

  if (config.checks.secrets) {
    issues.push(...checkSecrets(repoPath, config.excludePatterns));
  }

  if (config.checks.codePatterns) {
    issues.push(...checkCodePatterns(repoPath, config.excludePatterns));
  }

  if (config.checks.infrastructure) {
    issues.push(...checkInfrastructure(repoPath));
  }

  // Apply self-learning
  const enhancedIssues = await applyLearning(issues, path.basename(repoPath), ragStore, config);

  return enhancedIssues;
}

function filterBySeverity(issues, threshold) {
  const severityOrder = { low: 1, medium: 2, high: 3 };
  const minSeverity = severityOrder[threshold] || 2;

  return issues.filter(issue => severityOrder[issue.severity] >= minSeverity);
}

async function generateReport(allIssues, config, ragStore) {
  const reportDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const reportPath = path.join(reportDir, `security-scan-${timestamp}.md`);

  let report = '# Security Scan Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Severity Threshold: ${config.severityThreshold}\n`;
  report += `Learning Enabled: ${config.rag.enabled}\n\n`;

  let totalIssues = 0;
  allIssues.forEach(({ repo, issues }) => {
    if (issues.length > 0) {
      report += `## ${repo}\n\n`;
      issues.forEach(issue => {
        const confidence = issue.confidence_score ? ` (confidence: ${(issue.confidence_score * 100).toFixed(0)}%)` : '';
        const similar = issue.similar_findings ? ` [${issue.similar_findings} similar historical findings]` : '';
        report += `- **[${issue.severity.toUpperCase()}]** ${issue.file}: ${issue.message}${confidence}${similar}\n`;
        if (issue.code_context) {
          report += `  \`${issue.code_context}\`\n`;
        }
        totalIssues++;
      });
      report += '\n';
    }
  });

  if (totalIssues === 0) {
    report += '✅ No security issues found above severity threshold.\n';
  } else {
    report += `\nTotal Issues: ${totalIssues}\n`;
  }

  // Add learning insights if enabled
  if (config.rag.enabled) {
    const stats = await ragStore.getLearningStats();
    const fpByType = await ragStore.getFalsePositiveRateByType();
    
    report += '\n## Learning Insights\n\n';
    report += `- Total findings in knowledge base: ${stats.total_findings}\n`;
    report += `- False positives: ${stats.false_positives} (${((stats.false_positives / stats.total_findings) * 100).toFixed(1)}%)\n`;
    report += `- Average confidence: ${(stats.avg_confidence * 100).toFixed(0)}%\n`;
    report += `- Repositories scanned: ${stats.repositories_scanned}\n\n`;
    
    if (fpByType.length > 0) {
      report += '### False Positive Rate by Type\n\n';
      fpByType.forEach(row => {
        report += `- ${row.type}: ${row.fp_rate}% (${row.false_positives}/${row.total})\n`;
      });
    }
  }

  fs.writeFileSync(reportPath, report);
  console.log(`\nReport saved to ${reportPath}`);
  console.log(`Total issues found: ${totalIssues}`);

  // Also post to reports API
  await postReportToApi(allIssues, totalIssues, config);
}

async function postReportToApi(allIssues, totalIssues, config) {
  const apiUrl = process.env.REPORTS_API_URL;
  if (!apiUrl) return;

  try {
    const MAX_CONTEXT = 2000;
    const findings = allIssues.flatMap(({ repo, issues }) =>
      issues.map(issue => ({
        severity: issue.severity,
        file_path: issue.file,
        line_number: issue.line_number || null,
        message: issue.message,
        finding_type: issue.type || null,
        code_context: issue.code_context ? issue.code_context.slice(0, MAX_CONTEXT) : null,
        repository: repo,
        metadata: {
          confidence_score: issue.confidence_score || null,
          similar_findings: issue.similar_findings || null
        }
      }))
    );

    const high = findings.filter(f => f.severity === 'high').length;
    const medium = findings.filter(f => f.severity === 'medium').length;
    const low = findings.filter(f => f.severity === 'low').length;

    const response = await fetch(`${apiUrl}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_name: 'cybersecurity-hardening',
        report_type: 'security-scan',
        title: `Security Scan — ${new Date().toISOString().split('T')[0]}`,
        summary: {
          total_issues: totalIssues,
          high,
          medium,
          low,
          severity_threshold: config.severityThreshold,
          repositories_scanned: config.repositories.length
        },
        findings
      })
    });

    if (!response.ok) {
      console.warn(`Failed to post report to API: ${response.status} ${response.statusText}`);
    } else {
      const data = await response.json();
      console.log(`Report stored in API (id=${data.id})`);
    }
  } catch (error) {
    console.warn('Failed to post report to API:', error.message);
  }
}

async function main() {
  const config = loadConfig();
  const ragStore = new RAGStore();

  // Connect to RAG store if enabled
  if (config.rag.enabled) {
    try {
      await ragStore.connect();
    } catch (error) {
      console.warn('Failed to connect to RAG store, continuing without learning:', error.message);
      config.rag.enabled = false;
    }
  }

  const allIssues = [];
  const startTime = Date.now();

  for (const repo of config.repositories) {
    const repoPath = path.resolve(__dirname, '../../', repo);
    if (fs.existsSync(repoPath)) {
      const issues = await scanRepository(repoPath, config, ragStore);
      allIssues.push({ repo, issues });

      // Store findings in RAG for learning
      if (config.rag.enabled) {
        await storeFindingsInRAG(issues, repo, ragStore, config);
      }
    } else {
      console.log(`Skipping ${repo} - not found`);
    }
  }

  const scanDuration = Date.now() - startTime;

  // Record scan history
  if (config.rag.enabled) {
    for (const { repo, issues } of allIssues) {
      const high = issues.filter(i => i.severity === 'high').length;
      const medium = issues.filter(i => i.severity === 'medium').length;
      const low = issues.filter(i => i.severity === 'low').length;

      await ragStore.recordScanHistory({
        repository: repo,
        total_findings: issues.length,
        high_severity: high,
        medium_severity: medium,
        low_severity: low,
        scan_duration_ms: scanDuration,
        learning_enabled: config.rag.enabled
      });
    }
  }

  // Filter by severity
  const filteredIssues = allIssues.map(({ repo, issues }) => ({
    repo,
    issues: filterBySeverity(issues, config.severityThreshold)
  }));

  // Generate report
  await generateReport(filteredIssues, config, ragStore);

  // Disconnect from RAG store
  if (config.rag.enabled) {
    await ragStore.disconnect();
  }
}

main().catch(console.error);
