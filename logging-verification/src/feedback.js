import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function handleFeedback(args) {
  const id = args.id;
  const type = args.type;

  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    user: process.env.POSTGRES_USER || 'lookout',
    password: process.env.POSTGRES_PASSWORD || 'lookout',
    database: process.env.POSTGRES_DB || 'logging_verification'
  });

  try {
    await client.connect();

    // Mark finding as false positive
    await client.query(
      'UPDATE findings SET is_false_positive = $1 WHERE id = $2',
      [type === 'false-positive', id]
    );

    console.log(`✅ Marked finding ${id} as ${type}`);
  } catch (error) {
    console.error('Error handling feedback:', error);
  } finally {
    await client.end();
  }
}

const args = process.argv.slice(2);
handleFeedback({
  id: args[args.indexOf('--id') + 1],
  type: args[args.indexOf('--type') + 1]
});
