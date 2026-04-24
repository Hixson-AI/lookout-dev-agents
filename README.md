# Lookout Dev Agents

Collection of self-learning development agents for the Lookout platform, following the [Agent Skills](https://agentskills.io) specification.

## Purpose

This repository contains development-focused agents that assist with:
- Code quality and security
- Documentation generation
- Testing and validation
- Infrastructure automation

All agents are self-learning using RAG (Retrieval-Augmented Generation) with Docker Postgres + pgvector for knowledge storage and pattern recognition.

## Agent Skills Pattern

Each agent follows the Agent Skills specification:
- `SKILL.md` - Required metadata and instructions for agent discovery and activation
- `scripts/` - Optional executable code and initialization scripts
- `src/` - Core agent implementation
- `references/` - Optional documentation and references
- `assets/` - Optional templates and resources
- `docker-compose.yml` - Infrastructure for RAG capabilities (Postgres + pgvector)

## Agents

### Cybersecurity Hardening Agent
Self-learning security scanning and hardening recommendations. Detects vulnerabilities, secrets, insecure patterns, and infrastructure issues. Learns from previous scans to improve accuracy over time.

See `cybersecurity-hardening/README.md` for detailed usage.

### Architecture Review Agent
Self-learning architecture compliance agent that reviews as-built code against the Lookout platform architecture docs and principles. Detects architectural drift, principle violations, and compliance gaps.

See `architecture-review/README.md` for detailed usage.

## Infrastructure

All agents share a common RAG infrastructure:
- **Postgres 16 with pgvector** - Vector similarity search for finding patterns
- **OpenAI embeddings** - Text embeddings for semantic search
- **Self-learning** - Agents learn from findings and user feedback

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Hixson-AI/lookout-dev-agents.git
cd lookout-dev-agents

# Navigate to an agent
cd cybersecurity-hardening

# Start RAG infrastructure
docker-compose up -d

# Install dependencies
npm install

# Initialize knowledge base
npm run init-rag

# Run the agent
npm run scan
```

## Dev Agents Dashboard

The root package provides a unified dashboard and API for managing all agents:

```bash
# Install root dependencies
npm install

# Run CLI dashboard
npm run dashboard

# Run all agents
npm run run-all

# Show stats for all agents
npm run stats-all

# Generate unified report
npm run aggregate-reports

# Start REST API server (for integration with lookout-portal)
npm run api
```

### API Endpoints

When running `npm run api`, the following endpoints are available:

- `GET /agents` - List all agents with status
- `GET /agents/:id` - Get specific agent details
- `POST /agents/:id/run` - Run a specific agent
- `POST /agents/run-all` - Run all agents
- `GET /agents/:id/stats` - Get agent learning stats
- `GET /reports/unified` - Get unified report
- `POST /reports/unified` - Generate unified report
- `GET /health` - Health check

## Adding New Agents

To add a new agent following the Agent Skills pattern:

1. Create a new directory: `agent-name/`
2. Add `SKILL.md` with frontmatter (name, description, license, compatibility, metadata)
3. Implement the agent in `src/`
4. Add `docker-compose.yml` if RAG capabilities are needed
5. Add `README.md` with usage instructions
6. Follow the self-learning pattern using the shared RAG infrastructure
