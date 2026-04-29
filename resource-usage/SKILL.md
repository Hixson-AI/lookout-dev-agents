---
name: resource-usage
version: 1.0.0
description: Scans for resource leaks, connection pool issues, memory leaks, and improper cleanup
author: Hixson AI
topics: [resources, memory, connections, performance, leaks]
---

# Resource Usage Agent

## Overview
The Resource Usage Agent scans code for resource leaks, connection pool issues, memory leaks, and improper cleanup patterns. Helps identify performance bottlenecks and resource management problems.

## When to Use
- Before deploying to production
- When reviewing code for performance issues
- During memory leak investigations
- For continuous monitoring of resource usage patterns

## How It Works

### Discovery
- Scans TypeScript/JavaScript source files
- Identifies resource allocation patterns
- Analyzes cleanup and disposal patterns

### Analysis
Checks for resource management issues:

#### Memory Leaks
- Event listeners not removed
- Timers not cleared
- Closures retaining references
- Global variable pollution
- Circular references in complex objects

#### Connection Leaks
- Database connections not closed
- HTTP clients not disposed
- WebSocket connections not closed
- File handles not released
- Stream objects not destroyed

#### Resource Cleanup
- Missing finally blocks
- No cleanup on error paths
- Missing disposal in destructors
- Improper async cleanup
- Missing timeout cleanup

#### Performance Patterns
- Inefficient loops
- Unnecessary object creation
- Missing caching where appropriate
- Synchronous blocking operations
- Large object allocations

### Reporting
- Generates markdown reports with resource issues
- Posts findings to shared reports API
- Provides line-level context
- Suggests remediation steps

## Resource Usage Checks

### Memory Leaks
- Event listeners without removal
- Uncleared timers (setTimeout, setInterval)
- Closures with large captured scopes
- Global variable assignments
- Circular references

### Connection Leaks
- Unclosed database connections
- Undisposed HTTP clients
- Unclosed WebSocket connections
- Unreleased file handles
- Undestroyed streams

### Cleanup Issues
- Missing finally blocks
- No cleanup on error paths
- Missing disposal patterns
- Improper async cleanup
- Missing timeout cleanup

### Performance
- Inefficient loops
- Unnecessary object creation
- Missing caching
- Synchronous blocking
- Large allocations

## Self-Learning
Uses RAG with pgvector to:
- Store previous resource issues
- Learn from false positive feedback
- Recognize approved patterns
- Improve detection accuracy over time

## Usage

```bash
# Initialize RAG store
npm run init-rag

# Scan resource usage
npm run scan

# With RAG learning enabled
RAG_ENABLED=true npm run scan

# Scan specific service
SERVICE=lookout-api npm run scan
```

## Configuration

Edit `config.json`:
- `repositories`: Service repositories to scan
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
- Summary of issues by severity
- Detailed issues with file paths and line numbers
- Code context for each issue
- Remediation suggestions

Also posts to reports API at `http://localhost:3456`.

## Best Practices

- Run before deploying to production
- Integrate into CI/CD for PRs
- Review false positives to improve learning
- Use proper cleanup patterns (try/finally)
- Implement connection pooling

## Limitations

- Static analysis only (cannot measure runtime usage)
- May have false positives for complex patterns
- Cannot detect all memory leak types
- Runtime-only issues may be missed
