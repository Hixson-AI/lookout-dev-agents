---
name: api-contract
version: 1.0.0
description: Verifies API routes match OpenAPI specs, validates input/output schemas, checks authentication/authorization
author: Hixson AI
topics: [api, openapi, validation, security, contracts]
---

# API Contract Agent

## Overview
The API Contract Agent validates that API implementations match their OpenAPI specifications, ensuring input/output schema compliance, proper authentication/authorization, and version compatibility across services.

## When to Use
- Before deploying API changes to production
- When reviewing API PRs
- During API version updates
- For continuous monitoring of API contract compliance

## How It Works

### Discovery
- Scans API route files in TypeScript/JavaScript services
- Reads OpenAPI specifications (YAML/JSON)
- Identifies route handlers and their implementations

### Analysis
Validates API implementations against specifications:

#### Schema Compliance
- Request body matches schema validation
- Response body matches schema definition
- Required fields are validated
- Type constraints are enforced
- Enum values are respected

#### Authentication/Authorization
- Protected routes have auth middleware
- API key validation on tenant routes
- JWT verification on internal routes
- Role-based access control where applicable

#### Version Compatibility
- Breaking changes are detected
- Deprecated endpoints are marked
- Version headers are validated
- Backwards compatibility maintained

#### Route Completeness
- All OpenAPI routes are implemented
- All implemented routes are documented
- HTTP methods match specifications
- Path parameters are correctly typed

### Reporting
- Generates markdown reports with contract violations
- Posts findings to shared reports API
- Provides line-level context for each issue
- Suggests remediation steps

## API Contract Checks

### Schema Validation
- Request body schema compliance
- Response body schema compliance
- Required field validation
- Type constraint enforcement
- Enum value validation

### Security
- Auth middleware on protected routes
- API key validation on tenant routes
- JWT verification on internal routes
- Role-based access control

### Versioning
- Breaking change detection
- Deprecated endpoint marking
- Version header validation
- Backwards compatibility

### Completeness
- OpenAPI route implementation
- Implementation documentation
- HTTP method matching
- Path parameter typing

## Self-Learning
Uses RAG with pgvector to:
- Store previous contract violations
- Learn from false positive feedback
- Recognize approved patterns
- Improve validation accuracy over time

## Usage

```bash
# Initialize RAG store
npm run init-rag

# Scan API contracts
npm run scan

# With RAG learning enabled
RAG_ENABLED=true npm run scan

# Scan specific service
SERVICE=lookout-api npm run scan
```

## Configuration

Edit `config.json`:
- `repositories`: API service repositories
- `openapiPaths`: Paths to OpenAPI specs
- `severityThreshold`: Minimum severity to report
- `excludePatterns`: Files/directories to skip
- `checks`: Enable/disable specific checks
- `rag.enabled`: Enable/disable RAG learning

Environment variables (`.env`):
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`: RAG database
- `POSTGRES_USER`, `POSTGRES_PASSWORD`: Database credentials
- `OPENAI_API_KEY`: For embeddings (if using RAG)

## Output

Markdown report with:
- Summary of violations by severity
- Detailed violations with file paths and line numbers
- Code context for each issue
- Remediation suggestions

Also posts to reports API at `http://localhost:3456`.

## Best Practices

- Run before API deployments
- Integrate into CI/CD for API PRs
- Review false positives to improve learning
- Keep OpenAPI specs up to date
- Document breaking changes properly

## Limitations

- Requires OpenAPI specification files
- Cannot execute API endpoints (static analysis only)
- Schema validation is pattern-based (may have false positives)
- Complex polymorphic schemas may need manual review
