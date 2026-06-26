/* eslint-disable @typescript-eslint/no-require-imports */
// One-off: applies schema.sql + holidays table + order_operations.sql to a
// fresh Supabase Postgres instance. Run once when setting up a new project.
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const HOLIDAYS_SQL = `
create table if not exists holidays (
  date date primary key
);
`;

function loadEnvLocal() {
  const envPath = path.join(__dirname, '../.env.local');
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}

async function main() {
  loadEnvLocal();
  const conn = process.env.SUPABASE_DB_URL;
  if (!conn) throw new Error('Set SUPABASE_DB_URL in .env.local with the Postgres connection string');

  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const schema = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
  const orderOps = fs.readFileSync(path.join(__dirname, '../supabase/order_operations.sql'), 'utf8');

  console.log('Applying holidays table...');
  await client.query(HOLIDAYS_SQL);

  console.log('Applying schema.sql...');
  await client.query(schema);

  console.log('Applying order_operations.sql...');
  await client.query(orderOps);

  const { rows } = await client.query(`select table_name from information_schema.tables where table_schema = 'public' order by table_name`);
  console.log('Tables now in public schema:', rows.map(r => r.table_name).join(', '));

  await client.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
