# Resource Usage Report

**Repository:** ../../lookout-api, ../../lookout-control, ../../lookout-workers, ../../lookout-orchestrator
**Total Issues:** 442
- **High:** 15
- **Medium:** 247
- **Low:** 180

## MEMORY-LEAK

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/server.ts`
**Line:** 69
**Context:** server.on('error', (error: NodeJS.ErrnoException) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/server.ts`
**Line:** 95
**Context:** setTimeout(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/server.ts`
**Line:** 101
**Context:** process.on('SIGTERM', () => shutdown('SIGTERM'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/server.ts`
**Line:** 102
**Context:** process.on('SIGINT', () => shutdown('SIGINT'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 36
**Context:** sharedQueueEvents.on('completed', async ({ jobId, returnvalue }) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 237
**Context:** const heartbeat = setInterval(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 250
**Context:** req.on('close', done);

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 251
**Context:** req.on('end', done);

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 252
**Context:** res.on('close', done);

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/execute.ts`
**Line:** 181
**Context:** setTimeout(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/migrate.ts`
**Line:** 16
**Context:** child.on('exit', (code) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/migrate.ts`
**Line:** 25
**Context:** child.on('error', reject);

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/server.js`
**Line:** 58
**Context:** server.on('error', (error) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/server.js`
**Line:** 81
**Context:** setTimeout(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/server.js`
**Line:** 86
**Context:** process.on('SIGTERM', () => shutdown('SIGTERM'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/server.js`
**Line:** 87
**Context:** process.on('SIGINT', () => shutdown('SIGINT'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 25
**Context:** sharedQueueEvents.on('completed', async ({ jobId, returnvalue }) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 200
**Context:** const heartbeat = setInterval(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 213
**Context:** req.on('close', done);

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 214
**Context:** req.on('end', done);

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 215
**Context:** res.on('close', done);

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/execute.js`
**Line:** 149
**Context:** setTimeout(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/serve-test-ui.js`
**Line:** 230
**Context:** window.onload = function () {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/server.ts`
**Line:** 69
**Context:** server.on('error', (error: NodeJS.ErrnoException) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/server.ts`
**Line:** 114
**Context:** setTimeout(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/server.ts`
**Line:** 120
**Context:** process.on('SIGTERM', () => shutdown('SIGTERM'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/server.ts`
**Line:** 121
**Context:** process.on('SIGINT', () => shutdown('SIGINT'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/internal-catalog.ts`
**Line:** 145
**Context:** child.stdout?.on('data', (chunk: Buffer) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/internal-catalog.ts`
**Line:** 151
**Context:** child.stderr?.on('data', (chunk: Buffer) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/internal-catalog.ts`
**Line:** 156
**Context:** child.on('error', (err: Error) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/internal-catalog.ts`
**Line:** 160
**Context:** child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/n8n-enricher.ts`
**Line:** 161
**Context:** await new Promise(r => setTimeout(r, 800 * Math.pow(2, attempt)));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/migrate.ts`
**Line:** 16
**Context:** child.on('exit', (code) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/migrate.ts`
**Line:** 25
**Context:** child.on('error', reject);

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/server.js`
**Line:** 56
**Context:** server.on('error', (error) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/server.js`
**Line:** 94
**Context:** setTimeout(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/server.js`
**Line:** 99
**Context:** process.on('SIGTERM', () => shutdown('SIGTERM'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/server.js`
**Line:** 100
**Context:** process.on('SIGINT', () => shutdown('SIGINT'));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/internal-catalog.js`
**Line:** 129
**Context:** child.stdout?.on('data', (chunk) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/internal-catalog.js`
**Line:** 135
**Context:** child.stderr?.on('data', (chunk) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/internal-catalog.js`
**Line:** 140
**Context:** child.on('error', (err) => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/internal-catalog.js`
**Line:** 147
**Context:** child.on('close', (code, signal) => {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/worker.ts`
**Line:** 107
**Context:** const heartbeatHandle = setInterval(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/execution/action-runner.ts`
**Line:** 69
**Context:** if (step.onError?.type === 'continue') {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/actions/http-request.ts`
**Line:** 25
**Context:** const timer = setTimeout(() => controller.abort(), timeout);

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/actions/delay.ts`
**Line:** 34
**Context:** return new Promise(resolve => setTimeout(resolve, ms));

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/worker.js`
**Line:** 70
**Context:** const heartbeatHandle = setInterval(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/execution/action-runner.js`
**Line:** 46
**Context:** if (step.onError?.type === 'continue') {

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/actions/http-request.js`
**Line:** 16
**Context:** const timer = setTimeout(() => controller.abort(), timeout);

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/actions/delay.js`
**Line:** 23
**Context:** return new Promise(resolve => setTimeout(resolve, ms));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/run.ts`
**Line:** 26
**Context:** *      d. If result.status === 'failed' and step.onError.type !== 'continue'

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/run.ts`
**Line:** 74
**Context:** const heartbeat = setInterval(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/run.ts`
**Line:** 176
**Context:** const onError = step.onError?.type ?? 'stop';

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/queue/wait.ts`
**Line:** 47
**Context:** return new Promise(resolve => setTimeout(resolve, ms));

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/actions/delay.ts`
**Line:** 34
**Context:** return new Promise(resolve => setTimeout(resolve, ms));

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.js`
**Line:** 26
**Context:** *      d. If result.status === 'failed' and step.onError.type !== 'continue'

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.js`
**Line:** 50
**Context:** const heartbeat = setInterval(() => {

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.js`
**Line:** 136
**Context:** const onError = step.onError?.type ?? 'stop';

### MEDIUM: addEventListener without corresponding removeEventListener - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.d.ts`
**Line:** 26
**Context:** *      d. If result.status === 'failed' and step.onError.type !== 'continue'

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/queue/wait.js`
**Line:** 30
**Context:** return new Promise(resolve => setTimeout(resolve, ms));

### MEDIUM: Timer created without corresponding clear - potential memory leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/actions/delay.js`
**Line:** 23
**Context:** return new Promise(resolve => setTimeout(resolve, ms));

## CLEANUP-ISSUE

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/server.ts`
**Line:** 725
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/webhooks.ts`
**Line:** 1157
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/tenants.ts`
**Line:** 1773
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/internal.ts`
**Line:** 5103
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/internal.ts`
**Line:** 96
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/internal.ts`
**Line:** 990
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/health.ts`
**Line:** 983
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/items.ts`
**Line:** 875
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 2053
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/execute.ts`
**Line:** 2244
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/ai.ts`
**Line:** 2385
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/middleware/tenant.ts`
**Line:** 2859
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/middleware/tenant.ts`
**Line:** 50
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/middleware/phi-routing.ts`
**Line:** 69
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/middleware/llm-usage.ts`
**Line:** 472
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/middleware/auth.ts`
**Line:** 755
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/middleware/api-key.ts`
**Line:** 636
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/step-hmac.ts`
**Line:** 87
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/prisma.ts`
**Line:** 6
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/prisma.ts`
**Line:** 32
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/dlp.ts`
**Line:** 489
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/dlp.ts`
**Line:** 92
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/control-plane.ts`
**Line:** 318
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/triggers/webhook.ts`
**Line:** 541
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/triggers/cron.ts`
**Line:** 894
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/triggers/cron.ts`
**Line:** 126
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/triggers/api-trigger.ts`
**Line:** 649
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/webhooks.ts`
**Line:** 1417
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/watchdog.ts`
**Line:** 3074
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/watchdog.ts`
**Line:** 150
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/phi-log-middleware.ts`
**Line:** 12
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/phi-log-middleware.ts`
**Line:** 22
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/machine-runner.ts`
**Line:** 3813
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/machine-runner.ts`
**Line:** 150
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/loki-transport.ts`
**Line:** 304
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/loki-transport.ts`
**Line:** 70
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/dispatch.ts`
**Line:** 6602
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/dispatch.ts`
**Line:** 49
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/ai/router.ts`
**Line:** 4762
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/ai/router.ts`
**Line:** 43
**Context:** async route(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/ai/router.ts`
**Line:** 86
**Context:** async routeToOpenRouter(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/ai/router.ts`
**Line:** 116
**Context:** async routeToAnthropic(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/ai/openrouter.ts`
**Line:** 850
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/ai/anthropic.ts`
**Line:** 841
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/db/index.ts`
**Line:** 265
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/db/index.ts`
**Line:** 27
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/db/index.ts`
**Line:** 41
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/dns.ts`
**Line:** 5108
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/dns.ts`
**Line:** 88
**Context:** async manageRecords(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/dns.ts`
**Line:** 127
**Context:** async syncRecord(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/dns.ts`
**Line:** 216
**Context:** async syncFlyIpsRecord(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/scripts/dns.ts`
**Line:** 296
**Context:** async syncAcmeChallengeRecord(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/server.js`
**Line:** 730
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/webhooks.js`
**Line:** 1087
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/tenants.js`
**Line:** 1412
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/internal.js`
**Line:** 4505
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/internal.js`
**Line:** 78
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/internal.js`
**Line:** 848
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/health.js`
**Line:** 926
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/items.js`
**Line:** 561
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 1488
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/execute.js`
**Line:** 2111
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/ai.js`
**Line:** 2028
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/middleware/tenant.js`
**Line:** 2505
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/middleware/tenant.js`
**Line:** 36
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/middleware/phi-routing.js`
**Line:** 53
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/middleware/llm-usage.js`
**Line:** 163
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/middleware/auth.js`
**Line:** 261
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/middleware/api-key.js`
**Line:** 491
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/step-hmac.js`
**Line:** 53
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/prisma.js`
**Line:** 4
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/prisma.js`
**Line:** 24
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/dlp.js`
**Line:** 459
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/control-plane.js`
**Line:** 1406
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/triggers/webhook.js`
**Line:** 513
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/triggers/cron.js`
**Line:** 727
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/triggers/cron.js`
**Line:** 104
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/triggers/api-trigger.js`
**Line:** 614
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/webhooks.js`
**Line:** 911
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/watchdog.js`
**Line:** 2973
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/phi-log-middleware.js`
**Line:** 9
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/phi-log-middleware.js`
**Line:** 18
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/machine-runner.js`
**Line:** 2270
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/loki-transport.js`
**Line:** 769
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/loki-transport.js`
**Line:** 47
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/loki-transport.d.ts`
**Line:** 116
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/dispatch.js`
**Line:** 5634
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/dispatch.js`
**Line:** 17
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/ai/router.js`
**Line:** 4208
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/ai/router.js`
**Line:** 17
**Context:** async route(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/ai/router.js`
**Line:** 55
**Context:** async routeToOpenRouter(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/ai/router.js`
**Line:** 78
**Context:** async routeToAnthropic(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/ai/openrouter.js`
**Line:** 341
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/ai/anthropic.js`
**Line:** 323
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/db/index.js`
**Line:** 191
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/db/index.js`
**Line:** 21
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/serve-test-ui.js`
**Line:** 347
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/server.ts`
**Line:** 939
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/server.ts`
**Line:** 55
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/tenants.ts`
**Line:** 1012
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/tenant-secrets.ts`
**Line:** 1104
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/service-secrets.ts`
**Line:** 1142
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/platform.ts`
**Line:** 1102
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/platform-jobs.ts`
**Line:** 1391
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/n8n.ts`
**Line:** 728
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/internal-catalog.ts`
**Line:** 2068
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/health.ts`
**Line:** 1298
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/catalog.ts`
**Line:** 888
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/catalog.ts`
**Line:** 97
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/auth.ts`
**Line:** 809
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/apps-workflow.ts`
**Line:** 926
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/apps-secrets.ts`
**Line:** 3017
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/apps-secrets.ts`
**Line:** 30
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/apps-crud.ts`
**Line:** 1218
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/api-keys.ts`
**Line:** 1274
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/agents.ts`
**Line:** 3252
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/agents.ts`
**Line:** 48
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/agent-actions.ts`
**Line:** 905
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/middleware/rbac.ts`
**Line:** 2475
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/middleware/auth.ts`
**Line:** 1493
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/middleware/audit.ts`
**Line:** 679
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/prisma.ts`
**Line:** 6
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/prisma.ts`
**Line:** 32
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/openrouter.ts`
**Line:** 49
**Context:** async createKey(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/openrouter.ts`
**Line:** 68
**Context:** async listKeys(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/openrouter.ts`
**Line:** 88
**Context:** async deleteKey(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/app-keys.ts`
**Line:** 1156
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/app-keys.ts`
**Line:** 65
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/api-sync.ts`
**Line:** 1044
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/rag/vector-store.ts`
**Line:** 684
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/rag/vector-store.ts`
**Line:** 105
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/rag/action-catalog.ts`
**Line:** 5188
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/rag/action-catalog.ts`
**Line:** 100
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/workflow-converter.ts`
**Line:** 3340
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/workflow-converter.ts`
**Line:** 74
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/workflow-converter.ts`
**Line:** 118
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 3941
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 136
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 156
**Context:** async getDecrypted(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 174
**Context:** async authenticate(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 184
**Context:** async preAuthentication(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 188
**Context:** async getCredentials(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 192
**Context:** async updateCredentials(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 196
**Context:** async updateCredentialsOauthTokenData(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/exec-shim.ts`
**Line:** 265
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/workflow-optimizer.ts`
**Line:** 1347
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/workflow-builder.ts`
**Line:** 1404
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/validation-agent.ts`
**Line:** 1745
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/test-generator.ts`
**Line:** 1347
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/step-recommendation.ts`
**Line:** 2022
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/secret-schema-agent.ts`
**Line:** 1162
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/rag-on-demand.ts`
**Line:** 2728
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/integration-research.ts`
**Line:** 2123
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/dry-run-agent.ts`
**Line:** 1210
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/debug-agent.ts`
**Line:** 1872
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/debug-agent.ts`
**Line:** 32
**Context:** async execute(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/cost-estimator.ts`
**Line:** 1432
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/code-generation.ts`
**Line:** 2291
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/builder-chat-agent.ts`
**Line:** 12379
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/builder-chat-agent.ts`
**Line:** 247
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/builder-chat-agent.ts`
**Line:** 466
**Context:** async chat(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/base-agent.ts`
**Line:** 1022
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/base-agent.ts`
**Line:** 53
**Context:** async callOpenRouter(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/agents/base-agent.ts`
**Line:** 85
**Context:** async callAnthropic(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/db/migrations.ts`
**Line:** 1087
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/db/index.ts`
**Line:** 385
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/cli/index.ts`
**Line:** 433
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 4483
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 45
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 56
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 287
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 300
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 365
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-platform-tenant.ts`
**Line:** 5801
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-platform-tenant.ts`
**Line:** 200
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-actions.ts`
**Line:** 34
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-actions.ts`
**Line:** 66
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-actions.ts`
**Line:** 84
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-actions.ts`
**Line:** 107
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-actions.ts`
**Line:** 134
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/n8n-enricher.ts`
**Line:** 5881
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/dns.ts`
**Line:** 4671
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/dns.ts`
**Line:** 84
**Context:** async manageRecords(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/dns.ts`
**Line:** 117
**Context:** async syncRecord(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/dns.ts`
**Line:** 224
**Context:** async syncFlyIpsRecord(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/dns.ts`
**Line:** 278
**Context:** async syncAaaaRecord(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/actions/_types.ts`
**Line:** 25
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/server.js`
**Line:** 947
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/server.js`
**Line:** 45
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/tenants.js`
**Line:** 927
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/service-secrets.js`
**Line:** 1005
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/platform.js`
**Line:** 954
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/platform-jobs.js`
**Line:** 1219
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/n8n.js`
**Line:** 642
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/internal-catalog.js`
**Line:** 1933
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/health.js`
**Line:** 1266
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/catalog.js`
**Line:** 802
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/catalog.js`
**Line:** 80
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/auth.js`
**Line:** 717
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/apps-workflow.js`
**Line:** 838
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/apps-secrets.js`
**Line:** 3235
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/apps-secrets.js`
**Line:** 21
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/apps-crud.js`
**Line:** 1130
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/api-keys.js`
**Line:** 1145
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/agents.js`
**Line:** 3111
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/agents.js`
**Line:** 43
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/agent-actions.js`
**Line:** 820
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/middleware/rbac.js`
**Line:** 2298
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/middleware/auth.js`
**Line:** 925
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/middleware/audit.js`
**Line:** 356
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/prisma.js`
**Line:** 4
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/prisma.js`
**Line:** 24
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/openrouter.js`
**Line:** 7
**Context:** async createKey(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/openrouter.js`
**Line:** 23
**Context:** async listKeys(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/openrouter.js`
**Line:** 37
**Context:** async deleteKey(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/app-keys.js`
**Line:** 1128
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/app-keys.js`
**Line:** 54
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/api-sync.js`
**Line:** 821
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/rag/vector-store.js`
**Line:** 448
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/rag/vector-store.js`
**Line:** 82
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/rag/action-catalog.js`
**Line:** 4801
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/rag/action-catalog.js`
**Line:** 79
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/workflow-converter.js`
**Line:** 2582
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/workflow-converter.js`
**Line:** 38
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/workflow-converter.js`
**Line:** 75
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.test.js`
**Line:** 2700
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 2262
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 92
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 112
**Context:** async getDecrypted(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 126
**Context:** async authenticate(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 131
**Context:** async preAuthentication(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 134
**Context:** async getCredentials(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 137
**Context:** async updateCredentials(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 140
**Context:** async updateCredentialsOauthTokenData(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.js`
**Line:** 203
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/workflow-optimizer.js`
**Line:** 1276
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/workflow-builder.js`
**Line:** 1333
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/validation-agent.js`
**Line:** 1699
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/test-generator.js`
**Line:** 1276
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/step-recommendation.js`
**Line:** 1974
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/secret-schema-agent.js`
**Line:** 1091
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/rag-on-demand.js`
**Line:** 2657
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/integration-research.js`
**Line:** 2052
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/dry-run-agent.js`
**Line:** 1139
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/debug-agent.js`
**Line:** 1834
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/debug-agent.js`
**Line:** 28
**Context:** async execute(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/cost-estimator.js`
**Line:** 1361
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/code-generation.js`
**Line:** 2220
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/builder-chat-agent.js`
**Line:** 12642
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/builder-chat-agent.js`
**Line:** 199
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/builder-chat-agent.js`
**Line:** 384
**Context:** async chat(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/base-agent.js`
**Line:** 637
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/base-agent.js`
**Line:** 34
**Context:** async callOpenRouter(

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/agents/base-agent.js`
**Line:** 62
**Context:** async callAnthropic(

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/db/migrations.js`
**Line:** 937
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/db/index.js`
**Line:** 313
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/cli/index.js`
**Line:** 442
**Context:** Missing finally block

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/worker.ts`
**Line:** 3921
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/worker.ts`
**Line:** 61
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/worker.ts`
**Line:** 179
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 1829
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 36
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 40
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 91
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 101
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 111
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 121
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 160
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 167
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 174
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/api-client.ts`
**Line:** 181
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/execution/action-runner.ts`
**Line:** 1033
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/execution/handlers/n8n-catalog-sync.ts`
**Line:** 37
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/execution/handlers/catalog-reindex.ts`
**Line:** 22
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/actions/delay.ts`
**Line:** 8
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/actions/data-transform.ts`
**Line:** 8
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/actions/condition.ts`
**Line:** 618
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/src/lib/actions/ai-processing.ts`
**Line:** 10
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/worker.js`
**Line:** 3686
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/worker.js`
**Line:** 29
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/worker.js`
**Line:** 140
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 1328
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 8
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 11
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 53
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 59
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 65
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 71
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 74
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/api-client.js`
**Line:** 77
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/execution/action-runner.js`
**Line:** 710
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/execution/handlers/n8n-catalog-sync.js`
**Line:** 22
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/execution/handlers/catalog-reindex.js`
**Line:** 10
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/actions/delay.js`
**Line:** 5
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/actions/data-transform.js`
**Line:** 5
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/actions/condition.js`
**Line:** 445
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-workers/dist/lib/actions/ai-processing.js`
**Line:** 7
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/server.ts`
**Line:** 3370
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/server.ts`
**Line:** 28
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/server.ts`
**Line:** 36
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/run.ts`
**Line:** 10328
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/run.ts`
**Line:** 235
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/step-hmac.ts`
**Line:** 87
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/api-client.ts`
**Line:** 3664
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/api-client.ts`
**Line:** 134
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/api-client.ts`
**Line:** 146
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/api-client.ts`
**Line:** 163
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/api-client.ts`
**Line:** 185
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/queue/wait.ts`
**Line:** 26
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/templating.ts`
**Line:** 2575
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/templating.ts`
**Line:** 75
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/inprocess.ts`
**Line:** 935
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/actions/delay.ts`
**Line:** 8
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/actions/data-transform.ts`
**Line:** 23
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/actions/data-transform.ts`
**Line:** 54
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/actions/condition.ts`
**Line:** 19
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/server.js`
**Line:** 3313
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/server.js`
**Line:** 17
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/server.js`
**Line:** 24
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.js`
**Line:** 9903
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.js`
**Line:** 172
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/step-hmac.js`
**Line:** 53
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/api-client.js`
**Line:** 2084
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/api-client.js`
**Line:** 71
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/api-client.js`
**Line:** 74
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/api-client.js`
**Line:** 77
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/api-client.js`
**Line:** 86
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/queue/wait.js`
**Line:** 15
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/templating.js`
**Line:** 2461
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/templating.js`
**Line:** 67
**Context:** async function

### MEDIUM: try block without finally - resources may not be cleaned up on error

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/inprocess.js`
**Line:** 689
**Context:** Missing finally block

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/actions/delay.js`
**Line:** 5
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/actions/data-transform.js`
**Line:** 20
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/actions/data-transform.js`
**Line:** 43
**Context:** async function

### LOW: Async function without error handling - errors may be unhandled

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/actions/condition.js`
**Line:** 16
**Context:** async function

## CONNECTION-LEAK

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/routes/api/v1/executions.ts`
**Line:** 172
**Context:** //   - event: snapshot   on connect (full current step list)

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/prisma.ts`
**Line:** 25
**Context:** await prisma.$connect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/prisma.ts`
**Line:** 34
**Context:** await prisma.$disconnect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/routes/api/v1/executions.js`
**Line:** 142
**Context:** //   - event: snapshot   on connect (full current step list)

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/prisma.js`
**Line:** 19
**Context:** await prisma.$connect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/prisma.js`
**Line:** 26
**Context:** await prisma.$disconnect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/prisma.ts`
**Line:** 25
**Context:** await prisma.$connect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/prisma.ts`
**Line:** 34
**Context:** await prisma.$disconnect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 462
**Context:** .finally(() => prisma.$disconnect());

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-platform-tenant.ts`
**Line:** 191
**Context:** await prisma.$disconnect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/seed-actions.ts`
**Line:** 175
**Context:** .finally(() => prisma.$disconnect());

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/repoint-native-to-n8n.ts`
**Line:** 139
**Context:** await prisma.$disconnect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/backfill-tenant-profiles.ts`
**Line:** 46
**Context:** await prisma.$disconnect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/prisma.js`
**Line:** 19
**Context:** await prisma.$connect();

### HIGH: Database connection without corresponding close/dispose - potential connection leak

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/prisma.js`
**Line:** 26
**Context:** await prisma.$disconnect();

## PERFORMANCE

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/src/lib/execution/trigger-context.ts`
**Line:** 279
**Context:** for (const [k, v] of Object.entries(input as Record<string, unknown>)) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-api/dist/lib/execution/trigger-context.js`
**Line:** 186
**Context:** for (const [k, v] of Object.entries(input)) {

### MEDIUM: Synchronous file operation in async context - blocks event loop

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/serve-test-ui.js`
**Line:** 14
**Context:** const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/routes/apps-secrets.ts`
**Line:** 381
**Context:** for (const s of agentResult.secrets) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/workflow-converter.ts`
**Line:** 173
**Context:** for (const [sourceName, connections] of Object.entries(n8nWorkflow.connections)) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/src/lib/n8n/workflow-converter.ts`
**Line:** 252
**Context:** for (const step of workflow.steps) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/sync-n8n-catalog.ts`
**Line:** 448
**Context:** for (let i = 0; i < nodes.length; i += CONCURRENCY) {

### LOW: Large JSON parse - consider streaming for better performance

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/n8n-enricher.ts`
**Line:** 275
**Context:** enriched = JSON.parse(json) as LLMEnrichmentResult;

### LOW: Large JSON parse - consider streaming for better performance

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/scripts/n8n-enricher.ts`
**Line:** 280
**Context:** const retry = JSON.parse(json2) as LLMEnrichmentResult;

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/routes/apps-secrets.js`
**Line:** 312
**Context:** for (const s of agentResult.secrets) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/workflow-converter.js`
**Line:** 112
**Context:** for (const [sourceName, connections] of Object.entries(n8nWorkflow.connections)) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/workflow-converter.js`
**Line:** 179
**Context:** for (const step of workflow.steps) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-control/dist/lib/n8n/exec-shim.test.js`
**Line:** 33
**Context:** for (const [credType, fieldMap] of Object.entries(fx.credentialsFromEnv)) {

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/run.ts`
**Line:** 155
**Context:** layerLoop: for (const layer of resolved.layers) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 30
**Context:** for (const s of rawSteps) byId.set(s.id, s);

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 41
**Context:** for (const s of rawSteps) inDegree.set(s.id, 0);

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 42
**Context:** for (const s of rawSteps) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 88
**Context:** for (const s of rawSteps) byId.set(s.id, s);

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 98
**Context:** for (const s of rawSteps) inDegree.set(s.id, 0);

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 99
**Context:** for (const s of rawSteps) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 100
**Context:** for (const succ of s.next ?? []) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/src/lib/execution/graph.ts`
**Line:** 113
**Context:** for (const s of ready) seen.add(s.id);

### LOW: Array operation inside loop - may cause O(n²) complexity

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/run.js`
**Line:** 120
**Context:** layerLoop: for (const layer of resolved.layers) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 17
**Context:** for (const s of rawSteps)

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 27
**Context:** for (const s of rawSteps)

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 29
**Context:** for (const s of rawSteps) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 70
**Context:** for (const s of rawSteps)

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 79
**Context:** for (const s of rawSteps)

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 81
**Context:** for (const s of rawSteps) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 82
**Context:** for (const succ of s.next ?? []) {

### MEDIUM: Nested loops detected - consider optimization or alternative algorithm

**File:** `/home/garrett/repos/work/hixson-ai/lookout-orchestrator/dist/lib/execution/graph.js`
**Line:** 93
**Context:** for (const s of ready)

