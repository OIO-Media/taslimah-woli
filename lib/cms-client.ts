'use client';

import { useState, useEffect, useCallback } from 'react';
import { CMSUserSession, CMSUserRole } from './cms-types';

const SESSION_STORAGE_KEY = 'wolitaslimah_admin_session';

export function getStoredSession(): CMSUserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && session.expiresAt > Date.now()) {
      return session;
    }
    // Expired
    clearStoredSession();
    return null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: CMSUserSession, remember = false) {
  if (typeof window === 'undefined') return;
  try {
    const str = JSON.stringify(session);
    sessionStorage.setItem(SESSION_STORAGE_KEY, str);
    if (remember) {
      localStorage.setItem(SESSION_STORAGE_KEY, str);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to store session:', err);
  }
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}

export function useCMSAuth(requiredRole?: CMSUserRole) {
  const [session, setSession] = useState<CMSUserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const readSession = useCallback(() => {
    const active = getStoredSession();
    if (active) {
      if (!requiredRole || active.user.role === requiredRole || active.user.role === 'developer') {
        setSession(active);
      } else {
        setSession(null);
      }
    } else {
      setSession(null);
    }
  }, [requiredRole]);

  useEffect(() => {
    readSession();
    setLoading(false);
  }, [readSession]);

  const refreshSession = useCallback(() => {
    readSession();
  }, [readSession]);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  // Inactivity auto-logout: Automatically logs out after 30 minutes of idle time
  useEffect(() => {
    if (!session) return;

    const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, handleActivity, { passive: true }));
    handleActivity();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
    };
  }, [session, logout]);

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string; session?: CMSUserSession }> => {
      try {
        const res = await fetch('/api/cms/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', username, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || 'Authentication failed' };
        }

        const userSession: CMSUserSession = data.session;
        setStoredSession(userSession);
        setSession(userSession);
        return { success: true, session: userSession };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Network error during login' };
      }
    },
    []
  );

  return {
    session,
    isAuthenticated: !!session,
    loading,
    login,
    logout,
    refreshSession,
  };
}
