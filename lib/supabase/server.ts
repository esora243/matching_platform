import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
  );
};