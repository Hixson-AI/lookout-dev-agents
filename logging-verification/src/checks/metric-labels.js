export function checkMetricLabels(content, filePath, relativePath, repoName) {
  const findings = [];

  // Check if promClient or @lookout/telemetry is used
  if (!content.includes('promClient') && !content.includes('@lookout/telemetry')) {
    return findings;
  }

  // Check for setDefaultLabels with tenant_id
  const setDefaultLabelsPattern = /setDefaultLabels\s*\(\s*\{([^}]+)\}\s*\)/s;
  const setDefaultLabelsMatch = content.match(setDefaultLabelsPattern);

  if (setDefaultLabelsMatch) {
    const labels = setDefaultLabelsMatch[1];
    if (!labels.includes('tenant_id')) {
      const lineNumber = findLineNumber(content, 'setDefaultLabels');
      findings.push({
        severity: 'high',
        file_path: relativePath,
        line_number: lineNumber,
        message: 'setDefaultLabels does not include tenant_id label',
        finding_type: 'metric-labels',
        code_context: setDefaultLabelsMatch[0],
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
