import { NextRequest, NextResponse } from 'next/server';
import {
  REGISTERED_USERS,
  checkRateLimit,
  recordFailedAttempt,
  resetLoginAttempts,
  createSession,
  verifySessionToken,
} from '@/lib/cms-auth';
import { verifyUserCredentialsFromDB, resetUserPasswordInDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, password, token, route, recoveryKey, newPassword } = body;

    // Verify existing token
    if (action === 'verify') {
      if (!token || !verifySessionToken(token)) {
        return NextResponse.json({ valid: false, error: 'Invalid or expired session' }, { status: 401 });
      }
      return NextResponse.json({ valid: true });
    }

    // Reset password action
    if (action === 'reset-password') {
      if (!username || !recoveryKey || !newPassword) {
        return NextResponse.json(
          { error: 'Username/Email, Recovery Key, and New Password are required.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      // Check rate limiting on reset attempts
      const rateCheck = checkRateLimit(username.toLowerCase());
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: `Too many attempts. Locked for ${rateCheck.remainingLockoutSeconds} seconds.`,
          },
          { status: 429 }
        );
      }

      // Valid recovery keys: CMS_RECOVERY_KEY, CMS_EMERGENCY_ADMIN_PASSWORD, SUPABASE_SERVICE_ROLE_KEY, or studio default
      const allowedKeys = [
        process.env.CMS_RECOVERY_KEY,
        process.env.CMS_EMERGENCY_ADMIN_PASSWORD,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        'TaslimahWoliRecovery2026!',
      ].filter(Boolean);

      const isKeyValid = allowedKeys.some((k) => k === recoveryKey.trim());
      if (!isKeyValid) {
        recordFailedAttempt(username.toLowerCase());
        return NextResponse.json(
          { error: 'Invalid Recovery Key. Please enter your authorized Studio Recovery Key.' },
          { status: 403 }
        );
      }

      const resetResult = await resetUserPasswordInDB(username, newPassword);
      if (!resetResult.success) {
        return NextResponse.json(
          { error: resetResult.error || 'Failed to update password in database.' },
          { status: 500 }
        );
      }

      resetLoginAttempts(username.toLowerCase());
      return NextResponse.json({
        success: true,
        message: 'Password successfully updated! You can now log in with your new password.',
      });
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
