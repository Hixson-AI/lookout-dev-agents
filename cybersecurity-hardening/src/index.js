import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

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

    // Check for outdated or vulnerable dependencies
    if (pkg.dependencies) {
      Object.entries(pkg.dependencies).forEach(([name, version]) => {
        // Flag packages using caret ranges that may introduce breaking changes
        if (version.startsWith('^')) {
          issues.push({
            type: 'dependency',
            severity: 'low',
            file: 'package.json',
            message: `Dependency ${name}@${version} uses caret semver range - consider pinning exact versions for production`
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
          issues.push({
            type: 'secret',
            severity: 'high',
            file: path.relative(repoPath, filePath),
            message: `Potential ${name} detected in source file`
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
      const relativePath = path.relative(repoPath, filePath);

      // Check for eval usage
      if (/\beval\s*\(/.test(content)) {
        issues.push({
          type: 'code',
          severity: 'high',
          file: relativePath,
          message: 'Use of eval() detected - security risk'
        });
      }

      // Check for innerHTML assignment
      if (/\.innerHTML\s*=/.test(content)) {
        issues.push({
          type: 'code',
          severity: 'medium',
          file: relativePath,
          message: 'Direct innerHTML assignment - potential XSS vulnerability'
        });
      }

      // Check for hardcoded credentials in URLs
      if (/https?:\/\/[^:]+:[^@]+@/.test(content)) {
        issues.push({
          type: 'code',
          severity: 'high',
          file: relativePath,
          message: 'Hardcoded credentials in URL detected'
        });
      }

      // Check for console.log in production code
      if (/\bconsole\.(log|debug|info)\(/.test(content) && !filePath.includes('test')) {
        issues.push({
          type: 'code',
          severity: 'low',
          file: relativePath,
          message: 'Console logging in production code - should be removed or use proper logger'
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

    // Check for running as root
    if (!/USER\s+\w+/.test(dockerfile)) {
      issues.push({
        type: 'infrastructure',
        severity: 'medium',
        file: 'Dockerfile',
        message: 'Dockerfile does not specify USER directive - containers may run as root'
      });
    }

    // Check for latest tag
    if (/FROM\s+\w+:\s*latest/i.test(dockerfile)) {
      issues.push({
        type: 'infrastructure',
        severity: 'medium',
        file: 'Dockerfile',
        message: 'Dockerfile uses :latest tag - use specific version tags for reproducibility'
      });
    }
  }

  return issues;
}

async function scanRepository(repoPath, config) {
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

  return issues;
}

function filterBySeverity(issues, threshold) {
  const severityOrder = { low: 1, medium: 2, high: 3 };
  const minSeverity = severityOrder[threshold] || 2;

  return issues.filter(issue => severityOrder[issue.severity] >= minSeverity);
}

async function main() {
  const config = loadConfig();
  const allIssues = [];

  for (const repo of config.repositories) {
    const repoPath = path.resolve(__dirname, '../../', repo);
    if (fs.existsSync(repoPath)) {
      const issues = await scanRepository(repoPath, config);
      allIssues.push({ repo, issues });
    } else {
      console.log(`Skipping ${repo} - not found`);
    }
  }

  // Filter by severity
  const filteredIssues = allIssues.map(({ repo, issues }) => ({
    repo,
    issues: filterBySeverity(issues, config.severityThreshold)
  }));

  // Generate report
  const reportDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const reportPath = path.join(reportDir, `security-scan-${timestamp}.md`);

  let report = '# Security Scan Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Severity Threshold: ${config.severityThreshold}\n\n`;

  let totalIssues = 0;
  filteredIssues.forEach(({ repo, issues }) => {
    if (issues.length > 0) {
      report += `## ${repo}\n\n`;
      issues.forEach(issue => {
        report += `- **[${issue.severity.toUpperCase()}]** ${issue.file}: ${issue.message}\n`;
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

  fs.writeFileSync(reportPath, report);
  console.log(`\nReport saved to ${reportPath}`);
  console.log(`Total issues found: ${totalIssues}`);
}

main().catch(console.error);
