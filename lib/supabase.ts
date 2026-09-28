import { createClient } from '@supabase/supabase-js';

if (typeof window === 'undefined' && typeof WebSocket === 'undefined') {
  try {
    (global as any).WebSocket = require('ws');
  } catch {}
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Public Supabase client for client-side and public queries.
 * Null/unconfigured if environment variables are not yet provided.
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
