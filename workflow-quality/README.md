# Workflow Quality Agent

Scans n8n workflows for quality, PHI handling, error handling, and Action Library compliance.

## Features

- **PHI Detection**: Identifies PHI data in Shared tier workflows
- **Error Handling**: Checks for missing error handlers and retry logic
- **Action Library Compliance**: Validates workflow nodes against Action Library
- **Quality Checks**: Detects hardcoded secrets, missing validation, inefficient patterns
- **Self-Learning**: Uses RAG to improve detection accuracy over time

## Quick Start

```bash
# Install dependencies
npm install

# Initialize RAG database
npm run init-rag

# Scan workflows
npm run scan
```

## Configuration

Edit `config.json` to configure:
- Repositories to scan
- Enabled checks
- Severity thresholds
- RAG settings

## Workflow Checks

### PHI Handling
- PHI data in Shared tier workflows
- Missing PHI scrubbing in log nodes
- Hardcoded PHI values

### Error Handling
- Missing error handlers on API calls
- No retry logic for external services
- Unhandled edge cases

### Action Library
- Unregistered custom nodes
- Missing metadata
- Orphaned entries

### Quality
- Hardcoded secrets
- Missing input validation
- No timeout configurations
- Inefficient data flows

## Output

Reports saved to `reports/` directory and posted to the shared reports API at `http://localhost:3456`.

## Requirements

- Node.js 18+
- PostgreSQL with pgvector extension
- OpenAI API key (if using RAG)
