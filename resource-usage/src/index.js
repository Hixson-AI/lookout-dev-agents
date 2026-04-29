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

function checkMemoryLeaks(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for addEventListener without removeEventListener
      if (/\.(addEventListener|on)/.test(line) && !/removeEventListener|off/i.test(line)) {
        issues.push({
          type: 'memory-leak',
          severity: 'medium',
          file: filePath,
          line_number: lineNum,
          message: 'addEventListener without corresponding removeEventListener - potential memory leak',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for setTimeout/setInterval without clearTimeout/clearInterval
      if (/(setTimeout|setInterval)\s*\(/.test(line) && !/(clearTimeout|clearInterval)/.test(line)) {
        issues.push({
          type: 'memory-leak',
          severity: 'medium',
          file: filePath,
          line_number: lineNum,
          message: 'Timer created without corresponding clear - potential memory leak',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for global variable assignments
      if (/global\./.test(line) && !/process|console|Buffer/i.test(line)) {
        issues.push({
          type: 'memory-leak',
          severity: 'low',
          file: filePath,
          line_number: lineNum,
          message: 'Global variable assignment - can cause memory leaks',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for large array allocations
      if (/new Array\s*\(\s*\d{4,}\s*\)/.test(line)) {
        issues.push({
          type: 'memory-leak',
          severity: 'low',
          file: filePath,
          line_number: lineNum,
          message: 'Large array allocation - consider lazy loading or pagination',
          code_context: line.trim().substring(0, 120),
        });
      }
    });
  } catch (error) {
    // Skip files that can't be read
  }

  return issues;
}

function checkConnectionLeaks(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for database connection without close
      if (/(connect|createConnection)\s*\(/.test(line) && !/\.close\(\)|\.end\(\)/.test(line)) {
        issues.push({
          type: 'connection-leak',
          severity: 'high',
          file: filePath,
          line_number: lineNum,
          message: 'Database connection without corresponding close/dispose - potential connection leak',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for HTTP client without dispose
      if (/new (HttpClient|Agent|axios)\s*\(/.test(line) && !/\.close\(\)|\.destroy\(\)/.test(line)) {
        issues.push({
          type: 'connection-leak',
          severity: 'medium',
          file: filePath,
          line_number: lineNum,
          message: 'HTTP client created without dispose - potential connection leak',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for file handle without close
      if (/fs\.(open|createWriteStream|createReadStream)\s*\(/.test(line) && !/\.close\(\)/.test(line)) {
        issues.push({
          type: 'connection-leak',
          severity: 'high',
          file: filePath,
          line_number: lineNum,
          message: 'File handle opened without close - potential resource leak',
          code_context: line.trim().substring(0, 120),
        });
      }
    });
  } catch (error) {
    // Skip files that can't be read
  }

  return issues;
}

function checkCleanupIssues(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Check for try without finally
    const tryMatches = [...content.matchAll(/try\s*{/g)];
    const finallyMatches = [...content.matchAll(/finally\s*{/g)];

    if (tryMatches.length > finallyMatches.length) {
      issues.push({
        type: 'cleanup-issue',
        severity: 'medium',
        file: filePath,
        line_number: tryMatches[finallyMatches.length].index,
        message: 'try block without finally - resources may not be cleaned up on error',
        code_context: 'Missing finally block',
      });
    }

    // Check for async functions without error handling
    const asyncMatches = [...content.matchAll(/async\s+function|async\s+\w+\s*\(/g)];
    asyncMatches.forEach((match) => {
      const startIndex = match.index;
      let endIndex = startIndex + 1000; // Look ahead 1000 chars
      if (endIndex > content.length) endIndex = content.length;
      const snippet = content.substring(startIndex, endIndex);

      if (!/catch|try/.test(snippet)) {
        issues.push({
          type: 'cleanup-issue',
          severity: 'low',
          file: filePath,
          line_number: content.substring(0, startIndex).split('\n').length,
          message: 'Async function without error handling - errors may be unhandled',
          code_context: match[0],
        });
      }
    });
  } catch (error) {
    // Skip files that can't be read
  }

  return issues;
}

function checkPerformance(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for nested loops
      if (/for\s*\(/.test(line)) {
        let nestedCount = 0;
        for (let i = index + 1; i < Math.min(index + 20, lines.length); i++) {
          if (/for\s*\(/.test(lines[i])) {
            nestedCount++;
          }
        }
        if (nestedCount >= 2) {
          issues.push({
            type: 'performance',
            severity: 'medium',
            file: filePath,
            line_number: lineNum,
            message: 'Nested loops detected - consider optimization or alternative algorithm',
            code_context: line.trim().substring(0, 120),
          });
        }
      }

      // Check for synchronous operations in async context
      if (/fs\.readFileSync|fs\.writeFileSync/.test(line)) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          file: filePath,
          line_number: lineNum,
          message: 'Synchronous file operation in async context - blocks event loop',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for JSON.parse on large data without streaming
      if (/JSON\.parse\s*\(\s*\w+\s*\)/.test(line) && /await/.test(lines[index - 1] || '')) {
        issues.push({
          type: 'performance',
          severity: 'low',
          file: filePath,
          line_number: lineNum,
          message: 'Large JSON parse - consider streaming for better performance',
          code_context: line.trim().substring(0, 120),
        });
      }

      // Check for array operations inside loops
      if (/for.*\{/.test(line)) {
        let hasArrayOp = false;
        for (let i = index + 1; i < Math.min(index + 30, lines.length); i++) {
          if (/\}/.test(lines[i])) break;
          if (/\.(map|filter|reduce|forEach)\s*\(/.test(lines[i])) {
            hasArrayOp = true;
            break;
          }
        }
        if (hasArrayOp) {
          issues.push({
            type: 'performance',
            severity: 'low',
            file: filePath,
            line_number: lineNum,
            message: 'Array operation inside loop - may cause O(n²) complexity',
            code_context: line.trim().substring(0, 120),
          });
        }
      }
    });
  } catch (error) {
    // Skip files that can't be read
  }

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

  const files = glob.sync('**/*.{js,ts}', {
    cwd: repoPath,
    ignore: config.excludePatterns,
    absolute: true,
  });

  for (const filePath of files) {
    if (config.checks.memoryLeaks) {
      issues.push(...checkMemoryLeaks(filePath));
    }

    if (config.checks.connectionLeaks) {
      issues.push(...checkConnectionLeaks(filePath));
    }

    if (config.checks.cleanupIssues) {
      issues.push(...checkCleanupIssues(filePath));
    }

    if (config.checks.performance) {
      issues.push(...checkPerformance(filePath));
    }
  }

  return issues.map(issue => ({
    ...issue,
    repository: repoName,
  }));
}

function generateReport(issues, repository) {
  const high = issues.filter(i => i.severity === 'high').length;
  const medium = issues.filter(i => i.severity === 'medium').length;
  const low = issues.filter(i => i.severity === 'low').length;

  let report = `# Resource Usage Report\n\n`;
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
    const response = await fetch(config.reporting.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_name: 'resource-usage',
        report_type: 'scan',
        title: `Resource Usage Scan - ${new Date().toISOString()}`,
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
    allIssues.push(...issues);
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
    `resource-usage-${new Date().toISOString().split('T')[0]}.md`
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
