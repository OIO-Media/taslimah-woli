import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CMS_DATA } from '@/lib/cms-defaults';
import { verifySessionToken } from '@/lib/cms-auth';
import {
  getPublishedContentFromDB,
  getDraftContentFromDB,
  saveDraftToDB,
  publishContentToDB,
} from '@/lib/db';

// In-memory content cache for dev/fallback runtime
let cachedContent = INITIAL_CMS_DATA;
let cachedDraft = INITIAL_CMS_DATA;

export const dynamic = 'force-static';

export async function GET(req: NextRequest) {
  try {
    const url = req?.url ? new URL(req.url) : null;
    const type = url?.searchParams?.get('type') || 'published';

    if (type === 'draft') {
      const authHeader = req.headers?.get('authorization') || '';
      const token = authHeader.replace('Bearer ', '');
      if (!verifySessionToken(token)) {
        return NextResponse.json({ error: 'Unauthorized to view drafts' }, { status: 401 });
      }
      const dbDraft = await getDraftContentFromDB();
      return NextResponse.json({ content: dbDraft || cachedDraft });
    }

    // Publicly available published content
    const dbPublished = await getPublishedContentFromDB();
    return NextResponse.json({ content: dbPublished || cachedContent });
  } catch {
    return NextResponse.json({ content: cachedContent });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!verifySessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized to update content' }, { status: 401 });
    }

    const body = await req.json();
    const { action, data } = body;

    if (action === 'save_draft') {
      cachedDraft = {
        ...cachedDraft,
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      await saveDraftToDB(cachedDraft);
      return NextResponse.json({ success: true, draft: cachedDraft });
    }

    if (action === 'publish') {
      const now = new Date().toISOString();
      cachedContent = {
        ...(data || cachedDraft),
        lastUpdated: now,
      };
      cachedDraft = cachedContent;
      await publishContentToDB(cachedContent);
      return NextResponse.json({ success: true, published: cachedContent });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Content API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
