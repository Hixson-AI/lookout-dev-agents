export function checkTelemetryPackage(content, filePath, relativePath, repoName) {
  const findings = [];

  // Check if @lookout/telemetry is imported
  if (!content.includes('@lookout/telemetry')) {
    // Only flag if it's a service that should use telemetry
    if (filePath.includes('server.ts') || filePath.includes('index.ts')) {
      findings.push({
        severity: 'medium',
        file_path: relativePath,
        line_number: 1,
        message: '@lookout/telemetry package not imported',
        finding_type: 'telemetry-package',
        code_context: 'import statements',
        repository: repoName
      });
    }
    return findings;
  }

  // Check if initTelemetry is called with tenantId
  const initTelemetryPattern = /initTelemetry\s*\(\s*\{([^}]+)\}\s*\)/s;
  const initTelemetryMatch = content.match(initTelemetryPattern);

  if (initTelemetryMatch) {
    const args = initTelemetryMatch[1];
    if (!args.includes('tenantId') && !args.includes('TENANT_ID')) {
      const lineNumber = findLineNumber(content, 'initTelemetry');
      findings.push({
        severity: 'high',
        file_path: relativePath,
        line_number: lineNumber,
        message: 'initTelemetry called without tenantId parameter',
        finding_type: 'telemetry-package',
        code_context: initTelemetryMatch[0],
        repository: repoName
      });
    }
  }

  // Check if getMetricsRegistry is called with tenantId
  const metricsRegistryPattern = /getMetricsRegistry\s*\(\s*\{([^}]+)\}\s*\)/s;
  const metricsRegistryMatch = content.match(metricsRegistryPattern);

  if (metricsRegistryMatch) {
    const args = metricsRegistryMatch[1];
    if (!args.includes('tenantId') && !args.includes('TENANT_ID')) {
      const lineNumber = findLineNumber(content, 'getMetricsRegistry');
      findings.push({
        severity: 'high',
        file_path: relativePath,
        line_number: lineNumber,
        message: 'getMetricsRegistry called without tenantId parameter',
        finding_type: 'telemetry-package',
        code_context: metricsRegistryMatch[0],
        repository: repoName
      });
    }
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
