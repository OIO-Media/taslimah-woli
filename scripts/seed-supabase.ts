import fs from 'fs';
import path from 'path';

// Read .env.local manually
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
} catch (err) {
  console.warn('Could not read .env.local:', err);
}

import { createClient } from '@supabase/supabase-js';
import { INITIAL_CMS_DATA } from '../lib/cms-defaults';

if (typeof WebSocket === 'undefined') {
  try {
    (global as any).WebSocket = require('ws');
  } catch {}
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Seeding Supabase PostgreSQL with initial portfolio data...');

  const now = new Date().toISOString();
  const payload = {
    ...INITIAL_CMS_DATA,
    lastUpdated: now,
  };

  // 1. Seed published record
  const { error: pubErr } = await supabase
    .from('cms_content')
    .upsert({
      id: 'published',
      data: payload,
      updated_at: now,
    });

  if (pubErr) {
    console.error('❌ Error seeding published content:', pubErr);
    process.exit(1);
  }

  // 2. Seed draft record
  const { error: draftErr } = await supabase
    .from('cms_content')
    .upsert({
      id: 'draft',
      data: payload,
      updated_at: now,
    });

  if (draftErr) {
    console.error('❌ Error seeding draft content:', draftErr);
    process.exit(1);
  }

  console.log('✅ Successfully seeded published and draft content to Supabase!');
}

seed().catch(console.error);
