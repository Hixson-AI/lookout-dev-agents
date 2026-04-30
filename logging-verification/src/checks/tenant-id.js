export function checkTenantIdUsage(content, filePath, relativePath, repoName) {
  const findings = [];

  // Check if TENANT_ID is being set
  const setTenantIdPattern = /process\.env\['TENANT_ID'\]\s*=\s*['"]([^'"]+)['"]/g;
  const setTenantIdMatches = [...content.matchAll(setTenantIdPattern)];

  if (setTenantIdMatches.length === 0) {
    // Check if it's a server startup file or middleware
    if (filePath.includes('server.ts') || filePath.includes('middleware') || filePath.includes('worker.ts')) {
      findings.push({
        severity: 'high',
        file_path: relativePath,
        line_number: findLineNumber(content, 'process.env'),
        message: 'TENANT_ID environment variable not being set',
        finding_type: 'tenant-context',
        code_context: extractContext(content, 'process.env'),
        repository: repoName
      });
    }
  } else {
    setTenantIdMatches.forEach(match => {
      const tenantValue = match[1];
      const lineNumber = findLineNumber(content, match[0]);

      // Verify platform services use 'platform'
      if ((repoName === 'lookout-control' || repoName === 'lookout-n8n-runner') && tenantValue !== 'platform') {
        findings.push({
          severity: 'medium',
          file_path: relativePath,
          line_number: lineNumber,
          message: `Platform service should set TENANT_ID='platform', but found '${tenantValue}'`,
          finding_type: 'tenant-context',
          code_context: match[0],
          repository: repoName
        });
      }
    });
  }

  return findings;
}

function findLineNumber(content, pattern) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return i + 1;
    }
  }
  return 1;
}

function extractContext(content, pattern) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      const start = Math.max(0, i - 2);
      const end = Math.min(lines.length, i + 3);
      return lines.slice(start, end).join('\n');
    }
  }
  return '';
}
