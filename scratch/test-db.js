const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing Supabase Client connection...');
  
  // Test 1: Fetch profiles
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
    
  if (pError) {
    console.error('Profiles select error:', pError);
  } else {
    console.log('Profiles table exists. Sample rows:', profiles);
  }

  // Test 2: Fetch analyses
  const { data: analyses, error: aError } = await supabase
    .from('analyses')
    .select('*')
    .limit(5);
    
  if (aError) {
    console.error('Analyses select error:', aError);
  } else {
    console.log('Analyses table exists. Sample rows:', analyses);
  }
}

test();
