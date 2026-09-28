-- ==============================================================================
-- TASLIMAH WOLI PHOTOGRAPHY — SUPABASE POSTGRESQL SCHEMA
-- Copy and run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. CMS CONTENT TABLE (Stores Draft and Published JSON site payloads)
CREATE TABLE IF NOT EXISTS public.cms_content (
  id TEXT PRIMARY KEY, -- 'published' or 'draft'
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read 'published' site content
CREATE POLICY "Allow public read on published content"
  ON public.cms_content
  FOR SELECT
  USING (id = 'published');

-- Service role has full access
CREATE POLICY "Allow service role full access on cms_content"
  ON public.cms_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- 2. CMS USERS TABLE (Admin & Developer credentials with bcrypt hashes)
CREATE TABLE IF NOT EXISTS public.cms_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner', -- 'owner' | 'developer'
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.cms_users ENABLE ROW LEVEL SECURITY;

-- Service role only can access users table
CREATE POLICY "Allow service role full access on cms_users"
  ON public.cms_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed Initial Admin Accounts (Bcrypt Hashed)
INSERT INTO public.cms_users (username, email, password_hash, role, name)
VALUES 
  (
    'taslimah',
    'taslimah@taslimahwoli.com',
    '$2b$10$sur5DM5SBoPDGxX6ZvzHY.Sfza.74cKAkrfCVN96iGoqHqystUhI.',
    'owner',
    'Taslimah Woli'
  ),
  (
    'Ohayo',
    'dev@ohayo.internal',
    '$2b$10$My91ld11OC18t9iFtXazAOkzr5TiJ7D9xf5YY2.aMjbWDSiTl8lz6',
    'developer',
    'Ohayo (Lead Developer)'
  )
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name;


-- 3. STORAGE BUCKET FOR PHOTOGRAPHS & HIGH-RES MEDIA
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view photos in the bucket
CREATE POLICY "Public media access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- Service role / admins can upload photos
CREATE POLICY "Admin media upload"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Admin media delete"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'portfolio-media');
