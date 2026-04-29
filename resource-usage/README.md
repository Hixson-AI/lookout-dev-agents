# Resource Usage Agent

Scans for resource leaks, connection pool issues, memory leaks, and improper cleanup patterns.

## Features

- **Memory Leak Detection**: Event listeners, timers, closures, global variables
- **Connection Leak Detection**: Database connections, HTTP clients, WebSockets, file handles
- **Cleanup Issues**: Missing finally blocks, error path cleanup, disposal patterns
- **Performance Patterns**: Inefficient loops, object creation, caching, blocking operations

## Quick Start

```bash
# Install dependencies
npm install

# Initialize RAG database
npm run init-rag

# Scan resource usage
npm run scan
```

## Configuration

Edit `config.json` to configure:
- Repositories to scan
- Enabled checks
- Severity thresholds
- RAG settings

## Resource Usage Checks

### Memory Leaks
- Event listeners without removal
- Uncleared timers
- Closures with large scopes
- Global variable pollution
- Circular references

### Connection Leaks
- Unclosed database connections
- Undisposed HTTP clients
- Unclosed WebSockets
- Unreleased file handles
- Undestroyed streams

### Cleanup Issues
- Missing finally blocks
- No cleanup on error paths
- Missing disposal patterns
- Improper async cleanup

### Performance
- Inefficient loops
- Unnecessary object creation
- Missing caching
- Synchronous blocking

## Output

Reports saved to `reports/` directory and posted to the shared reports API at `http://localhost:3456`.

## Requirements

- Node.js 18+
- PostgreSQL with pgvector extension
- OpenAI API key (if using RAG)
