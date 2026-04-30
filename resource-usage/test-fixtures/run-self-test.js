/**
 * Self-test harness for the resource-usage detectors.
 *
 * Each fixture file declares its expectation in the first comment line:
 *   // EXPECT: <type> <severity>            (single finding required)
 *   // EXPECT: no findings                  (must produce zero findings)
 *
 * Run with: node test-fixtures/run-self-test.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scanFile } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  checks: { connectionLeaks: true, memoryLeaks: true, cleanupIssues: true, performance: true },
};

const files = fs
  .readdirSync(__dirname)
  .filter((f) => f.startsWith('true-') && f.endsWith('.js'))
  .map((f) => path.join(__dirname, f));

let pass = 0;
let fail = 0;
const failures = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const firstLine = raw.split('\n')[0] || '';
  const m = firstLine.match(/EXPECT:\s*(.+)/i);
  if (!m) {
    console.log('SKIP (no EXPECT): ' + path.basename(file));
    continue;
  }
  const expectation = m[1].trim().toLowerCase();

  const findings = scanFile(file, config).filter(
    (f) => (f.confidence_score ?? 0.6) >= 0.6
  );

  let ok;
  let detail;
  if (expectation.startsWith('no findings')) {
    ok = findings.length === 0;
    detail = ok ? '' : 'expected 0, got ' + findings.length + ': ' +
      findings.map((f) => f.type + '/' + f.severity + ' "' + f.message + '"').join('; ');
  } else {
    const [wantType, wantSev] = expectation.split(/\s+/);
    ok = findings.some((f) => f.type === wantType && f.severity === wantSev);
    detail = ok ? '' : 'expected ' + wantType + '/' + wantSev + ', got: ' +
      (findings.length === 0
        ? 'nothing'
        : findings.map((f) => f.type + '/' + f.severity).join(', '));
  }

  if (ok) {
    pass += 1;
    console.log('PASS  ' + path.basename(file));
  } else {
    fail += 1;
    failures.push({ file: path.basename(file), detail });
    console.log('FAIL  ' + path.basename(file) + ' — ' + detail);
  }
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail > 0) {
  process.exit(1);
}
