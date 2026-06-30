const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env.local file to get the Postgres connection string
const envPath = path.resolve(__dirname, '../.env.local');
let postgresUri = '';

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        postgresUri = value;
      }
    }
  });
}

if (!postgresUri) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

const client = new Client({ connectionString: postgresUri });

async function run() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    const email = 'mihran.taher@forliion.com';
    
    // 1. Find user ID from auth.users
    console.log(`Searching for user with email: ${email}...`);
    const userRes = await client.query('SELECT id, email FROM auth.users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`User not found in auth.users table for email: ${email}`);
      console.log('Listing all registered users to check:');
      const allUsers = await client.query('SELECT id, email FROM auth.users LIMIT 10');
      console.log(allUsers.rows);
      await client.end();
      return;
    }

    const userId = userRes.rows[0].id;
    console.log(`Found user: ${email} with ID: ${userId}`);

    // 2. Check current profile
    const profileRes = await client.query('SELECT * FROM public.profiles WHERE id = $1', [userId]);
    console.log('Current profile status:', profileRes.rows[0]);

    // 3. Update profile to Pro and limit to 100
    console.log('Updating profile: premium_status -> Pro, analysis_limit -> 100...');
    const updateRes = await client.query(
      'UPDATE public.profiles SET premium_status = $1, analysis_limit = $2 WHERE id = $3 RETURNING *',
      ['Pro', 100, userId]
    );

    console.log('Updated profile result:', updateRes.rows[0]);

  } catch (err) {
    console.error('Database operation failed:', err);
  } finally {
    await client.end();
  }
}

run();
