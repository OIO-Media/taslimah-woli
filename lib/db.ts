import { supabaseAdmin } from './supabase-admin';
import { FullCMSData } from './cms-types';
import { INITIAL_CMS_DATA } from './cms-defaults';
import bcrypt from 'bcryptjs';

export interface CMSContentRecord {
  id: 'published' | 'draft';
  data: FullCMSData;
  updated_at: string;
}

/**
 * Fetch published site content from Supabase PostgreSQL.
 * Falls back to INITIAL_CMS_DATA if Supabase is not configured or table is empty.
 */
export async function getPublishedContentFromDB(): Promise<FullCMSData> {
  if (!supabaseAdmin) {
    return INITIAL_CMS_DATA;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .select('data')
      .eq('id', 'published')
      .single();

    if (error || !data?.data) {
      return INITIAL_CMS_DATA;
    }

    return data.data as FullCMSData;
  } catch (err) {
    console.error('[DB] Error fetching published content:', err);
    return INITIAL_CMS_DATA;
  }
}

/**
 * Fetch draft site content for /admin from Supabase.
 */
export async function getDraftContentFromDB(): Promise<FullCMSData> {
  if (!supabaseAdmin) {
    return INITIAL_CMS_DATA;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .select('data')
      .eq('id', 'draft')
      .single();

    if (error || !data?.data) {
      return INITIAL_CMS_DATA;
    }

    return data.data as FullCMSData;
  } catch (err) {
    console.error('[DB] Error fetching draft content:', err);
    return INITIAL_CMS_DATA;
  }
}

/**
 * Save draft content to Supabase PostgreSQL.
 */
export async function saveDraftToDB(draftData: FullCMSData): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    const { error } = await supabaseAdmin
      .from('cms_content')
      .upsert({
        id: 'draft',
        data: draftData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[DB] Failed to save draft:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[DB] Error saving draft:', err);
    return false;
  }
}

/**
 * Publish draft content to live site in Supabase PostgreSQL.
 */
export async function publishContentToDB(publishedData: FullCMSData): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    const now = new Date().toISOString();
    const payload = {
      ...publishedData,
      lastUpdated: now,
    };

    // Upsert published record
    const { error: pubError } = await supabaseAdmin
      .from('cms_content')
      .upsert({
        id: 'published',
        data: payload,
        updated_at: now,
      });

    if (pubError) {
      console.error('[DB] Failed to update published record:', pubError);
      return false;
    }

    // Keep draft in sync with newly published state
    await supabaseAdmin
      .from('cms_content')
      .upsert({
        id: 'draft',
        data: payload,
        updated_at: now,
      });

    return true;
  } catch (err) {
    console.error('[DB] Error publishing content:', err);
    return false;
  }
}

/**
 * Verify CMS user against database with bcrypt password check.
 */
export async function verifyUserCredentialsFromDB(
  usernameOrEmail: string,
  plainPassword: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database unconfigured' };
  }

  try {
    const clean = usernameOrEmail.trim().toLowerCase();

    // Strict validation to prevent PostgREST syntax and filter injection
    if (!/^[a-zA-Z0-9@._+-]{1,100}$/.test(clean)) {
      return { success: false, error: 'Invalid username or email format' };
    }

    const { data: user, error } = await supabaseAdmin
      .from('cms_users')
      .select('*')
      .or(`email.ilike.${clean},username.ilike.${clean}`)
      .single();

    if (error || !user) {
      return { success: false, error: 'User not found' };
    }

    const isValid = await bcrypt.compare(plainPassword, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid password' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  } catch (err: any) {
    console.error('[DB] Auth verification error:', err);
    return { success: false, error: err?.message || 'Database auth error' };
  }
}

/**
 * Reset a user's password in the database with a freshly salted bcrypt hash.
 */
