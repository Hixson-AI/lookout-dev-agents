---
name: logging-verification
description: Verify that all services are logging with proper tenant context and required fields. Checks TENANT_ID environment variable usage, @lookout/telemetry package usage, log context completeness, and metric label compliance. Use when user mentions logging, tenant context, observability, or telemetry verification. Self-learning: stores findings in RAG for pattern recognition and improved detection over time.
license: MIT
compatibility: Requires Node.js 18+, Docker for Postgres RAG store
metadata:
  author: hixson-ai
  version: "1.0"
  category: observability
---

# Logging Verification Skill

## Overview

This skill verifies that all services in the Lookout platform are logging with proper tenant context and required fields. It ensures that tenant isolation is correctly implemented in observability data (logs and metrics) by checking for TENANT_ID usage, @lookout/telemetry package integration, and log context completeness.

## When to Use

Use this skill when:
- User requests logging verification or observability audit
- User mentions tenant context in logs or metrics
- User wants to ensure tenant isolation in observability
- User asks about @lookout/telemetry usage
- User references logging best practices or compliance
- User needs to verify Phase 4.2 (Observability Tenant Isolation) implementation

## How It Works

### 1. Discovery Phase
- Scan configured repositories for logging patterns
- Check TENANT_ID environment variable usage
- Verify @lookout/telemetry package integration
- Validate log context completeness
- Check metric label compliance

### 2. Learning Phase (Self-Learning)
- Store all findings in Postgres RAG knowledge base with embeddings
- Track patterns: service types, logging patterns, common issues
- Learn from false positives (user feedback) to reduce noise
- Improve detection rules based on historical data

### 3. Analysis Phase
- Use RAG to retrieve similar historical findings
- Apply learned patterns to new scans
- Prioritize issues based on historical impact and context

### 4. Reporting Phase
- Generate actionable logging verification reports
- Include confidence scores based on learning
- Suggest remediation steps with code examples
- Track remediation status over time

## Supported Checks

### Tenant Context Verification
- TENANT_ID environment variable is set
- TENANT_ID is set in appropriate locations (middleware, server startup, job execution)
- Platform services set TENANT_ID='platform'
- Multi-tenant services set TENANT_ID from request/job context

### @lookout/telemetry Usage
- Package is imported and initialized
- tenantId parameter is passed to initTelemetry()
- tenantId parameter is passed to getMetricsRegistry()
- Environment variable TENANT_ID is used as fallback

### Log Context Completeness
- Logs include tenant context (via TENANT_ID or explicit tenantId)
- Logs include service context
- Logs include environment context
- Logs include deployment profile context

### Metric Label Compliance
- Metrics include tenant_id label
- Metrics include service label
- Metrics include environment label
- Prometheus default labels are configured

## Self-Learning Capabilities

### Knowledge Storage
- Findings stored in Postgres with pgvector for semantic search
- Embeddings generated for issue descriptions and code contexts
- Metadata includes: file type, repository, language, severity

### Pattern Recognition
- Cluster similar findings to identify recurring issues
- Learn which patterns are false positives for specific contexts
- Adapt severity thresholds based on service characteristics

### Continuous Improvement
- User feedback loop: mark findings as true/false positive
- Update detection rules based on confirmed patterns
- Reduce noise over time while maintaining sensitivity

## Usage

### Initial Setup
```bash
# Start Postgres with pgvector for RAG
docker-compose up -d

# Install dependencies
npm install

# Initialize knowledge base
npm run init-rag
```

### Run Scan
```bash
# Full scan with learning
npm run scan

# Scan specific repository
npm run scan -- --repo lookout-api

# Generate report with learned insights
npm run report
```

### Feedback Loop
```bash
# Mark finding as false positive (improves learning)
npm run feedback -- --id <finding-id> --type false-positive

# View learning statistics
npm run stats
```

## Configuration

Edit `config.json`:
- `repositories`: Target repositories to scan
- `severityThreshold`: Minimum severity to report (low/medium/high)
- `excludePatterns`: File/directory patterns to ignore
- `checks`: Toggle specific logging checks
- `rag.enabled`: Enable/disable self-learning
- `rag.confidenceThreshold`: Minimum confidence for learned patterns

## Output

Reports are generated in `reports/` directory:
- `logging-verification-{date}.md`: Full logging verification report
- `learning-insights-{date}.md`: Learned patterns and improvements
- `remediation-tracker-{date}.md`: Track issue resolution

## Best Practices

1. **Start with learning disabled** for initial scans to establish baseline
2. **Provide feedback** on findings to improve accuracy
3. **Review confidence scores** - lower scores indicate less certainty
4. **Regular scans** to track logging compliance over time
5. **Integrate with CI/CD** to catch logging issues early

## Limitations

- Static analysis only - cannot verify runtime log values
- May generate false positives in test/mock code
- Learning quality depends on feedback volume
- Requires initial scan data before learning becomes effective
