// One-off: pushes selected vars from .env.local to the linked Vercel project's
// production environment, piping each value through stdin so secrets never
// appear as literal command-line arguments.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'TELEGRAM_GROUP_CHAT_ID',
  'CLICKSEND_USERNAME',
  'CLICKSEND_API_KEY',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'ADMIN_PASSWORD',
];

function parseEnv(file) {
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = parseEnv(path.join(__dirname, '../.env.local'));

for (const key of VARS) {
  const value = env[key];
  if (!value) { console.log('SKIP (no value):', key); continue; }
  // Remove existing value first so re-runs don't fail on duplicates.
  spawnSync('vercel', ['env', 'rm', key, 'production', '--yes'], { stdio: 'ignore', shell: true });
  const res = spawnSync('vercel', ['env', 'add', key, 'production'], {
    input: value,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
  });
  const ok = res.status === 0;
  console.log(ok ? 'OK  ' : 'FAIL', key, ok ? '' : res.stderr.toString().slice(0, 200));
}
