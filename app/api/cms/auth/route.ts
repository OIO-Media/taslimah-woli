import { NextRequest, NextResponse } from 'next/server';
import {
  REGISTERED_USERS,
  checkRateLimit,
  recordFailedAttempt,
  resetLoginAttempts,
  createSession,
  verifySessionToken,
} from '@/lib/cms-auth';
import { verifyUserCredentialsFromDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, password, token, route } = body;

    // Verify existing token
    if (action === 'verify') {
      if (!token || !verifySessionToken(token)) {
        return NextResponse.json({ valid: false, error: 'Invalid or expired session' }, { status: 401 });
      }
      return NextResponse.json({ valid: true });
    }

    // Login action
    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 });
      }

      // Check rate limiting
      const rateCheck = checkRateLimit(username.toLowerCase());
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: `Too many failed attempts. Account locked for ${rateCheck.remainingLockoutSeconds} seconds.`,
          },
          { status: 429 }
        );
      }

      const inputUser = username.trim().toLowerCase();

      // 1. Try Database authentication first if Supabase is configured
      const dbAuth = await verifyUserCredentialsFromDB(username, password);
      if (dbAuth.success && dbAuth.user) {
        resetLoginAttempts(username.toLowerCase());
        const session = createSession(dbAuth.user);
        return NextResponse.json({ success: true, session });
      }

      // 2. Secure environment-driven emergency fallback (only active if explicitly configured in environment)
      const emergencyPassword = process.env.CMS_EMERGENCY_ADMIN_PASSWORD;
      if (
        emergencyPassword &&
        password === emergencyPassword &&
        (inputUser === REGISTERED_USERS.owner.email.toLowerCase() ||
          inputUser === REGISTERED_USERS.owner.username.toLowerCase())
      ) {
        resetLoginAttempts(username.toLowerCase());
        const session = createSession(REGISTERED_USERS.owner);
        return NextResponse.json({ success: true, session });
      }

      // Record failed attempt
      recordFailedAttempt(username.toLowerCase());
      return NextResponse.json({ error: 'Invalid credentials. Please verify your details.' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Auth API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
