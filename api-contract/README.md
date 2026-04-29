# API Contract Agent

Validates API implementations against OpenAPI specifications, ensuring schema compliance, authentication, and version compatibility.

## Features

- **Schema Validation**: Request/response body compliance
- **Security Checks**: Auth middleware, API keys, JWT verification
- **Version Compatibility**: Breaking change detection, backwards compatibility
- **Route Completeness**: All OpenAPI routes implemented and documented

## Quick Start

```bash
# Install dependencies
npm install

# Initialize RAG database
npm run init-rag

# Scan API contracts
npm run scan
```

## Configuration

Edit `config.json` to configure:
- Repositories to scan
- OpenAPI spec paths
- Enabled checks
- Severity thresholds
- RAG settings

## API Contract Checks

### Schema Validation
- Request body schema compliance
- Response body schema compliance
- Required field validation
- Type constraint enforcement

### Security
- Auth middleware on protected routes
- API key validation on tenant routes
- JWT verification on internal routes
- Role-based access control

### Versioning
- Breaking change detection
- Deprecated endpoint marking
- Version header validation

### Completeness
- OpenAPI route implementation
- Implementation documentation
- HTTP method matching

## Output

Reports saved to `reports/` directory and posted to the shared reports API at `http://localhost:3456`.

## Requirements

- Node.js 18+
- PostgreSQL with pgvector extension
- OpenAI API key (if using RAG)
