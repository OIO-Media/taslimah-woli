'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCMSAuth } from '@/lib/cms-client';
import { CMSUserRole } from '@/lib/cms-types';

interface CMSLoginViewProps {
  title?: string;
  subtitle?: string;
  roleHint?: CMSUserRole;
  defaultUsername?: string;
  onSuccess?: () => void;
}

export const CMSLoginView: React.FC<CMSLoginViewProps> = ({
  title = 'Studio Content Management',
  subtitle = 'Sign in to edit portfolio bodies of work, journals, prints, and site copy.',
  roleHint = 'owner',
  defaultUsername = '',
  onSuccess,
}) => {
  const { login } = useCMSAuth(roleHint);
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both your email/username and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(username.trim(), password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please verify your details.');
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col justify-between p-6 sm:p-10 selection:bg-[#18191b] selection:text-[#eeefef]">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans-clean text-xs text-[#8c8e90] hover:text-[#18191b] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to website</span>
        </Link>

        <span className="font-serif-luxury tracking-[0.24em] text-xs uppercase text-[#8c8e90]">
          TASLIMAH WOLI
        </span>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-white border border-[#caccca] rounded-3xl p-8 sm:p-10 shadow-lg animate-in fade-in duration-300">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#f7f8f8] border border-[#caccca] flex items-center justify-center text-[#18191b] mx-auto mb-4">
              <Lock className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#18191b] uppercase tracking-wide">
              {title}
            </h1>
            <p className="font-sans-clean text-xs text-[#8c8e90] leading-relaxed max-w-xs mx-auto">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                {roleHint === 'developer' ? 'Developer Username' : 'Email or Username'}
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={roleHint === 'developer' ? 'Ohayo' : 'taslimah@taslimahwoli.com'}
                className="w-full text-xs px-4 py-3 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full text-xs px-4 py-3 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans-clean">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#18191b] hover:bg-[#3e4143] disabled:opacity-60 text-white font-sans-clean text-xs font-medium tracking-wide uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-sans-clean text-[11px] text-[#8c8e90]">
        &copy; {new Date().getFullYear()} Taslimah Woli Photography &middot; Content Management System
      </footer>
    </div>
  );
};
