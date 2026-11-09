import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          status: 'unconfigured',
          message: 'Supabase admin client not initialized (missing environment variables)',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Actively query Supabase PostgreSQL to refresh the 7-day inactivity timer
    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Supabase PostgreSQL pinged successfully — inactivity timer refreshed',
        recordsFound: data?.length ?? 0,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: err?.message || 'Keepalive ping failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
