import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import yaml from 'js-yaml';
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

function loadOpenAPISpec(repoPath, specPath) {
  const fullPath = path.join(repoPath, specPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`OpenAPI spec not found: ${fullPath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (specPath.endsWith('.yaml') || specPath.endsWith('.yml')) {
      return yaml.load(content);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to load OpenAPI spec: ${error.message}`);
    return null;
  }
}

function checkSchemaValidation(repoPath, openapiSpec) {
  const issues = [];

  if (!openapiSpec || !openapiSpec.paths) return issues;

  const routeFiles = glob.sync('**/routes/**/*.ts', {
    cwd: repoPath,
    absolute: true,
  });

  for (const [path, methods] of Object.entries(openapiSpec.paths)) {
    for (const [method, spec] of Object.entries(methods)) {
      if (spec.requestBody && spec.requestBody.content) {
        // Check if route handler exists
        const routeHandler = routeFiles.find(file => 
          file.toLowerCase().includes(path.replace(/\//g, '-').toLowerCase()) ||
          file.toLowerCase().includes(method.toLowerCase())
        );

        if (!routeHandler) {
          issues.push({
            type: 'schema-validation',
            severity: 'medium',
            file: openapiSpec.info?.title || 'openapi.yaml',
            line_number: 1,
            message: `Route ${method.toUpperCase()} ${path} defined in OpenAPI but handler not found in routes/`,
            code_context: `${method.toUpperCase()} ${path}`,
          });
        }
      }

      // Check for required fields in response schema
      if (spec.responses) {
        for (const [statusCode, responseSpec] of Object.entries(spec.responses)) {
          if (responseSpec.content && responseSpec.content['application/json']) {
            const schema = responseSpec.content['application/json'].schema;
            if (schema && schema.required && schema.required.length === 0) {
              issues.push({
                type: 'schema-validation',
                severity: 'low',
                file: openapiSpec.info?.title || 'openapi.yaml',
                line_number: 1,
                message: `Response schema for ${method.toUpperCase()} ${path} has no required fields - consider adding required fields`,
                code_context: `${method.toUpperCase()} ${path} - ${statusCode}`,
              });
            }
          }
        }
      }
    }
  }

  return issues;
}

function checkSecurity(repoPath, openapiSpec) {
  const issues = [];

  if (!openapiSpec || !openapiSpec.paths) return issues;

  const routeFiles = glob.sync('**/routes/**/*.ts', {
    cwd: repoPath,
    absolute: true,
  });

  for (const [path, methods] of Object.entries(openapiSpec.paths)) {
    for (const [method, spec] of Object.entries(methods)) {
      const hasSecurity = spec.security && spec.security.length > 0;
      const isPublic = path === '/healthz' || path === '/health';

      if (!hasSecurity && !isPublic) {
        // Check if route file has auth middleware
        const routeHandler = routeFiles.find(file => 
          file.toLowerCase().includes(path.replace(/\//g, '-').toLowerCase())
        );

        if (routeHandler) {
          try {
            const content = fs.readFileSync(routeHandler, 'utf8');
            if (!/auth|authenticate|jwt|api[_-]?key/i.test(content)) {
              issues.push({
                type: 'security',
                severity: 'high',
                file: routeHandler,
                line_number: 1,
                message: `Route ${method.toUpperCase()} ${path} has no auth middleware defined in OpenAPI and no auth detected in handler`,
                code_context: `${method.toUpperCase()} ${path}`,
              });
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    }
  }

  return issues;
}

function checkRouteCompleteness(repoPath, openapiSpec) {
  const issues = [];

  if (!openapiSpec || !openapiSpec.paths) return issues;

  const routeFiles = glob.sync('**/routes/**/*.ts', {
    cwd: repoPath,
    absolute: true,
  });

  // Extract route paths from implementation
  const implementedRoutes = new Set();
  for (const file of routeFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const routeMatches = content.match(/router\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g);
      if (routeMatches) {
        for (const match of routeMatches) {
          const pathMatch = match.match(/['"]([^'"]+)['"]/);
          if (pathMatch) {
            implementedRoutes.add(pathMatch[1]);
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }

  // Check for undocumented routes
  for (const route of implementedRoutes) {
    let found = false;
    for (const [specPath] of Object.entries(openapiSpec.paths)) {
      if (specPath === route || specPath === route + '/') {
        found = true;
        break;
      }
    }

    if (!found && route !== '/healthz' && route !== '/health') {
      issues.push({
        type: 'route-completeness',
        severity: 'medium',
        file: 'routes/',
        line_number: 1,
        message: `Route ${route} is implemented but not documented in OpenAPI spec`,
        code_context: route,
      });
    }
  }

  return issues;
}

function checkVersionCompatibility(repoPath, openapiSpec) {
  const issues = [];

  if (!openapiSpec) return issues;

  // Check for deprecated endpoints
  if (openapiSpec.paths) {
    for (const [path, methods] of Object.entries(openapiSpec.paths)) {
      for (const [method, spec] of Object.entries(methods)) {
        if (spec.deprecated) {
          issues.push({
            type: 'version-compatibility',
            severity: 'low',
            file: openapiSpec.info?.title || 'openapi.yaml',
            line_number: 1,
            message: `Endpoint ${method.toUpperCase()} ${path} is marked as deprecated - consider removal timeline`,
            code_context: `${method.toUpperCase()} ${path} (deprecated)`,
          });
        }
      }
    }
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
  const openapiPath = config.openapiPaths[repoPath];
  
  console.log(`Scanning ${repoPath}...`);

  const openapiSpec = loadOpenAPISpec(repoPath, openapiPath || 'openapi.yaml');

  if (config.checks.schemaValidation) {
    issues.push(...checkSchemaValidation(repoPath, openapiSpec));
  }

  if (config.checks.security) {
    issues.push(...checkSecurity(repoPath, openapiSpec));
  }

  if (config.checks.routeCompleteness) {
    issues.push(...checkRouteCompleteness(repoPath, openapiSpec));
  }

  if (config.checks.versionCompatibility) {
    issues.push(...checkVersionCompatibility(repoPath, openapiSpec));
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

  let report = `# API Contract Report\n\n`;
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
        agent_name: 'api-contract',
        report_type: 'scan',
        title: `API Contract Scan - ${new Date().toISOString()}`,
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
    `api-contract-${new Date().toISOString().split('T')[0]}.md`
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
