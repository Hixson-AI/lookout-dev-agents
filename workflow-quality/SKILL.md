---
name: workflow-quality
version: 1.0.0
description: Scans n8n workflows for quality, PHI handling, error handling, and Action Library compliance
author: Hixson AI
topics: [n8n, workflows, quality, phi, action-library]
---

# Workflow Quality Agent

## Overview
The Workflow Quality Agent scans n8n workflow definitions to ensure they follow platform best practices, handle PHI correctly, have proper error handling, and comply with the Action Library system of record.

## When to Use
- Before deploying n8n workflows to production
- When reviewing workflow PRs
- During Action Library catalog sync operations
- For continuous monitoring of workflow quality

## How It Works

### Discovery
- Scans workflow files in `lookout-n8n` repository (when available)
- Parses n8n workflow JSON format
- Identifies workflow nodes, connections, and data flow

### Analysis
Checks workflows against these criteria:

#### PHI Handling
- PHI data passing through non-Dedicated workflows
- Missing PHI scrubbing in log nodes
- Hardcoded PHI in workflow parameters
- PHI in workflow descriptions or notes

#### Error Handling
- Missing error handlers on critical nodes
- Unhandled edge cases in branching logic
- Missing retry logic for external API calls
- No fallback paths for failed operations

#### Action Library Compliance
- Workflow nodes not registered in Action Library
- Missing or incomplete metadata for custom nodes
- Orphaned Action Library entries (no workflow usage)
- Inconsistent naming between workflows and Action Library

#### Quality Best Practices
- Hardcoded secrets or credentials
- Missing input validation
- No timeout configurations on HTTP nodes
- Inefficient data transformations
- Missing documentation in workflow notes

### Reporting
- Generates markdown reports with findings grouped by severity
- Posts findings to shared reports API for visualization
- Provides line-level context for each issue
- Suggests remediation steps

## Workflow Checks

### PHI Handling
- PHI data in Shared tier workflows
- Missing PHI scrubbing in log/debug nodes
- Hardcoded PHI values in parameters
- PHI in workflow metadata

### Error Handling
- Missing error nodes on API calls
- Unhandled exceptions in function nodes
- No retry logic for external services
- Missing fallback paths

### Action Library
- Unregistered custom nodes
- Missing metadata in Action Library
- Orphaned Action Library entries
- Naming inconsistencies

### Quality
- Hardcoded secrets
- Missing input validation
- No timeout configurations
- Inefficient data flows
- Missing documentation

## Self-Learning
Uses RAG with pgvector to:
- Store previous scan findings
- Learn from false positive feedback
- Recognize approved patterns
- Improve confidence scoring over time

## Usage

```bash
# Initialize RAG store
npm run init-rag

# Scan workflows
npm run scan

# With RAG learning enabled
RAG_ENABLED=true npm run scan

# Scan specific workflow file
WORKFLOW_PATH=../lookout-n8n/workflows/example.json npm run scan
```

## Configuration

Edit `config.json`:
- `repositories`: Workflow source repositories
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
- Summary of findings by severity
- Detailed findings with file paths and line numbers
- Code context for each issue
- Remediation suggestions

Also posts to reports API at `http://localhost:3456`.

## Best Practices

- Run before workflow deployments
- Integrate into CI/CD for n8n workflow PRs
- Review false positives to improve learning
- Keep Action Library metadata up to date
- Document PHI handling decisions in workflow notes

## Limitations

- Requires n8n workflow JSON format
- Cannot execute workflows (static analysis only)
- PHI detection is pattern-based (may have false positives)
- Action Library sync requires control-plane API access
