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

function checkPHIHandling(workflow, filePath) {
  const issues = [];
  const phiPatterns = [
    /ssn/i,
    /patient/i,
    /medical/i,
    /diagnosis/i,
    /health/i,
    /phi/i,
    /mrn/i,
    /dob/i,
  ];

  // Check workflow name and description for PHI indicators
  if (workflow.name && phiPatterns.some(p => p.test(workflow.name))) {
    issues.push({
      type: 'phi-handling',
      severity: 'high',
      file: filePath,
      line_number: 1,
      message: 'Workflow name contains PHI-related keywords - verify PHI handling',
      code_context: `Workflow name: ${workflow.name}`,
    });
  }

  // Check nodes for PHI data
  if (workflow.nodes) {
    workflow.nodes.forEach((node, index) => {
      const nodeStr = JSON.stringify(node);
      
      // Check for PHI in node parameters
      if (node.parameters) {
        const paramsStr = JSON.stringify(node.parameters);
        if (phiPatterns.some(p => p.test(paramsStr))) {
          issues.push({
            type: 'phi-handling',
            severity: 'medium',
            file: filePath,
            line_number: index + 1,
            message: `Node "${node.name}" parameters contain PHI-related keywords - verify PHI handling`,
            code_context: `Node: ${node.name} (type: ${node.type})`,
          });
        }
      }

      // Check for hardcoded PHI-like values
      if (/\d{3}-?\d{2}-?\d{4}/.test(nodeStr)) {
        issues.push({
          type: 'phi-handling',
          severity: 'high',
          file: filePath,
          line_number: index + 1,
          message: `Node "${node.name}" contains SSN-like pattern - verify if this is PHI`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }

      // Check log/debug nodes for PHI scrubbing
      if (node.type === 'n8n-nodes-base.debug' || node.type === 'n8n-nodes-base.noOp') {
        if (!/scrub|sanitiz|mask|redact/i.test(JSON.stringify(node.parameters))) {
          issues.push({
            type: 'phi-handling',
            severity: 'medium',
            file: filePath,
            line_number: index + 1,
            message: `Debug node "${node.name}" may log sensitive data - add PHI scrubbing`,
            code_context: `Node: ${node.name} (type: ${node.type})`,
          });
        }
      }
    });
  }

  return issues;
}

function checkErrorHandling(workflow, filePath) {
  const issues = [];

  if (!workflow.nodes) return issues;

  // Check for API nodes without error handlers
  workflow.nodes.forEach((node, index) => {
    if (node.type && node.type.includes('http') || node.type === 'n8n-nodes-base.httpRequest') {
      // Check if node has error output connected
      const hasErrorOutput = workflow.connections?.[node.name]?.error?.length > 0;
      
      if (!hasErrorOutput) {
        issues.push({
          type: 'error-handling',
          severity: 'medium',
          file: filePath,
          line_number: index + 1,
          message: `HTTP node "${node.name}" has no error handler - add error handling for reliability`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }

      // Check for timeout configuration
      if (node.parameters && !node.parameters.timeout) {
        issues.push({
          type: 'error-handling',
          severity: 'low',
          file: filePath,
          line_number: index + 1,
          message: `HTTP node "${node.name}" has no timeout - add timeout configuration`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }
    }

    // Check for retry logic on external API calls
    if (node.type && node.type.includes('http')) {
      if (node.parameters && !node.parameters.retryOnFail) {
        issues.push({
          type: 'error-handling',
          severity: 'low',
          file: filePath,
          line_number: index + 1,
          message: `HTTP node "${node.name}" has no retry logic - consider adding retryOnFail`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }
    }
  });

  return issues;
}

function checkActionLibraryCompliance(workflow, filePath) {
  const issues = [];

  if (!workflow.nodes) return issues;

  // Check for custom nodes that might not be in Action Library
  workflow.nodes.forEach((node, index) => {
    if (node.type && node.type.startsWith('@n8n/n8n-nodes-')) {
      issues.push({
        type: 'action-library',
        severity: 'low',
        file: filePath,
        line_number: index + 1,
        message: `Custom node "${node.name}" (${node.type}) - verify it's registered in Action Library`,
        code_context: `Node: ${node.name} (type: ${node.type})`,
      });
    }
  });

  // Check for missing metadata/documentation
  if (!workflow.tags || workflow.tags.length === 0) {
    issues.push({
      type: 'action-library',
      severity: 'low',
      file: filePath,
      line_number: 1,
      message: 'Workflow has no tags - add tags for Action Library discoverability',
      code_context: 'Workflow metadata',
    });
  }

  return issues;
}

function checkQuality(workflow, filePath) {
  const issues = [];

  if (!workflow.nodes) return issues;

  workflow.nodes.forEach((node, index) => {
    const nodeStr = JSON.stringify(node);

    // Check for hardcoded secrets
    if (/api[_-]?key|secret|password|token/i.test(nodeStr)) {
      if (/['"]\w+['"]/.test(nodeStr)) {
        issues.push({
          type: 'quality',
          severity: 'high',
          file: filePath,
          line_number: index + 1,
          message: `Node "${node.name}" may contain hardcoded credentials - use credentials from workflow`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }
    }

    // Check for Set nodes without input validation
    if (node.type === 'n8n-nodes-base.set' && node.parameters) {
      if (!node.parameters.conditions || node.parameters.conditions.length === 0) {
        issues.push({
          type: 'quality',
          severity: 'low',
          file: filePath,
          line_number: index + 1,
          message: `Set node "${node.name}" has no conditions - add input validation`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }
    }

    // Check for Function nodes with very long code (potential complexity)
    if (node.type === 'n8n-nodes-base.code' && node.parameters) {
      const codeLength = node.parameters.jsCode?.length || 0;
      if (codeLength > 1000) {
        issues.push({
          type: 'quality',
          severity: 'low',
          file: filePath,
          line_number: index + 1,
          message: `Function node "${node.name}" has ${codeLength} characters - consider refactoring`,
          code_context: `Node: ${node.name} (type: ${node.type})`,
        });
      }
    }
  });

  return issues;
}

async function applyLearning(issues, repository, ragStore, config) {
  if (!config.rag.enabled || !config.rag.useLearnedPatterns) {
    return issues;
  }

  const enhancedIssues = [];

  for (const issue of issues) {
    try {
      const context = generateFindingContext(issue);
      const embedding = await generateEmbedding(context);
      
      const similarFindings = await ragStore.findSimilarFindings(
        embedding,
        5,
        config.rag.similarityThreshold
      );

      const falsePositiveRate = similarFindings.length > 0
        ? similarFindings.filter(f => f.is_false_positive).length / similarFindings.length
        : 0;

      if (falsePositiveRate > 0.7) {
        issue.confidence_score = Math.max(0.3, issue.confidence_score - 0.3);
        issue.metadata = {
          ...issue.metadata,
          learning: 'Reduced confidence due to high false positive rate',
          similar_findings: similarFindings.length,
        };
      }

      enhancedIssues.push(issue);
    } catch (error) {
      console.error(`Failed to apply learning for ${issue.file}: ${error.message}`);
      enhancedIssues.push(issue);
    }
  }

  return enhancedIssues;
}

async function storeFindingsInRAG(findings, repository, ragStore, config) {
  if (!config.rag.enabled) return;

  for (const finding of findings) {
    try {
      const context = generateFindingContext(finding);
      const embedding = await generateEmbedding(context);
      finding.embedding = embedding;
      await ragStore.storeFinding(finding);
    } catch (error) {
      console.error(`Failed to store finding in RAG: ${error.message}`);
    }
  }
}

async function scanRepository(repoPath, config, ragStore) {
  const issues = [];
  const repoName = path.basename(repoPath);
  
  console.log(`Scanning ${repoPath}...`);

  const workflowFiles = glob.sync('**/*.json', {
    cwd: repoPath,
    ignore: config.excludePatterns,
    absolute: true,
  });

  for (const filePath of workflowFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const workflow = JSON.parse(content);

      // Verify it's an n8n workflow
      if (!workflow.nodes || !workflow.connections) {
        continue;
      }

      if (config.checks.phiHandling) {
        issues.push(...checkPHIHandling(workflow, filePath));
      }

      if (config.checks.errorHandling) {
        issues.push(...checkErrorHandling(workflow, filePath));
      }

      if (config.checks.actionLibraryCompliance) {
        issues.push(...checkActionLibraryCompliance(workflow, filePath));
      }

      if (config.checks.quality) {
        issues.push(...checkQuality(workflow, filePath));
      }
    } catch (error) {
      console.error(`Failed to scan ${filePath}: ${error.message}`);
    }
  }

  return issues;
}

function generateReport(issues, repository) {
  const high = issues.filter(i => i.severity === 'high').length;
  const medium = issues.filter(i => i.severity === 'medium').length;
  const low = issues.filter(i => i.severity === 'low').length;

  let report = `# Workflow Quality Report\n\n`;
  report += `**Repository:** ${repository}\n`;
  report += `**Total Issues:** ${issues.length}\n`;
  report += `- **High:** ${high}\n`;
  report += `- **Medium:** ${medium}\n`;
  report += `- **Low:** ${low}\n\n`;

  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});

  for (const [type, typeIssues] of Object.entries(grouped)) {
    report += `## ${type.toUpperCase()}\n\n`;
    
    for (const issue of typeIssues) {
      report += `### ${issue.severity.toUpperCase()}: ${issue.message}\n\n`;
      report += `**File:** \`${issue.file}\`\n`;
      if (issue.line_number) {
        report += `**Line:** ${issue.line_number}\n`;
      }
      if (issue.code_context) {
        report += `**Context:** ${issue.code_context}\n`;
      }
      report += '\n';
    }
  }

  return report;
}

async function postToApi(report, findings, config) {
  if (!config.reporting.postToApi) return;

  try {
    const response = await fetch(`${config.reporting.apiUrl}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_name: 'workflow-quality',
        report_type: 'scan',
        title: `Workflow Quality Scan - ${new Date().toISOString()}`,
        summary: {
          total_findings: findings.length,
          high_severity: findings.filter(f => f.severity === 'high').length,
          medium_severity: findings.filter(f => f.severity === 'medium').length,
          low_severity: findings.filter(f => f.severity === 'low').length,
        },
        findings: findings.map(f => ({
          severity: f.severity,
          file_path: f.file,
          line_number: f.line_number,
          message: f.message,
          finding_type: f.type,
          code_context: f.code_context,
          repository: f.repository,
        })),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Report stored in API (id=${data.id})`);
    } else {
      console.error('Failed to store report in API:', response.statusText);
    }
  } catch (error) {
    console.error('Failed to post report to API:', error.message);
  }
}

async function main() {
  const config = loadConfig();
  const ragStore = new RAGStore();
  
  try {
    await ragStore.connect();
  } catch (error) {
    console.error('Failed to connect to RAG, continuing without learning:', error.message);
  }

  const allIssues = [];
  const startTime = Date.now();

  for (const repoPath of config.repositories) {
    const issues = await scanRepository(repoPath, config, ragStore);
    
    const repoName = path.basename(repoPath);
    const issuesWithRepo = issues.map(issue => ({
      ...issue,
      repository: repoName,
    }));

    const enhancedIssues = await applyLearning(issuesWithRepo, repoName, ragStore, config);
    allIssues.push(...enhancedIssues);
  }

  const scanDuration = Date.now() - startTime;

  // Filter by severity threshold
  const severityOrder = { high: 0, medium: 1, low: 2 };
  const minSeverity = severityOrder[config.severityThreshold] || 0;
  const filteredIssues = allIssues.filter(
    issue => severityOrder[issue.severity] <= minSeverity
  );

  // Generate report
  const report = generateReport(filteredIssues, config.repositories.join(', '));
  
  // Save report
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(
    reportsDir,
    `workflow-quality-${new Date().toISOString().split('T')[0]}.md`
  );
  fs.writeFileSync(reportPath, report);
  console.log(`Report saved to ${reportPath}`);
  console.log(`Total issues: ${filteredIssues.length}`);

  // Store findings in RAG
  await storeFindingsInRAG(filteredIssues, config.repositories.join(','), ragStore, config);

  // Post to API
  await postToApi(report, filteredIssues, config);

  // Record scan history
  try {
    await ragStore.recordScanHistory({
      repository: config.repositories.join(','),
      total_findings: filteredIssues.length,
      high_severity: filteredIssues.filter(f => f.severity === 'high').length,
      medium_severity: filteredIssues.filter(f => f.severity === 'medium').length,
      low_severity: filteredIssues.filter(f => f.severity === 'low').length,
      scan_duration_ms: scanDuration,
      learning_enabled: config.rag.enabled,
    });
  } catch (error) {
    console.error('Failed to record scan history:', error.message);
  }

  await ragStore.disconnect();
}

main().catch(console.error);
