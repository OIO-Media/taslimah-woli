import crypto from 'crypto';
import { CMSUserSession, CMSUserRole } from './cms-types';

export interface CMSUserAccount {
  id: string;
  username: string;
  email: string;
  role: CMSUserRole;
  name: string;
}

const AUTH_SECRET =
  process.env.CMS_AUTH_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'taslimah-woli-studio-secure-auth-secret-key-2026';

// Session lifetime: 2 hours for enhanced administrative security
export const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000;

export const REGISTERED_USERS: Record<string, CMSUserAccount> = {
  owner: {
    id: 'user-taslimah',
    username: 'taslimah',
    email: 'taslimah@taslimahwoli.com',
    role: 'owner',
    name: 'Taslimah Woli',
  },
  developer: {
    id: 'user-ohayo',
    username: 'Ohayo',
    email: 'dev@ohayo.internal',
    role: 'developer',
    name: 'Ohayo (Developer Maintenance)',
  },
};

// In-memory rate limiting map
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

export function checkRateLimit(identifier: string): { allowed: boolean; remainingLockoutSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  if (!record) return { allowed: true };

  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, remainingLockoutSeconds: remainingSeconds };
  }

  if (record.lockUntil <= now && record.count >= 5) {
    // Lockout expired, reset
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { count: 0, lockUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    // 5 minutes lockout
    record.lockUntil = now + 5 * 60 * 1000;
  }
  loginAttempts.set(identifier, record);
}

export function resetLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

// Generate cryptographically signed HMAC-SHA256 session token
export function generateSessionToken(userId: string, role: CMSUserRole): string {
  const timestamp = Date.now().toString();
  const randomHex = crypto.randomBytes(16).toString('hex');
  const payload = `${role}_${userId}_${timestamp}_${randomHex}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function createSession(user: CMSUserAccount): CMSUserSession {
  const token = generateSessionToken(user.id, user.role);
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    token,
    expiresAt: Date.now() + SESSION_EXPIRY_MS,
  };
}

export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const dotIndex = token.lastIndexOf('.');
    if (dotIndex === -1) return false;

    const payload = token.substring(0, dotIndex);
    const signature = token.substring(dotIndex + 1);

    const parts = payload.split('_');
    if (parts.length < 4) return false;

    const timestamp = parseInt(parts[2], 10);
    if (isNaN(timestamp)) return false;

    // Reject tokens older than 2 hours or timestamp in the future (>60s skew)
    const now = Date.now();
    if (now - timestamp > SESSION_EXPIRY_MS || timestamp > now + 60000) {
      return false;
    }

    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    // Constant-time comparison to prevent timing side-channel attacks
    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    if (sigBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
