// EXPECT: performance MEDIUM (sync fs in async function)
import fs from 'fs';
export async function loadConfig() {
  const data = fs.readFileSync('/etc/config.json', 'utf8');
  return JSON.parse(data);
}
