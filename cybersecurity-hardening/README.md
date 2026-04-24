# Cybersecurity Hardening Agent

Self-learning security scanning and hardening recommendations for the Lookout platform with RAG capabilities. Follows the [Agent Skills](https://agentskills.io) specification.

## Purpose

This agent performs comprehensive security analysis on Lookout platform repositories and provides actionable hardening recommendations. It learns from previous scans to improve detection accuracy over time using a RAG (Retrieval-Augmented Generation) knowledge base.

## Features

- **Security Scanning**: Dependencies, secrets, code patterns, infrastructure
- **Self-Learning**: Stores findings in Postgres with pgvector for semantic search
- **Pattern Recognition**: Learns from false positives to reduce noise over time
- **Confidence Scoring**: Provides confidence scores based on historical data
- **Agent Skills Compliant**: Follows the agentskills.io specification

## Quick Start

```bash
# Start Postgres with pgvector for RAG (separate docker container)
docker-compose up -d

# Install dependencies
npm install

# Initialize knowledge base
npm run init-rag

# Run full security scan
npm run scan

# View learning statistics
npm run stats
```

## Usage

```bash
# Run full security scan
npm run scan

# Scan specific repository
npm run scan -- --repo lookout-api

# Generate report
npm run report

# Mark finding as false positive (improves learning)
npm run feedback -- --id <finding-id> --type false-positive

# View learning statistics
npm run stats
```

## Configuration

Edit `config.json` to customize:
- Target repositories
- Severity thresholds
- Exclusion patterns
- RAG settings (enabled, confidence threshold, similarity threshold)

Edit `.env` to configure:
- Postgres connection details
- OpenAI API key for embeddings

## Agent Skills Structure

This skill follows the Agent Skills specification:
- `SKILL.md` - Required metadata and instructions
- `scripts/` - Initialization scripts
- `src/` - Executable code
- `docker-compose.yml` - Infrastructure for RAG
