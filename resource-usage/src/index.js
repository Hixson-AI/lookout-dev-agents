import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { RAGStore } from './rag-store.js';
import { generateEmbedding, generateFindingContext } from './embeddings.js';
import {
  stripCommentsAndStrings,
  findBlockEnd,
  indexToLine,
  enclosingBlock,
  looksLikeOneShotScript,
} from './preprocess.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../config.json');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (error) {
    console.error('Failed to load config:', error.message);
    process.exit(1);
  }
}

/**
 * Read a source file and return both raw and stripped views plus a line array.
 * The stripped view has comments/strings blanked while preserving offsets, so
 * we can run regex matchers without comment/string false positives.
 */
function readSource(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const stripped = stripCommentsAndStrings(raw);
  const rawLines = raw.split('\n');
  const strippedLines = stripped.split('\n');
  return { raw, stripped, rawLines, strippedLines };
}

function makeIssue({ type, severity, file, lineNumber, message, codeContext, confidence }) {
  return {
    type,
    severity,
    file,
    line_number: lineNumber,
    message,
    code_context: (codeContext || '').trim().slice(0, 160),
    confidence_score: confidence ?? 0.8,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Connection-leak detector
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Real connection acquisitions we care about. Bare `connect(` is too broad —
 * it catches `prisma.$connect()`, `eventEmitter.connect()`, comments, etc.
 * We require an actual constructor or known driver entry point.
 */
const CONNECTION_ACQUIRE_PATTERNS = [
  /\bnew\s+(?:pg\.)?Pool\s*\(/,
  /\bnew\s+(?:pg\.)?Client\s*\(/,
  /\bnew\s+PrismaClient\s*\(/,
  /\bnew\s+MongoClient\s*\(/,
  /\bmongoose\.connect\s*\(/,
  /\bmysql\.createConnection\s*\(/,
  /\bmysql2?\.createPool\s*\(/,
  /\bredis\.createClient\s*\(/,
  /\bnew\s+Redis\s*\(/,
];

const CONNECTION_RELEASE_RE =
  /\.(end|close|disconnect|\$disconnect|destroy|quit)\s*\(|closePool|closePrisma|closeRedis/;

function checkConnectionLeaks(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];
  const releasesAnywhere = CONNECTION_RELEASE_RE.test(stripped);

  for (const pat of CONNECTION_ACQUIRE_PATTERNS) {
    const re = new RegExp(pat.source, 'g');
    let m;
    while ((m = re.exec(stripped)) !== null) {
      if (releasesAnywhere) continue; // file already disposes a connection
      const line = indexToLine(stripped, m.index);
      issues.push(
        makeIssue({
          type: 'connection-leak',
          severity: 'high',
          file: filePath,
          lineNumber: line,
          message:
            'Connection acquired (' + m[0].trim() + ') with no matching close/end/disconnect/destroy in this file',
          codeContext: rawLines[line - 1] || '',
          confidence: 0.85,
        }),
      );
    }
  }

  // File handle: createReadStream / createWriteStream / fs.open without close
  const handleRe = /\bfs\.(open|createReadStream|createWriteStream)\s*\(/g;
  let hm;
  while ((hm = handleRe.exec(stripped)) !== null) {
    // Same-statement cleanup (`pipe(`, `.on('close')`, `.close()`) is enough
    // to suppress; but if no `.close()` or `.destroy()` anywhere, flag.
    if (/\.(close|destroy)\s*\(/.test(stripped)) continue;
    if (/\.pipe\s*\(/.test(stripped)) continue;
    const line = indexToLine(stripped, hm.index);
    issues.push(
      makeIssue({
        type: 'connection-leak',
        severity: 'high',
        file: filePath,
        lineNumber: line,
        message: 'File handle opened (' + hm[0].trim() + ') without close/destroy/pipe',
        codeContext: rawLines[line - 1] || '',
        confidence: 0.7,
      }),
    );
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory-leak detector — listeners
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Targets that are lifecycle-scoped: registering a single listener for the
 * lifetime of the process, request, response, or child process is correct.
 */
const LIFECYCLE_TARGETS = new Set([
  'process',
  'server',
  'app',
  'child',
  'req',
  'request',
  'res',
  'response',
  'socket',
  'ws',
  'window',
  'document',
]);

const LIFECYCLE_PROPERTY_TARGETS = [
  /\bchild\.(stdout|stderr|stdin)\s*\?\.\s*on\s*\(/,
  /\bchild\.(stdout|stderr|stdin)\s*\.\s*on\s*\(/,
];

function checkListenerLeaks(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];

  // We require a string literal as first argument so `step.onError` doesn't
  // match. The original source has the literal blanked, so look for the
  // shape `.on (` followed (in raw) by a quoted argument.
  const re = /([\w$]+)\s*\.\s*(addEventListener|on)\s*\(/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const target = m[1];
    const line = indexToLine(stripped, m.index);
    const rawLine = rawLines[line - 1] || '';
    // Confirm the original line has a string-literal first arg to `.on(`/
    // `.addEventListener(`. Otherwise it's likely property access like
    // `step.onError` that the regex matched in stripped form.
    const argRe = new RegExp(
      '\\.\\s*(addEventListener|on)\\s*\\(\\s*[\'"`]',
    );
    if (!argRe.test(rawLine)) continue;

    if (LIFECYCLE_TARGETS.has(target)) continue;
    if (LIFECYCLE_PROPERTY_TARGETS.some((p) => p.test(rawLine))) continue;

    // If the same file has a matching `.removeListener(`/`.off(`/`.removeEventListener(`,
    // assume cleanup handled.
    const removalRe = new RegExp(
      '\\b' + target + '\\b[\\s\\S]{0,2000}?\\.(removeEventListener|removeListener|off)\\s*\\(',
    );
    if (removalRe.test(stripped)) continue;

    // Lazy-singleton pattern: the listener is registered inside an
    // `ensureXxx()` / module-init function. Skip if the enclosing block is at
    // module top-level (no surrounding function), which indicates one-time
    // wiring.
    const enclosing = enclosingBlock(stripped, m.index);
    if (!enclosing) continue; // top-level → one-shot, skip

    issues.push(
      makeIssue({
        type: 'memory-leak',
        severity: 'medium',
        file: filePath,
        lineNumber: line,
        message:
          target +
          '.on(...) registered without a matching .off/.removeListener — verify it is not a hot-path emitter',
        codeContext: rawLine,
        confidence: 0.55,
      }),
    );
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory-leak detector — timers
// ─────────────────────────────────────────────────────────────────────────────

function checkTimerLeaks(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];
  const re = /\b(setTimeout|setInterval)\s*\(/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const kind = m[1];
    const line = indexToLine(stripped, m.index);
    const rawLine = rawLines[line - 1] || '';

    // Promise-resolver pattern: setTimeout(resolve, ...) — nothing to clear.
    if (/\bset(Timeout|Interval)\s*\(\s*(resolve|r|done|cb|callback)\b/.test(rawLine)) continue;

    // Find an assignment target on this line (e.g. `const t = setTimeout(...)`,
    // `this.h = setInterval(...)`). If unassigned, the handle is unreachable
    // for clearing — but for setTimeout that's typically fine (one-shot).
    const assign = rawLine.match(/(?:const|let|var)\s+([\w$]+)\s*=|([\w$.]+)\s*=\s*set(?:Timeout|Interval)/);
    if (!assign && kind === 'setTimeout') continue; // unassigned setTimeout is fine

    // Unassigned setInterval is a real leak: handle is unreachable.
    if (!assign && kind === 'setInterval') {
      issues.push(
        makeIssue({
          type: 'memory-leak',
          severity: 'medium',
          file: filePath,
          lineNumber: line,
          message: 'setInterval handle is not stored — interval can never be cleared',
          codeContext: rawLine,
          confidence: 0.85,
        }),
      );
      continue;
    }

    const handleName = (assign[1] || assign[2] || '').replace(/.*\./, '');
    if (!handleName) continue;

    // Look for `clear<Timeout|Interval>(handleName)` anywhere in the file.
    const clearRe = new RegExp('clear(Timeout|Interval)\\s*\\(\\s*' + handleName + '\\b');
    if (clearRe.test(stripped)) continue;

    issues.push(
      makeIssue({
        type: 'memory-leak',
        severity: 'medium',
        file: filePath,
        lineNumber: line,
        message:
          kind + ' handle "' + handleName + '" has no matching clear' +
          (kind === 'setInterval' ? 'Interval' : 'Timeout'),
        codeContext: rawLine,
        confidence: 0.75,
      }),
    );
  }
  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup-issue detector — try without finally, only when there's a resource
// ─────────────────────────────────────────────────────────────────────────────

const RESOURCE_ACQUIRE_RE =
  /\b(new\s+(?:Pool|Client|PrismaClient|MongoClient|Redis)|fs\.(open|createReadStream|createWriteStream)|spawn|exec|child_process)\s*\(/;

function checkTryWithoutFinally(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];
  const tryRe = /\btry\s*\{/g;
  let m;
  while ((m = tryRe.exec(stripped)) !== null) {
    const openIdx = m.index + m[0].lastIndexOf('{');
    const endIdx = findBlockEnd(stripped, openIdx);
    if (endIdx === -1) continue;
    const body = stripped.slice(openIdx + 1, endIdx);

    // Check what follows the `}` — `catch (...)` and/or `finally {`.
    const tail = stripped.slice(endIdx + 1, endIdx + 200);
    const hasFinally = /^\s*(?:catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*)?finally\s*\{/.test(tail);
    if (hasFinally) continue;

    // Only flag when the try body actually acquires a resource.
    if (!RESOURCE_ACQUIRE_RE.test(body)) continue;

    const line = indexToLine(stripped, m.index);
    issues.push(
      makeIssue({
        type: 'cleanup-issue',
        severity: 'medium',
        file: filePath,
        lineNumber: line,
        message: 'try block acquires a resource but has no finally — may leak on error',
        codeContext: rawLines[line - 1] || '',
        confidence: 0.7,
      }),
    );
  }
  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup-issue detector — async without error handling (LOW, conservative)
// ─────────────────────────────────────────────────────────────────────────────

function checkAsyncErrorHandling(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];
  const re = /\basync\s+function\s+([\w$]+)\s*\([^)]*\)\s*\{/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const name = m[1];
    const openIdx = m.index + m[0].lastIndexOf('{');
    const endIdx = findBlockEnd(stripped, openIdx);
    if (endIdx === -1) continue;
    const body = stripped.slice(openIdx + 1, endIdx);

    // Express middleware / route handler: `(req, res, next)` and uses `next(`.
    const sig = m[0];
    if (/\b(req|request)\b[\s,][\s\S]*\b(res|response)\b/.test(sig) && /\bnext\s*\(/.test(body)) continue;

    if (/\btry\s*\{|\.catch\s*\(/.test(body)) continue;
    if (!/\bawait\b/.test(body)) continue; // no awaited calls → nothing to mishandle

    const line = indexToLine(stripped, m.index);
    issues.push(
      makeIssue({
        type: 'cleanup-issue',
        severity: 'low',
        file: filePath,
        lineNumber: line,
        message: 'async function "' + name + '" awaits without try/catch or .catch() — verify caller handles rejection',
        codeContext: rawLines[line - 1] || '',
        confidence: 0.4,
      }),
    );
  }
  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Performance — nested loops (only when truly nested by braces)
// ─────────────────────────────────────────────────────────────────────────────

function checkNestedLoops(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];
  const re = /\bfor\s*\(/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    // Find body `{` after the for(...).
    const after = stripped.slice(m.index);
    const braceRel = after.indexOf('{');
    const semiRel = after.indexOf(';');
    if (braceRel === -1) continue;
    if (semiRel !== -1 && semiRel < braceRel) continue; // single-statement for, skip
    const openIdx = m.index + braceRel;
    const endIdx = findBlockEnd(stripped, openIdx);
    if (endIdx === -1) continue;

    const body = stripped.slice(openIdx + 1, endIdx);
    // Look for an inner `for (` or `while (` directly inside this body.
    const inner = /\b(for|while)\s*\(/.exec(body);
    if (!inner) continue;

    const line = indexToLine(stripped, m.index);
    issues.push(
      makeIssue({
        type: 'performance',
        severity: 'medium',
        file: filePath,
        lineNumber: line,
        message: 'Nested ' + inner[1] + ' loop inside outer for — verify input bounds',
        codeContext: rawLines[line - 1] || '',
        confidence: 0.6,
      }),
    );
  }
  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Performance — sync fs in async context
// ─────────────────────────────────────────────────────────────────────────────

function checkSyncFs(filePath, src) {
  const { stripped, rawLines } = src;
  const issues = [];
  const re = /\bfs\.(readFileSync|writeFileSync|existsSync|statSync|readdirSync)\s*\(/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const enclosing = enclosingBlock(stripped, m.index);
    if (!enclosing) continue; // top-level boot is fine
    // Look at the enclosing function decl for `async`.
    const head = stripped.slice(Math.max(0, enclosing.start - 200), enclosing.start);
    if (!/\basync\b/.test(head)) continue;
    const line = indexToLine(stripped, m.index);
    issues.push(
      makeIssue({
        type: 'performance',
        severity: 'medium',
        file: filePath,
        lineNumber: line,
        message: 'Synchronous fs call inside async function — blocks the event loop',
        codeContext: rawLines[line - 1] || '',
        confidence: 0.8,
      }),
    );
  }
  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Driver
// ─────────────────────────────────────────────────────────────────────────────

function scanFile(filePath, config) {
  let src;
  try {
    src = readSource(filePath);
  } catch {
    return [];
  }

  const issues = [];
  if (config.checks.connectionLeaks) {
    if (!looksLikeOneShotScript(filePath, src.raw)) {
      issues.push(...checkConnectionLeaks(filePath, src));
    }
  }
  if (config.checks.memoryLeaks) {
    issues.push(...checkListenerLeaks(filePath, src));
    issues.push(...checkTimerLeaks(filePath, src));
  }
  if (config.checks.cleanupIssues) {
    issues.push(...checkTryWithoutFinally(filePath, src));
    issues.push(...checkAsyncErrorHandling(filePath, src));
  }
  if (config.checks.performance) {
    issues.push(...checkNestedLoops(filePath, src));
    issues.push(...checkSyncFs(filePath, src));
  }
  return issues;
}

async function applyLearning(issues, ragStore, config) {
  if (!config.rag.enabled || !config.rag.useLearnedPatterns) return issues;
  const out = [];
  for (const issue of issues) {
    try {
      const ctx = generateFindingContext(issue);
      const embedding = await generateEmbedding(ctx);
      const similar = await ragStore.findSimilarFindings(embedding, 5, config.rag.similarityThreshold);
      const fpRate = similar.length > 0
        ? similar.filter((f) => f.is_false_positive).length / similar.length
        : 0;
      if (fpRate > 0.7) {
        issue.confidence_score = Math.max(0.2, (issue.confidence_score ?? 0.7) - 0.4);
        issue.metadata = { ...(issue.metadata || {}), learning: 'reduced confidence (RAG)', similar: similar.length };
      }
      out.push(issue);
    } catch (err) {
      console.error('learning failed for ' + issue.file + ':', err.message);
      out.push(issue);
    }
  }
  return out;
}

async function storeFindingsInRAG(findings, ragStore, config) {
  if (!config.rag.enabled) return;
  for (const f of findings) {
    try {
      const ctx = generateFindingContext(f);
      const embedding = await generateEmbedding(ctx);
      f.embedding = embedding;
      await ragStore.storeFinding(f);
    } catch (err) {
      console.error('rag store failed:', err.message);
    }
  }
}

function dedupeFindings(findings) {
  const seen = new Map();
  for (const f of findings) {
    // Prefer src/ over dist/ if same logical path
    const key = f.file.replace(/\/dist\//, '/src/') + ':' + f.line_number + ':' + f.message;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, f);
      continue;
    }
    if (existing.file.includes('/dist/') && !f.file.includes('/dist/')) {
      seen.set(key, f);
    }
  }
  return [...seen.values()];
}

function scanRepository(repoPath, config) {
  const repoName = path.basename(repoPath);
  console.log('Scanning ' + repoPath + '...');
  const files = glob.sync('**/*.{js,ts,mjs,cjs}', {
    cwd: repoPath,
    ignore: config.excludePatterns,
    absolute: true,
  });
  const issues = [];
  for (const f of files) issues.push(...scanFile(f, config));
  return issues.map((i) => ({ ...i, repository: repoName }));
}

function generateReport(issues, repoLabel) {
  const high = issues.filter((i) => i.severity === 'high').length;
  const medium = issues.filter((i) => i.severity === 'medium').length;
  const low = issues.filter((i) => i.severity === 'low').length;

  let r = '# Resource Usage Report\n\n';
  r += '**Repository:** ' + repoLabel + '\n';
  r += '**Total Issues:** ' + issues.length + '\n';
  r += '- **High:** ' + high + '\n';
  r += '- **Medium:** ' + medium + '\n';
  r += '- **Low:** ' + low + '\n\n';

  const grouped = issues.reduce((acc, i) => {
    (acc[i.type] ||= []).push(i);
    return acc;
  }, {});
  for (const [type, list] of Object.entries(grouped)) {
    r += '## ' + type.toUpperCase() + '\n\n';
    for (const i of list) {
      r += '### ' + i.severity.toUpperCase() + ' (conf=' + (i.confidence_score ?? 0.7).toFixed(2) + '): ' + i.message + '\n\n';
      r += '**File:** `' + i.file + '`\n';
      if (i.line_number) r += '**Line:** ' + i.line_number + '\n';
      if (i.code_context) r += '**Context:** `' + i.code_context + '`\n';
      r += '\n';
    }
  }
  return r;
}

async function postToApi(report, findings, config) {
  if (!config.reporting.postToApi) return;
  try {
    const response = await fetch(config.reporting.apiUrl + '/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_name: 'resource-usage',
        report_type: 'scan',
        title: 'Resource Usage Scan - ' + new Date().toISOString(),
        summary: {
          total_findings: findings.length,
          high_severity: findings.filter((f) => f.severity === 'high').length,
          medium_severity: findings.filter((f) => f.severity === 'medium').length,
          low_severity: findings.filter((f) => f.severity === 'low').length,
        },
        findings: findings.map((f) => ({
          severity: f.severity,
          file_path: f.file,
          line_number: f.line_number,
          message: f.message,
          finding_type: f.type,
          code_context: f.code_context,
          repository: f.repository,
          confidence: f.confidence_score,
        })),
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Report stored in API (id=' + data.id + ')');
    } else {
      console.error('Failed to store report:', response.statusText);
    }
  } catch (err) {
    console.error('post-to-api failed:', err.message);
  }
}

async function main() {
  const config = loadConfig();
  const ragStore = new RAGStore();
  try {
    await ragStore.connect();
  } catch (err) {
    console.error('RAG offline, continuing without learning:', err.message);
  }

  const all = [];
  const startTime = Date.now();
  for (const repoPath of config.repositories) {
    const abs = path.isAbsolute(repoPath) ? repoPath : path.resolve(__dirname, '..', repoPath);
    all.push(...scanRepository(abs, config));
  }
  const scanDuration = Date.now() - startTime;

  const severityOrder = { high: 0, medium: 1, low: 2 };
  const minSeverity = severityOrder[config.severityThreshold] ?? 2;
  const minConfidence = config.minConfidence ?? 0;
  let filtered = all.filter(
    (i) => severityOrder[i.severity] <= minSeverity && (i.confidence_score ?? 0.7) >= minConfidence,
  );
  filtered = dedupeFindings(filtered);
  filtered = await applyLearning(filtered, ragStore, config);

  const repoLabel = config.repositories.join(', ');
  const report = generateReport(filtered, repoLabel);
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, 'resource-usage-' + new Date().toISOString().split('T')[0] + '.md');
  fs.writeFileSync(reportPath, report);
  console.log('Report saved to ' + reportPath);
  console.log('Total issues: ' + filtered.length + ' (raw: ' + all.length + ')');

  await storeFindingsInRAG(filtered, ragStore, config);
  await postToApi(report, filtered, config);

  try {
    await ragStore.recordScanHistory({
      repository: repoLabel,
      total_findings: filtered.length,
      high_severity: filtered.filter((f) => f.severity === 'high').length,
      medium_severity: filtered.filter((f) => f.severity === 'medium').length,
      low_severity: filtered.filter((f) => f.severity === 'low').length,
      scan_duration_ms: scanDuration,
      learning_enabled: config.rag.enabled,
    });
  } catch (err) {
    console.error('record scan history failed:', err.message);
  }

  await ragStore.disconnect();
}

// Allow programmatic use (test fixtures) without auto-running.
export {
  scanFile,
  scanRepository,
  checkConnectionLeaks,
  checkListenerLeaks,
  checkTimerLeaks,
  checkTryWithoutFinally,
  checkAsyncErrorHandling,
  checkNestedLoops,
  checkSyncFs,
  readSource,
};

const isEntrypoint = (() => {
  try {
    return path.resolve(process.argv[1] || '') === __filename;
  } catch {
    return false;
  }
})();
if (isEntrypoint) main().catch(console.error);
