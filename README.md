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

### Reports Stack

A shared reporting layer persists agent scan results and surfaces them in a React UI:

- **`apps/reports-api`** — Express API for report CRUD and agent listing (`:3456`)
- **`apps/reports-ui`** — Vite + React UI for browsing reports (`:5173`)
- **`scripts/init-reports.sql`** — Shared `agent_reports` and `report_findings` schema

Agents POST findings to the API at scan completion. The UI supports per-agent filtering, severity stats, search, and **IDE protocol links** (`vscode://`, `windsurf://`, `cursor://`, `jetbrains://`) for every file path.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Hixson-AI/lookout-dev-agents.git
cd lookout-dev-agents

# Start all infrastructure (Postgres + Reports API + Reports UI)
cd cybersecurity-hardening
docker-compose up -d

# Navigate to an agent
cd ../cybersecurity-hardening

# Install dependencies
npm install

# Initialize knowledge base
npm run init-rag

# Run the agent (auto-persists report to API)
npm run scan
```

Open the reports UI at http://localhost:5173 to view the scan results.

## Dev Agents Dashboard

The root package provides a CLI dashboard for managing all agents. For a visual interface, use the **Reports UI** (`apps/reports-ui`) included in the Docker Compose stack.

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
```

### Reports API Endpoints

The reports API (`apps/reports-api`) provides the backend for the React UI:

- `GET /healthz` - Health check
- `GET /api/agents` - List distinct agents that have submitted reports
- `GET /api/reports?agent=&limit=&offset=` - List reports with severity counts
- `GET /api/reports/:id` - Get single report with all findings
- `POST /api/reports` - Submit a report (agent scan results)

Report body:
```json
{
  "agent_name": "cybersecurity-hardening",
  "report_type": "security-scan",
  "title": "Security Scan — 2026-04-24",
  "summary": { "total_issues": 14, "high": 10, "medium": 4, "low": 0 },
  "findings": [
    {
      "severity": "high",
      "file_path": "/src/auth.ts",
      "line_number": 42,
      "message": "Hardcoded API key detected",
      "finding_type": "secret",
      "code_context": "const API_KEY = 'sk-...'",
      "repository": "lookout-api"
    }
  ]
}
```

## Adding New Agents

To add a new agent following the Agent Skills pattern:

1. Create a new directory: `agent-name/`
2. Add `SKILL.md` with frontmatter (name, description, license, compatibility, metadata)
3. Implement the agent in `src/`
4. Add `docker-compose.yml` if RAG capabilities are needed
5. Add `README.md` with usage instructions
6. Follow the self-learning pattern using the shared RAG infrastructure
7. **Wire scan results to the reports API** — POST to `http://localhost:3456/api/reports` with `agent_name` and findings so results appear in the shared UI
