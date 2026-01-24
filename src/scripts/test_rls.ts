
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfycntttvcyyccjvasug.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MISSING_KEY';

console.log('Testing public access with ANON KEY...');

if (ANON_KEY === 'MISSING_KEY') {
    console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not set.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testTableAccess(tableName: string) {
    console.log(`\nTesting table: ${tableName}`);
    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (error) {
        console.log(`[SECURE] Access denied or error: ${error.message}`);
    } else {
        console.log(`[VULNERABLE] Data accessed successfully! Found ${data.length} records.`);
        console.log('Sample data:', data);
    }
}

async function run() {
    await testTableAccess('users');
    await testTableAccess('prosthetic_requests');
    await testTableAccess('subscriptions');
}

run();
