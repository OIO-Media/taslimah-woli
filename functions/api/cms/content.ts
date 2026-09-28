// Cloudflare Pages Function for Edge Content Store

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'published';

  // If KV is bound to the Pages environment, read from it
  if (env?.CMS_KV) {
    try {
      const data = await env.CMS_KV.get(type === 'draft' ? 'cms_draft' : 'cms_published', { type: 'json' });
      if (data) {
        return new Response(JSON.stringify({ content: data }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (e) {
      console.error('KV read error:', e);
    }
  }

  return new Response(JSON.stringify({ content: null, message: 'Using initial bundle' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body: any = await request.json();
    const { action, data } = body;

    if (env?.CMS_KV) {
      if (action === 'save_draft') {
        await env.CMS_KV.put('cms_draft', JSON.stringify(data));
        return new Response(JSON.stringify({ success: true, draft: data }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (action === 'publish') {
        await env.CMS_KV.put('cms_published', JSON.stringify(data));
        await env.CMS_KV.put('cms_draft', JSON.stringify(data));
        return new Response(JSON.stringify({ success: true, published: data }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Default edge success echo
    return new Response(JSON.stringify({ success: true, edgeSaved: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
