export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const body: any = await request.json();
    const { action, username, password, token } = body;

    // Fixed credentials matching production requirements
    const OWNER_EMAIL = 'taslimah@taslimahwoli.com';
    const OWNER_PASS = 'TaslimahWoli2026!Studio';
    const DEV_USER = 'ohayo';
    const DEV_PASS = 'OhayoDeveloper2026!DevAccess';

    if (action === 'verify') {
      if (!token || typeof token !== 'string') {
        return new Response(JSON.stringify({ valid: false }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ valid: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'login') {
      const inputUser = (username || '').trim().toLowerCase();

      // Owner check
      if ((inputUser === OWNER_EMAIL || inputUser === 'taslimah') && password === OWNER_PASS) {
        const session = {
          user: {
            id: 'user-taslimah',
            username: 'taslimah',
            email: OWNER_EMAIL,
            role: 'owner',
            name: 'Taslimah Woli',
          },
          token: `owner_taslimah_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        return new Response(JSON.stringify({ success: true, session }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Developer check
      if (inputUser === DEV_USER && password === DEV_PASS) {
        const session = {
          user: {
            id: 'user-ohayo',
            username: 'Ohayo',
            email: 'dev@ohayo.internal',
            role: 'developer',
            name: 'Ohayo (Developer Maintenance)',
          },
          token: `dev_ohayo_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        return new Response(JSON.stringify({ success: true, session }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
