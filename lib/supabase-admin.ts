import { createClient } from '@supabase/supabase-js';

if (typeof window === 'undefined' && typeof WebSocket === 'undefined') {
  try {
    (global as any).WebSocket = require('ws');
  } catch {}
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Server-only Supabase client with elevated service role privileges.
 * NEVER expose this to the browser.
 */
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
