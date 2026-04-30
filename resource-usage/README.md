# Resource Usage Agent

Scans repositories for resource leaks, connection-pool issues, memory leaks, and missing cleanup.

The detectors are deliberately conservative: prior versions produced ~240 findings on the Lookout platform with a near-100% false-positive rate. Detectors now strip comments and strings before matching, walk balanced braces to scope checks, recognize counter-patterns (e.g. `closePool`, `clearInterval(handle)`, `.finally(() => prisma.$disconnect())`), and dedupe `src/`/`dist/` mirrors.

## Quick start

```bash
npm install
npm test          # 13 fixture-based self-tests
npm run scan      # scan repositories listed in config.json
```

`npm run init-rag` is only required if `config.rag.enabled` is true.

## Configuration

Edit `config.json`:

| key | purpose |
| --- | --- |
| `repositories` | repos to scan (relative or absolute paths) |
| `severityThreshold` | drop findings below this level (`high`/`medium`/`low`) |
| `minConfidence` | drop findings whose `confidence_score` is below this (default 0.6) |
| `excludePatterns` | glob excludes; default skips `dist/`, `build/`, tests, scripts, migrations, fixtures, `*.d.ts` |
| `checks.*` | toggle each detector class |
| `reporting.postToApi` | POST findings to `apiUrl/api/reports` |
| `rag.*` | optional pgvector-backed learning (off by default) |

## Detectors

### `connection-leak` (HIGH)

Fires only on real driver entry points: `new Pool/Client/PrismaClient/MongoClient/Redis(...)`, `mongoose.connect(...)`, `mysql.createConnection(...)`, `redis.createClient(...)`. Suppressed when the same file contains any of: `.end(`, `.close(`, `.disconnect(`, `.$disconnect(`, `.destroy(`, `.quit(`, `closePool`, `closePrisma`, `closeRedis`. One-shot scripts (`/scripts/`, `/cli/`, files calling `process.exit`, files using `.finally(() => x.$disconnect())`) are skipped entirely.

Also flags `fs.open` / `fs.createReadStream` / `fs.createWriteStream` without `.close`, `.destroy`, or `.pipe`.

### `memory-leak` — listeners (MEDIUM)

Fires on `target.on('event', ...)` / `target.addEventListener('event', ...)` only when the first argument is a string literal. Suppressed for lifecycle-scoped targets (`process`, `server`, `app`, `child`, `req`, `res`, `socket`, `ws`, `window`, `document`) and `child.stdout/stderr/stdin.on(...)`. Suppressed when the same target has a matching `.removeListener` / `.off` / `.removeEventListener` within ~2000 chars. Top-level (module-init) registrations are treated as one-time wiring and skipped.

### `memory-leak` — timers (MEDIUM)

`setTimeout(resolve, ...)` / `setTimeout(r|done|cb|callback, ...)` is treated as a Promise-resolver and ignored. Unassigned `setInterval` is always flagged (handle is unreachable for clearing). Otherwise the file must contain a matching `clearTimeout(<handle>)` / `clearInterval(<handle>)`.

### `cleanup-issue` — try/finally (MEDIUM)

Walks balanced braces. Flags a `try { ... }` only when (a) it has neither `catch` nor `finally`, **and** (b) the body acquires a resource (`new Pool/Client/...`, `fs.open/createReadStream/createWriteStream`, `spawn`, `exec`, `child_process`).

### `cleanup-issue` — async error handling (LOW, conf 0.4)

Flags `async function` whose body awaits without a `try` or `.catch()`. Suppressed for Express handlers (`(req, res, next)` signature with `next(` in body) and for bodies with no `await`. Confidence stays below default `minConfidence`, so it only surfaces when the threshold is lowered.

### `performance` — nested loops (MEDIUM, conf 0.6)

Flags only when the inner `for`/`while` is lexically nested inside the outer for-loop's `{...}` body. Sibling loops (e.g. two `for ... of rawSteps` in a row) are no longer flagged.

### `performance` — sync fs in async (MEDIUM)

`fs.readFileSync` / `writeFileSync` / `existsSync` / `statSync` / `readdirSync` inside an `async` function. Top-level boot reads (e.g. `dotenv`-style config loaders) are not flagged.

## Self-tests

`test-fixtures/` contains positive and negative examples covering every detector. The harness reads the first-line `// EXPECT: <type> <severity>` (or `// EXPECT: no findings`) annotation and asserts. Run via `npm test`.

When changing a detector, add at least one positive and one negative fixture. CI (when wired) should run `npm test` on every PR to this directory.

## Output

Reports are written to `reports/resource-usage-<date>.md`, including the per-finding `confidence` score. With `reporting.postToApi=true`, the same payload is POSTed to the shared reports API.

## Requirements

- Node.js 18+
- (optional) PostgreSQL with pgvector for `rag.enabled=true`
