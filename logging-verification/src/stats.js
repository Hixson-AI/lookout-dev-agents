import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function showStats() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    user: process.env.POSTGRES_USER || 'lookout',
    password: process.env.POSTGRES_PASSWORD || 'lookout',
    database: process.env.POSTGRES_DB || 'logging_verification'
  });

  try {
    await client.connect();

    const totalResult = await client.query('SELECT COUNT(*) FROM findings');
    const falsePositiveResult = await client.query('SELECT COUNT(*) FROM findings WHERE is_false_positive = true');
    const bySeverityResult = await client.query('SELECT severity, COUNT(*) FROM findings GROUP BY severity');
    const byRepoResult = await client.query('SELECT repository, COUNT(*) FROM findings GROUP BY repository');

    console.log('\n📊 Learning Statistics');
    console.log('======================');
    console.log(`Total findings stored: ${totalResult.rows[0].count}`);
    console.log(`False positives marked: ${falsePositiveResult.rows[0].count}`);
    console.log('\nBy severity:');
    bySeverityResult.rows.forEach(row => {
      console.log(`  ${row.severity}: ${row.count}`);
    });
    console.log('\nBy repository:');
    byRepoResult.rows.forEach(row => {
      console.log(`  ${row.repository}: ${row.count}`);
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    await client.end();
  }
}

showStats();
