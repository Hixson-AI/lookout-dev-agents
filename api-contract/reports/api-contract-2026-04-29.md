# API Contract Report

**Repository:** ../../lookout-api, ../../lookout-control
**Total Issues:** 55
- **High:** 0
- **Medium:** 55
- **Low:** 0

## SCHEMA-VALIDATION

### MEDIUM: Route POST /auth/google defined in OpenAPI but handler not found in routes/

**File:** `Lookout Control Plane API`
**Line:** 1
**Context:** POST /auth/google

## ROUTE-COMPLETENESS

### MEDIUM: Route / is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /

### MEDIUM: Route /:tenantId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId

### MEDIUM: Route /:tenantId/config is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/config

### MEDIUM: Route /:tenantId/operators is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/operators

### MEDIUM: Route /:tenantId/operators/:operatorId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/operators/:operatorId

### MEDIUM: Route /:tenantId/ai-keys is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/ai-keys

### MEDIUM: Route /:id/ai-keys is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:id/ai-keys

### MEDIUM: Route /:tenantId/ai-keys/:provider/decrypt is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/ai-keys/:provider/decrypt

### MEDIUM: Route /:tenantId/ai-keys/:provider is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/ai-keys/:provider

### MEDIUM: Route /:tenantId/usage is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/usage

### MEDIUM: Route /:tenantId/secrets is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/secrets

### MEDIUM: Route /:tenantId/secrets/:secretKey is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/secrets/:secretKey

### MEDIUM: Route /apps/:appId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /apps/:appId

### MEDIUM: Route /apps/:appId/secrets is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /apps/:appId/secrets

### MEDIUM: Route /actions/by-step-id/:stepId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /actions/by-step-id/:stepId

### MEDIUM: Route /settings is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /settings

### MEDIUM: Route /settings/:key is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /settings/:key

### MEDIUM: Route /apps/:appId/executions is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /apps/:appId/executions

### MEDIUM: Route /apps/:appId/executions/:executionId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /apps/:appId/executions/:executionId

### MEDIUM: Route /apps/:appId/executions/:executionId/steps is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /apps/:appId/executions/:executionId/steps

### MEDIUM: Route /import is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /import

### MEDIUM: Route /export is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /export

### MEDIUM: Route /sync-n8n is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /sync-n8n

### MEDIUM: Route /reindex is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /reindex

### MEDIUM: Route /search is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /search

### MEDIUM: Route /google/callback is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /google/callback

### MEDIUM: Route /google is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /google

### MEDIUM: Route /:tenantId/apps/validate-workflow is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/validate-workflow

### MEDIUM: Route /:tenantId/apps/:appId/secrets is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/:appId/secrets

### MEDIUM: Route /:tenantId/apps/:appId/secrets/:secretKey is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/:appId/secrets/:secretKey

### MEDIUM: Route /:tenantId/apps/generate-secret-schema is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/generate-secret-schema

### MEDIUM: Route /:tenantId/apps/:appId/required-secrets is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/:appId/required-secrets

### MEDIUM: Route /:tenantId/apps/:appId/required-secrets/augment is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/:appId/required-secrets/augment

### MEDIUM: Route /:tenantId/required-secrets is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/required-secrets

### MEDIUM: Route /:tenantId/apps is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps

### MEDIUM: Route /:tenantId/apps/:appId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/apps/:appId

### MEDIUM: Route /:tenantId/api-keys is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/api-keys

### MEDIUM: Route /:tenantId/api-keys/:keyId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/api-keys/:keyId

### MEDIUM: Route /validate-client-api-key is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /validate-client-api-key

### MEDIUM: Route /:tenantId/agents/build-workflow is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/build-workflow

### MEDIUM: Route /:tenantId/agents/secret-schema is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/secret-schema

### MEDIUM: Route /:tenantId/agents/recommend-steps is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/recommend-steps

### MEDIUM: Route /:tenantId/agents/validate is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/validate

### MEDIUM: Route /:tenantId/agents/dry-run is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/dry-run

### MEDIUM: Route /:tenantId/agents/debug is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/debug

### MEDIUM: Route /:tenantId/agents/optimize is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/optimize

### MEDIUM: Route /:tenantId/agents/estimate-cost is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/estimate-cost

### MEDIUM: Route /:tenantId/agents/generate-tests is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/generate-tests

### MEDIUM: Route /:tenantId/agents/research-integration is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/research-integration

### MEDIUM: Route /:tenantId/agents/generate-code is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/generate-code

### MEDIUM: Route /:tenantId/agents/analyze-rag is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/analyze-rag

### MEDIUM: Route /:tenantId/agents/chat is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:tenantId/agents/chat

### MEDIUM: Route /:actionId is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:actionId

### MEDIUM: Route /:actionId/tests is implemented but not documented in OpenAPI spec

**File:** `routes/`
**Line:** 1
**Context:** /:actionId/tests

