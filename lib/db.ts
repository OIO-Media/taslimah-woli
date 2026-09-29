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