export async function resetUserPasswordInDB(
  usernameOrEmail: string,
  newPlainPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database unconfigured' };
  }

  try {
    const clean = usernameOrEmail.trim().toLowerCase();
    if (!/^[a-zA-Z0-9@._+-]{1,100}$/.test(clean)) {
      return { success: false, error: 'Invalid username or email format' };
    }

    const { data: user, error: findError } = await supabaseAdmin
      .from('cms_users')
      .select('id, username')
      .or(`email.ilike.${clean},username.ilike.${clean}`)
      .single();

    if (findError || !user) {
      return { success: false, error: 'Account not found in database' };
    }

    const newHash = await bcrypt.hash(newPlainPassword, 10);

    const { error: updateError } = await supabaseAdmin
      .from('cms_users')
      .update({ password_hash: newHash })
      .eq('id', user.id);

    if (updateError) {
      console.error('[DB] Failed to update password hash:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[DB] Reset password error:', err);
    return { success: false, error: err?.message || 'Database error while resetting password' };
  }
}

// In-memory fallback for serverless runtime resilience
const memoryOtpStore = new Map<string, { otpHash: string; expiresAt: number }>();

/**
 * Check if an email or username exists in the system.
 */
export async function checkUserExistsInDB(
  emailOrUsername: string
): Promise<{ exists: boolean; email?: string; username?: string }> {
  const clean = emailOrUsername.trim().toLowerCase();

  if (supabaseAdmin) {
    try {
      const { data: user } = await supabaseAdmin
        .from('cms_users')
        .select('email, username')
        .or(`email.ilike.${clean},username.ilike.${clean}`)
        .single();

      if (user) {
        return { exists: true, email: user.email, username: user.username };
      }
    } catch (err) {
      console.warn('[DB] Could not query cms_users, checking fallback:', err);
    }
  }

  // Fallback check against REGISTERED_USERS
  const fallbackUsers = [
    { email: 'taslimah@taslimahwoli.com', username: 'taslimah' },
    { email: 'dev@ohayo.internal', username: 'ohayo' },
  ];

  const matched = fallbackUsers.find(
    (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
  );

  if (matched) {
    return { exists: true, email: matched.email, username: matched.username };
  }

  return { exists: false };
}

/**
 * Store an OTP with an expiration timestamp.
 */
export async function savePasswordResetOtp(
  email: string,
  plainOtp: string,
  expiresInMinutes = 10
): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const otpHash = await bcrypt.hash(plainOtp, 8);

  // Store in memory cache
  memoryOtpStore.set(clean, { otpHash, expiresAt });

  if (!supabaseAdmin) return true;

  try {
    const { error } = await supabaseAdmin
      .from('cms_content')
      .upsert({
        id: `otp_${clean}`,
        data: { otpHash, expiresAt, email: clean },
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('[DB] Warning saving OTP to database, memory fallback active:', error.message);
    }
    return true;
  } catch (err) {
    console.warn('[DB] OTP database save failed, memory fallback active:', err);
    return true;
  }
}

/**
 * Verify an OTP code against database or memory store.
 */
export async function verifyPasswordResetOtp(
  email: string,
  plainOtp: string
): Promise<{ valid: boolean; error?: string }> {
  const clean = email.trim().toLowerCase();
  let storedRecord: { otpHash: string; expiresAt: number } | null = null;

  // 1. Try fetching from Supabase
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('cms_content')
        .select('data')
        .eq('id', `otp_${clean}`)
        .single();

      if (data?.data?.otpHash && data?.data?.expiresAt) {
        storedRecord = {
          otpHash: data.data.otpHash,
          expiresAt: Number(data.data.expiresAt),
        };
      }
    } catch {}
  }

  // 2. Fall back to memory store if database didn't have it
  if (!storedRecord) {
    storedRecord = memoryOtpStore.get(clean) || null;
  }

  if (!storedRecord) {
    return { valid: false, error: 'No active OTP request found. Please request a new code.' };
  }

  if (Date.now() > storedRecord.expiresAt) {
    memoryOtpStore.delete(clean);
    return { valid: false, error: 'This code has expired. Please request a new code.' };
  }

  const isMatch = await bcrypt.compare(plainOtp.trim(), storedRecord.otpHash);
  if (!isMatch) {
    return { valid: false, error: 'Invalid verification code. Please check your email and try again.' };
  }

  return { valid: true };
}

/**
 * Clear an OTP after successful password reset.
 */
export async function clearPasswordResetOtp(email: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  memoryOtpStore.delete(clean);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('cms_content').delete().eq('id', `otp_${clean}`);
    } catch {}
  }
}
