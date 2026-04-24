---
name: architecture-review
description: Review as-built code against the Lookout platform architecture docs and principles. Detects architectural drift, principle violations, and compliance gaps. Self-learning via RAG against architecture knowledge base for improved detection over time.
license: MIT
compatibility: Requires Node.js 18+, Docker for Postgres RAG store (shared with other agents)
metadata:
  author: hixson-ai
  version: "1.0"
  category: architecture
---

# Architecture Review Agent

## Overview

This agent reviews as-built code in Lookout platform repositories against the architecture documentation and principles defined in `lookout-architecture/docs`. It detects drift, violations, and compliance gaps while learning from feedback to improve accuracy over time.

## When to Use

Use this skill when:
- Reviewing code for alignment with architecture principles
- Detecting architectural drift after implementation
- Validating new code against documented patterns
- Checking PHI handling compliance
- Verifying control plane vs execution plane separation
- Reviewing orchestration patterns against SoR rules
- Checking for over-engineering or anti-patterns

## How It Works

### 1. Discovery Phase
- Scan configured repositories for architecture-relevant code patterns
- Check against explicit rule categories (PHI, control plane, orchestration, etc.)
- Retrieve relevant architecture docs via RAG semantic search
- Generate findings with severity and principle references

### 2. Learning Phase (Self-Learning)
- Store all findings in Postgres RAG knowledge base with embeddings
- Track patterns: file types, code contexts, repository characteristics
- Learn from false positives (user feedback) to reduce noise
- Improve detection rules based on historical data

### 3. Analysis Phase
- Use RAG to retrieve similar historical findings and relevant architecture docs
- Apply learned patterns to new scans
- Prioritize issues based on historical impact and context
- Reference specific architecture docs and principles in findings

### 4. Reporting Phase
- Generate actionable architecture compliance reports
- Include confidence scores based on learning
- Suggest remediation steps with architecture doc references
- Track drift resolution over time

## Architecture Checks

### Principle 1: Simplicity First
- Over-engineered abstractions or premature optimization
- Unnecessary microservices or layers
- Dependency bloat or unused imports

### Principle 3: Shared Control Plane Boundary
- Control plane code processing client data or PHI
- Missing tenant isolation in control-plane routes
- Control plane middleware not enforcing boundaries

### Principle 4: Dedicated by Need
- PHI data in shared environments (code-level detection)
- Missing environment checks for sensitive operations
- Hardcoded environment assumptions

### Principle 5: PHI Caution
- Missing PHI scrubbing in logs or observability
- Hardcoded PHI in error messages or responses
- Unencrypted PHI in code or tests
- Missing BAA-aware AI routing comments or configuration

### Principle 7: Orchestration Is Not the System of Record
- n8n workflows storing persistent state without external DB
- Workflow execution logic treating transient state as durable
- Missing recovery plans in orchestration code

### Principle 10: Scale Through Templates
- Bespoke solutions where templates should apply
- Hardcoded tenant-specific logic instead of parameterized templates
- Missing automation for repeatable patterns

### Repository Structure Compliance
- Missing architecture doc references in implementation PRs
- Code structure deviating from defined repo roles
- Unauthorized cross-repo dependencies

## Self-Learning Capabilities

### Knowledge Storage
- Findings stored in Postgres with pgvector for semantic search
- Embeddings generated for issue descriptions, code contexts, and architecture principles
- Metadata includes: file type, repository, language, severity, principle reference

### Pattern Recognition
- Cluster similar findings to identify recurring drift patterns
- Learn which patterns are false positives for specific contexts
- Adapt severity thresholds based on repository characteristics

### Continuous Improvement
- User feedback loop: mark findings as true/false positive
- Update detection rules based on confirmed patterns
- Reduce noise over time while maintaining sensitivity

## Usage

### Initial Setup
```bash
# Install dependencies
npm install

# Initialize knowledge base (uses shared RAG database)
npm run init-rag

# Ingest architecture docs into knowledge base
npm run ingest-architecture
```

### Run Review
```bash
# Full review of all configured repositories
npm run scan

# Review specific repository
npm run scan -- --repo lookout-api

# Generate report
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
- `repositories`: Target repositories to review
- `severityThreshold`: Minimum severity to report (low/medium/high)
- `excludePatterns`: File/directory patterns to ignore
- `checks`: Toggle specific architecture checks
- `rag.enabled`: Enable/disable self-learning
- `rag.confidenceThreshold`: Minimum confidence for learned patterns

## Output

Reports are generated in `reports/` directory:
- `architecture-review-{date}.md`: Full compliance report
- `learning-insights-{date}.md`: Learned patterns and improvements
- `drift-tracker-{date}.md`: Track architectural drift resolution

## Best Practices

1. **Run after significant changes** to catch drift early
2. **Provide feedback** on findings to improve accuracy
3. **Review confidence scores** - lower scores indicate less certainty
4. **Regular reviews** to track architecture posture over time
5. **Integrate with CI/CD** to catch drift before merge

## Limitations

- Static analysis only - cannot detect runtime architectural issues
- May generate false positives in test/mock code
- Learning quality depends on feedback volume
- Requires architecture docs to be ingested before meaningful review
- Cannot assess business-logic correctness, only structural compliance
