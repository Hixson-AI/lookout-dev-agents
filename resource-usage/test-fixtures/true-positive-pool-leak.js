// EXPECT: connection-leak HIGH
// A pg Pool created with no .end() / closePool anywhere in the file.
import pg from 'pg';
export function brokenInit() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}
