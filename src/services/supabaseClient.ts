import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bxcjjqyalflohwjyxdze.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Y2pqcXlhbGZsb2h3anl4ZHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjYzODYsImV4cCI6MjA3ODcwMjM4Nn0.vezS_a5p1FI-xoi2ma3SDAM0IL6vF2kE7Xkd9WqwjxA';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // This will help catch misconfiguration early during development
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or anon key is missing');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


