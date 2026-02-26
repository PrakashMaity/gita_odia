import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL || 'https://bxcjjqyalflohwjyxdze.supabase.co';
const SUPABASE_ANON_KEY =
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // This will help catch misconfiguration early during development
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or anon key is missing');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


