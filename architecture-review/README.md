# Architecture Review Agent

Self-learning architecture compliance agent for the Lookout platform. Reviews as-built code against architecture docs and principles with RAG capabilities. Follows the [Agent Skills](https://agentskills.io) specification.

## Purpose

This agent reviews Lookout platform repositories against the architecture documentation and principles defined in `lookout-architecture/docs`. It detects architectural drift, principle violations, and compliance gaps while learning from feedback to improve accuracy over time.

## Features

- **Architecture Compliance**: Checks against documented principles (Simplicity First, PHI Caution, Control Plane Boundary, etc.)
- **Self-Learning**: Stores findings in Postgres with pgvector for semantic search
- **Pattern Recognition**: Learns from false positives to reduce noise over time
- **Confidence Scoring**: Provides confidence scores based on historical data
- **Agent Skills Compliant**: Follows the agentskills.io specification
- **Architecture Doc Ingestion**: Ingests architecture docs for semantic retrieval

## Quick Start

```bash
# Install dependencies
npm install

# Start Postgres with pgvector for RAG
docker-compose up -d

# Initialize knowledge base
npm run init-rag

# Ingest architecture docs
npm run ingest-architecture

# Run full architecture review
npm run scan

# View learning statistics
npm run stats
```

## Usage

```bash
# Run full architecture review
npm run scan

# Review specific repository
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
- Postgres connection details (can share with cybersecurity-hardening agent)
- OpenAI API key for embeddings

## Architecture Checks

The agent checks against these principles from `docs/04-architecture-principles.md`:

- **Principle 1: Simplicity First**: Over-engineering patterns, unnecessary abstractions
- **Principle 3: Shared Control Plane Boundary**: Control plane processing client data
- **Principle 5: PHI Caution**: Missing PHI scrubbing, hardcoded PHI, unencrypted PHI
- **Principle 7: Orchestration Is Not the System of Record**: n8n storing persistent state
- **Principle 10: Scale Through Templates**: Bespoke solutions where templates should apply
- **Documentation Compliance**: Missing ADR references, architecture doc drift
- **Repository Structure**: Unauthorized cross-repo dependencies

## Agent Skills Structure

This skill follows the Agent Skills specification:
- `SKILL.md` - Required metadata and instructions
- `scripts/` - Initialization scripts
- `src/` - Executable code
- `docker-compose.yml` - Infrastructure for RAG
