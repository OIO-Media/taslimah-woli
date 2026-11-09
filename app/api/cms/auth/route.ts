import { NextRequest, NextResponse } from 'next/server';
import {
  REGISTERED_USERS,
  checkRateLimit,
  recordFailedAttempt,
  resetLoginAttempts,
  createSession,
  verifySessionToken,
} from '@/lib/cms-auth';
import {
  verifyUserCredentialsFromDB,
  resetUserPasswordInDB,
  checkUserExistsInDB,
  canRequestNewOtp,
  savePasswordResetOtp,
  verifyPasswordResetOtp,
  clearPasswordResetOtp,
} from '@/lib/db';
import { sendOtpEmail, isEmailConfigured, generateSecureOtp } from '@/lib/email-service';

function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length <= 2 ? name : `${name.slice(0, 2)}***${name.slice(-1)}`;
  return `${maskedName}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, password, token, route, recoveryKey, newPassword, otp, email } = body;

    // Verify existing token
    if (action === 'verify') {
      if (!token || !verifySessionToken(token)) {
        return NextResponse.json({ valid: false, error: 'Invalid or expired session' }, { status: 401 });
      }
      return NextResponse.json({ valid: true });
    }

    // Send OTP to email
    if (action === 'send-otp') {
      const identifier = (username || email || '').trim();
      if (!identifier) {
        return NextResponse.json({ error: 'Please enter your registered username or email.' }, { status: 400 });
      }

      const rateCheck = checkRateLimit(identifier.toLowerCase());
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: `Too many attempts. Account locked for ${rateCheck.remainingLockoutSeconds} seconds.` },
          { status: 429 }
        );
      }

      const userLookup = await checkUserExistsInDB(identifier);
      if (!userLookup.exists || !userLookup.email) {
        return NextResponse.json(
          { error: 'No studio account was found matching that username or email address.' },
          { status: 404 }
        );
      }

      // Check 60-second resend cooldown
      const cooldownCheck = await canRequestNewOtp(userLookup.email);
      if (!cooldownCheck.allowed) {
        return NextResponse.json(
          {
            error: `Please wait ${cooldownCheck.remainingCooldownSeconds} seconds before requesting another code.`,
          },
          { status: 429 }
        );
      }

      if (!isEmailConfigured()) {
        return NextResponse.json(
          {
            error:
              'Gmail SMTP is not yet configured on the server. Please set SMTP_USER and SMTP_PASS in your Vercel settings, or use the Studio Recovery Key below.',
            unconfigured: true,
          },
          { status: 503 }
        );
      }

      // Generate cryptographically secure CSPRNG 6-digit OTP (different & random every single time)
      const generatedOtp = generateSecureOtp();
      await savePasswordResetOtp(userLookup.email, generatedOtp, 10);

      const emailResult = await sendOtpEmail(userLookup.email, generatedOtp);
      if (!emailResult.success) {
        return NextResponse.json(
          { error: `Failed to dispatch email: ${emailResult.error}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        email: userLookup.email,
        maskedEmail: maskEmail(userLookup.email),
        message: `A 6-digit verification code has been sent to ${maskEmail(userLookup.email)}.`,
      });
    }

    // Verify OTP and reset password
    if (action === 'verify-otp-reset') {
      const targetEmail = (email || username || '').trim();
      if (!targetEmail || !otp || !newPassword) {
        return NextResponse.json(
          { error: 'Email/Username, OTP code, and new password are required.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      const rateCheck = checkRateLimit(targetEmail.toLowerCase());
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: `Too many attempts. Account locked for ${rateCheck.remainingLockoutSeconds} seconds.` },
          { status: 429 }
        );
      }

      const userLookup = await checkUserExistsInDB(targetEmail);
      if (!userLookup.exists || !userLookup.email) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
      }

      const otpResult = await verifyPasswordResetOtp(userLookup.email, otp);
      if (!otpResult.valid) {
        recordFailedAttempt(targetEmail.toLowerCase());
        return NextResponse.json({ error: otpResult.error || 'Invalid or expired OTP code.' }, { status: 400 });
      }

      const resetResult = await resetUserPasswordInDB(userLookup.email, newPassword);
      if (!resetResult.success) {
        return NextResponse.json(
          { error: resetResult.error || 'Failed to update password in database.' },
          { status: 500 }
        );
      }

      await clearPasswordResetOtp(userLookup.email);
      resetLoginAttempts(targetEmail.toLowerCase());

      return NextResponse.json({
        success: true,
        message: 'Password successfully updated! You can now log in with your new password.',
      });
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
