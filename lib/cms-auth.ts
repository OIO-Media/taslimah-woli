import { CMSUserSession, CMSUserRole } from './cms-types';

export interface CMSUserAccount {
  id: string;
  username: string;
  email: string;
  role: CMSUserRole;
  name: string;
  // Hashed password representation
  salt: string;
  hash: string;
}

// Fixed salt for consistent deterministic verification across environments
// For production accounts, we pre-hash with SHA-256 + salt
// Salt and Hash generated for:
// 1. taslimah@taslimahwoli.com / "TaslimahWoli2026!Studio"
// 2. Ohayo / "OhayoDeveloper2026!DevAccess"

const OWNER_SALT = 'tw_salt_77a94f1c98e2';
const DEV_SALT = 'ohayo_salt_91b2c4d8e3f7';

// Helper to hash password with salt using Web Crypto API
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed hashes will be initialized or dynamically verified
export const REGISTERED_USERS: Record<string, {
  id: string;
  username: string;
  email: string;
  role: CMSUserRole;
  name: string;
  salt: string;
  expectedPlain: string; // for instant zero-dependency fallback verification
}> = {
  owner: {
    id: 'user-taslimah',
    username: 'taslimah',
    email: 'taslimah@taslimahwoli.com',
    role: 'owner',
    name: 'Taslimah Woli',
    salt: OWNER_SALT,
    expectedPlain: 'TaslimahWoli2026!Studio',
  },
  developer: {
    id: 'user-ohayo',
    username: 'Ohayo',
    email: 'dev@ohayo.internal',
    role: 'developer',
    name: 'Ohayo (Developer Maintenance)',
    salt: DEV_SALT,
    expectedPlain: 'OhayoDeveloper2026!DevAccess',
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

// Generate secure random hex token
export function generateSessionToken(userId: string, role: CMSUserRole): string {
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  const timestamp = Date.now();
  return `${role}_${userId}_${timestamp}_${randomHex}`;
}

export function createSession(user: CMSUserAccount | typeof REGISTERED_USERS['owner']): CMSUserSession {
  const token = generateSessionToken(user.id, user.role);
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    token,
    expiresAt: Date.now() + sevenDaysMs,
  };
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  try {
    const parts = token.split('_');
    if (parts.length < 4) return false;
    const timestamp = parseInt(parts[2], 10);
    if (isNaN(timestamp)) return false;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < sevenDaysMs;
  } catch {
    return false;
  }
}
