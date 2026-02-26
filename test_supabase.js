const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bxcjjqyalflohwjyxdze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Y2pqcXlhbGZsb2h3anl4ZHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjYzODYsImV4cCI6MjA3ODcwMjM4Nn0.vezS_a5p1FI-xoi2ma3SDAM0IL6vF2kE7Xkd9WqwjxA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTable() {
    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching table:', error);
    } else if (data && data.length > 0) {
        console.log('Columns in devices table:', Object.keys(data[0]));
    } else {
        console.log('No data, cannot infer columns, attempting to insert dummy data to trigger error and see which column fails');

        const { error: insertError } = await supabase.from('devices').upsert({
            device_id: 'test-device-id',
            platform: 'android',
            client_code: 'bn',
            fcm_token: 'dummy',
        });
        console.error('Insert error details:', insertError);
    }
}

checkTable();
