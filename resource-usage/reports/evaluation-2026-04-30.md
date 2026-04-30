# Resource-Usage Scan Evaluation — 2026-04-30

Triage of the 2026-04-30 scan output across `lookout-api`, `lookout-control`, `lookout-workers`, `lookout-orchestrator`. Result: **zero true positives**. Every HIGH and every structural MEDIUM finding is a false positive caused by the agent's detector design (single-line regex, no scope/AST, comment + string matches, `dist/` duplicates, no counter-pattern awareness). Platform code is correct; the agent needs the overhaul described in the companion plan.

## Findings by detector class

### `connection-leak` (HIGH) — all false positives

The detector is `/(connect|createConnection)\s*\(/` with a negative lookahead for `.close()`/`.end()` only. It matches:

- `await prisma.$connect()` / `await prisma.$disconnect()` in singletons (`src/lib/prisma.ts`) — Prisma's documented pattern; `closePrisma()` is wired into SIGTERM in `server.ts`.
- Comments containing the word "connect" (e.g. `executions.ts:172`: `// event: snapshot on connect (full current step list)`).
- Scripts that explicitly clean up: `seed-actions.ts`, `seed-platform-tenant.ts`, `sync-n8n-catalog.ts`, `backfill-tenant-profiles.ts`, `repoint-native-to-n8n.ts` — every one of these uses `.finally(() => prisma.$disconnect())` or `await prisma.$disconnect()`.
- `dist/` duplicates of all of the above.

**Verdict:** 0 leaks.

### `memory-leak` — addEventListener (MEDIUM) — all false positives

The detector is `/\.(addEventListener|on)/`. It catches:

- Property access that isn't a listener: `step.onError`, `window.onload`, `req.onerror`.
- Comments and `.d.ts` documentation lines.
- Process/server lifecycle handlers registered once for the lifetime of the process: `process.on('SIGTERM'|'SIGINT')`, `server.on('error')`.
- Lazy-singleton subscribers: `sharedQueueEvents.on('completed')` in `executions.ts`, registered exactly once via `ensureQueueEvents()`.
- Per-request cleanup that **does** clean up: SSE handlers register `req.on('close', done)`, `req.on('end', done)`, `res.on('close', done)`, where `done()` clears the heartbeat interval and removes the listener from the in-memory `listeners` map.
- Child-process listeners scoped to a `spawn()` call inside `runChildBlocking` — they die with the child.

**Verdict:** 0 leaks.

### `memory-leak` — Timer (MEDIUM) — all false positives

The detector flags every `setTimeout`/`setInterval`. Real cleanup patterns it misses:

- `setTimeout(resolve, ms)` in `delay.ts`, `wait.ts`, `n8n-enricher.ts` — Promise-resolver pattern; nothing to clear.
- `setTimeout(..., 30_000)` in `server.ts` — one-shot graceful-shutdown force-exit.
- `setTimeout(() => controller.abort(), timeout)` in `http-request.ts` — `clearTimeout(timer)` in `finally`.
- `setInterval` heartbeat in `worker.ts` — cleared in success path **and** in `finally`.
- `setInterval` heartbeat in SSE `executions.ts` — cleared by `done()` on `req/res close`.
- `setInterval` heartbeat in `orchestrator/run.ts` — scoped to a single execution.

**Verdict:** 0 leaks.

### `cleanup-issue` — try without finally (MEDIUM) — all false positives

The detector counts `try {` and `finally {` tokens globally and flags an arbitrary `try` when counts differ. This ignores:

- Express error handling (`try { ... } catch (err) { next(err); }`) — the correct pattern, no resource to release.
- Prisma queries — connection pool is process-wide; per-call cleanup is wrong.
- Nested try/catch where the outer block has no resource to clean up.

**Verdict:** 0 actionable items.

### `cleanup-issue` — async without error handling (LOW) — all false positives

A 1000-character lookahead from `async function` for `try`/`catch` misses:

- Express error middleware signatures `(err, req, res, next)` handled by the framework.
- Callers that wrap the call with `await` inside a `try`/`catch` or `.catch(...)`.
- Short helpers that intentionally propagate rejections.

**Verdict:** 0 actionable items.

### `performance` — nested loops / array-in-loop (MEDIUM/LOW) — all false positives

A 20-line lookahead window flags any `for` followed by another `for` or `.map`/`.filter`/`.forEach` regardless of brace nesting or input size. Flagged sites are graph builders, ID maps, and bounded transformations — none are O(n²) hot paths.

### `performance` — sync fs (MEDIUM) — 1 hit, dev-only

`lookout-control/serve-test-ui.js:14` reads `.env` synchronously at boot. Intentional bootstrap of a dev-only test UI before `listen`. Not worth changing.

### `performance` — large JSON parse (LOW)

`n8n-enricher.ts` parses bounded LLM response strings. Streaming would add complexity for no real win.

## Outcome

**No platform code changes proposed.** Lookout's resource lifecycle is sound: Prisma singleton + graceful shutdown, per-request SSE cleanup with `done()` on close/end, worker heartbeat cleared in `finally`, abort-controller timers cleared in `finally`, and scripts that explicitly disconnect Prisma.

Follow-up work targets the scanner itself — see plan: `~/.windsurf/plans/resource-usage-scan-evaluation-f2e9be.md`. Goal is to drop the next scan's false-positive rate from ~100% to <10% by adding strip-comments-and-strings preprocessing, brace-balanced block analysis, counter-pattern detection, lifecycle-listener allowlists, and `src/`-vs-`dist/` deduplication.
