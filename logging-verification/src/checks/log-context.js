export function checkLogContext(content, filePath, relativePath, repoName) {
  const findings = [];

  // Check if logger is used
  if (!content.includes('logger.') && !content.includes('log.')) {
    return findings;
  }

  // Check for tenant context in log calls
  const logCallPattern = /(logger|log)\.(info|error|warn|debug|trace)\s*\(\s*['"]([^'"]+)['"]\s*,\s*(\{[^}]*\})/g;
  const logCalls = [...content.matchAll(logCallPattern)];

  let hasTenantContext = false;
  logCalls.forEach(match => {
    const context = match[4];
    if (context.includes('tenantId') || context.includes('tenant_id')) {
      hasTenantContext = true;
    }
  });

  if (!hasTenantContext && logCalls.length > 0) {
    findings.push({
      severity: 'medium',
      file_path: relativePath,
      line_number: findLineNumber(content, logCalls[0][0]),
      message: 'Log calls do not include tenant context',
      finding_type: 'log-context',
      code_context: logCalls[0][0],
      repository: repoName
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
