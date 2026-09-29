import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifySessionToken } from '@/lib/cms-auth';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!verifySessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized to upload media' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Cloud storage is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawFolder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Enforce max file size limit (25MB for high-resolution photography)
    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds maximum upload size of 25MB' },
        { status: 413 }
      );
    }

    // 2. Enforce strict MIME type and extension validation
    const ALLOWED_MIME_TYPES = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
    ]);

    const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(fileExt) || !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Only JPEG, PNG, WebP, and AVIF images are allowed.' },
        { status: 415 }
      );
    }

    // 3. Sanitize folder path to prevent path traversal
    const folder = /^[a-zA-Z0-9_-]{1,40}$/.test(rawFolder) ? rawFolder : 'uploads';

    // 4. Sanitize file name
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^/.]+$/, '')
      .substring(0, 60);

    const storagePath = `${folder}/${Date.now()}-${cleanFileName}.${fileExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from('portfolio-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Storage] Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('portfolio-media')
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: storagePath,
      name: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error('[Storage API] Exception:', err);
    return NextResponse.json({ error: err?.message || 'Media upload failed' }, { status: 500 });
  }
}
