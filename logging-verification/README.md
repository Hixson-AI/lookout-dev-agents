# Logging Verification Agent

Self-learning logging verification agent for the Lookout platform. Verifies that all services are logging with proper tenant context and required fields.

## Purpose

This agent ensures that tenant isolation is correctly implemented in observability data by checking:
- TENANT_ID environment variable usage
- @lookout/telemetry package integration
- Log context completeness
- Metric label compliance

## Quick Start

```bash
# Start Postgres with pgvector for RAG
docker-compose up -d

# Install dependencies
npm install

# Initialize knowledge base
npm run init-rag

# Run scan
npm run scan
```

## Checks

### Tenant Context Verification
- TENANT_ID environment variable is set
- Platform services set TENANT_ID='platform'
- Multi-tenant services set TENANT_ID from request/job context

### @lookout/telemetry Usage
- Package is imported and initialized
- tenantId parameter is passed to initTelemetry()
- tenantId parameter is passed to getMetricsRegistry()

### Log Context Completeness
- Logs include tenant context
- Logs include service, environment, and deployment profile context

### Metric Label Compliance
- Metrics include tenant_id label
- Metrics include service and environment labels

## Scanned Repositories

- lookout-api
- lookout-control
- lookout-workers
- lookout-orchestrator
- lookout-n8n-runner

## Self-Learning

The agent uses RAG (Retrieval-Augmented Generation) with Postgres + pgvector to:
- Store findings with embeddings for semantic search
- Learn from patterns to improve detection accuracy
- Reduce false positives based on user feedback

## Reports

Reports are generated in `reports/` directory and automatically submitted to the shared reports API at `http://localhost:3456/api/reports`.

## Configuration

Edit `config.json` to customize:
- Target repositories
- Severity thresholds
- Check toggles
- RAG settings
