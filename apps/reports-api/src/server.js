import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(fileURLToPath(import.meta.url), '../../../.env') });

const { Pool } = pg;
const app = express();
const PORT = process.env.REPORTS_API_PORT || 3456;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5435'),
  database: process.env.POSTGRES_DB || 'agents_rag',
  user: process.env.POSTGRES_USER || 'agent_user',
  password: process.env.POSTGRES_PASSWORD || 'changeme',
});

// Health check
app.get('/healthz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

// List all agents that have reports
app.get('/api/agents', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT agent_name FROM agent_reports ORDER BY agent_name'
    );
    res.json(result.rows.map(r => r.agent_name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List reports (optionally filtered by agent)
app.get('/api/reports', async (req, res) => {
  try {
    const { agent, limit = '50', offset = '0' } = req.query;
    let sql = 'SELECT * FROM agent_reports';
    const params = [];
    if (agent) {
      sql += ' WHERE agent_name = $1';
      params.push(agent);
    }
    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(sql, params);

    // Get finding counts per report
    const reportsWithCounts = await Promise.all(
      result.rows.map(async (report) => {
        const counts = await pool.query(
          `SELECT severity, COUNT(*) as count FROM report_findings WHERE report_id = $1 GROUP BY severity`,
          [report.id]
        );
        const severityMap = { high: 0, medium: 0, low: 0 };
        counts.rows.forEach(r => { severityMap[r.severity] = parseInt(r.count); });
        return { ...report, severity_counts: severityMap, total_findings: counts.rows.reduce((s, r) => s + parseInt(r.count), 0) };
      })
    );

    res.json(reportsWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single report with findings
app.get('/api/reports/:id', async (req, res) => {
  try {
    const reportResult = await pool.query(
      'SELECT * FROM agent_reports WHERE id = $1',
      [req.params.id]
    );
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const findingsResult = await pool.query(
      'SELECT * FROM report_findings WHERE report_id = $1 ORDER BY severity DESC, created_at ASC',
      [req.params.id]
    );

    res.json({
      ...reportResult.rows[0],
      findings: findingsResult.rows,
      total_findings: findingsResult.rows.length,
      severity_counts: findingsResult.rows.reduce((acc, f) => {
        acc[f.severity] = (acc[f.severity] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create report (for agents to call)
app.post('/api/reports', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { agent_name, report_type, title, summary, metadata, findings } = req.body;

    const reportResult = await client.query(
      `INSERT INTO agent_reports (agent_name, report_type, title, summary, metadata)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [agent_name, report_type || 'scan', title, summary || {}, metadata || {}]
    );
    const report = reportResult.rows[0];

    if (findings && findings.length > 0) {
      for (const f of findings) {
        await client.query(
          `INSERT INTO report_findings (report_id, severity, file_path, line_number, message, finding_type, code_context, repository, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            report.id,
            f.severity,
            f.file_path || f.file || null,
            f.line_number || null,
            f.message,
            f.finding_type || f.type || null,
            f.code_context || null,
            f.repository || null,
            f.metadata || {}
          ]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ id: report.id, created: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Reports API listening on http://0.0.0.0:${PORT}`);
});
