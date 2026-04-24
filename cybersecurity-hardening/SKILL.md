---
name: cybersecurity-hardening
description: Perform security scanning and hardening analysis on codebases. Detects vulnerabilities, secrets, insecure patterns, and infrastructure issues. Use when user mentions security, vulnerabilities, secrets, hardening, or security scanning. Self-learning: stores findings in RAG for pattern recognition and improved detection over time.
license: MIT
compatibility: Requires Node.js 18+, Docker for Postgres RAG store
metadata:
  author: hixson-ai
  version: "2.0"
  category: security
---

# Cybersecurity Hardening Skill

## Overview

This skill performs comprehensive security analysis on codebases and provides actionable hardening recommendations. It learns from previous scans to improve detection accuracy over time using a RAG (Retrieval-Augmented Generation) knowledge base.

## When to Use

Use this skill when:
- User requests security scanning or vulnerability assessment
- User mentions secrets detection or credential leakage
- User wants security hardening recommendations
- User asks about code security patterns
- User needs infrastructure security review (Dockerfile, configs)
- User references compliance or security audits

## How It Works

### 1. Discovery Phase
- Scan configured repositories for common security issues
- Check dependencies, secrets, code patterns, and infrastructure
- Generate findings with severity levels

### 2. Learning Phase (Self-Learning)
- Store all findings in Postgres RAG knowledge base with embeddings
- Track patterns: file types, code contexts, repository characteristics
- Learn from false positives (user feedback) to reduce noise
- Improve detection rules based on historical data

### 3. Analysis Phase
- Use RAG to retrieve similar historical findings
- Apply learned patterns to new scans
- Prioritize issues based on historical impact and context

### 4. Reporting Phase
- Generate actionable security reports
- Include confidence scores based on learning
- Suggest remediation steps with code examples
- Track remediation status over time

## Supported Checks

### Dependency Security
- Outdated or vulnerable packages
- Insecure version ranges (caret, wildcards)
- Known CVEs in dependencies

### Secrets Detection
- API keys, tokens, passwords in source code
- Private keys, certificates
- Hardcoded credentials in URLs
- Configuration files with sensitive data

### Code Security Patterns
- eval() usage
- innerHTML assignment (XSS risk)
- Hardcoded credentials
- Unsafe deserialization
- SQL injection patterns
- Command injection patterns

### Infrastructure Security
- Dockerfile best practices (USER, specific versions)
- Kubernetes security contexts
- Cloud configuration issues
- Exposed services/misconfigurations

## Self-Learning Capabilities

### Knowledge Storage
- Findings stored in Postgres with pgvector for semantic search
- Embeddings generated for issue descriptions and code contexts
- Metadata includes: file type, repository, language, severity

### Pattern Recognition
- Cluster similar findings to identify recurring issues
- Learn which patterns are false positives for specific contexts
- Adapt severity thresholds based on repository characteristics

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
- `checks`: Toggle specific security checks
- `rag.enabled`: Enable/disable self-learning
- `rag.confidenceThreshold`: Minimum confidence for learned patterns

## Output

Reports are generated in `reports/` directory:
- `security-scan-{date}.md`: Full security report
- `learning-insights-{date}.md`: Learned patterns and improvements
- `remediation-tracker-{date}.md`: Track issue resolution

## Best Practices

1. **Start with learning disabled** for initial scans to establish baseline
2. **Provide feedback** on findings to improve accuracy
3. **Review confidence scores** - lower scores indicate less certainty
4. **Regular scans** to track security posture over time
5. **Integrate with CI/CD** to catch issues early

## Limitations

- Static analysis only - cannot detect runtime vulnerabilities
- May generate false positives in test/mock code
- Learning quality depends on feedback volume
- Requires initial scan data before learning becomes effective
