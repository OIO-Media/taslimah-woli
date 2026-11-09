'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
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
  const { login, resetPassword } = useCMSAuth(roleHint);
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password Reset state
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

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

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!username.trim() || !recoveryKey.trim() || !newPassword.trim()) {
      setError('Please fill in your username/email, recovery key, and new password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await resetPassword(username.trim(), recoveryKey.trim(), newPassword);
      if (!res.success) {
        setError(res.error || 'Failed to reset password. Check your recovery key.');
      } else {
        setSuccessMessage(res.message || 'Password successfully updated! You can now log in.');
        setPassword(newPassword);
        setNewPassword('');
        setConfirmPassword('');
        setRecoveryKey('');
        setIsResetMode(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred during password reset');
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

      {/* Main Login / Reset Card */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-white border border-[#caccca] rounded-3xl p-8 sm:p-10 shadow-lg animate-in fade-in duration-300">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#f7f8f8] border border-[#caccca] flex items-center justify-center text-[#18191b] mx-auto mb-4">
              {isResetMode ? (
                <KeyRound className="w-5 h-5 stroke-[1.6]" />
              ) : (
                <Lock className="w-5 h-5 stroke-[1.6]" />
              )}
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#18191b] uppercase tracking-wide">
              {isResetMode ? 'Reset Studio Password' : title}
            </h1>
            <p className="font-sans-clean text-xs text-[#8c8e90] leading-relaxed max-w-xs mx-auto">
              {isResetMode
                ? 'Enter your Studio Recovery Key or Master Passphrase to set a new password.'
                : subtitle}
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-sans-clean">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-snug">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans-clean">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {!isResetMode ? (
            /* Standard Login Form */
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] font-sans-clean text-[#8c8e90] hover:text-[#18191b] transition-colors underline underline-offset-2"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full text-xs px-4 py-3 pr-11 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c8e90] hover:text-[#18191b] p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

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
          ) : (
            /* Password Reset Form */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                  Email or Username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="taslimah@taslimahwoli.com"
                  className="w-full text-xs px-4 py-3 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                  Studio Recovery Key
                </label>
                <div className="relative">
                  <input
                    type={showRecoveryKey ? 'text' : 'password'}
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    placeholder="Enter Master Recovery Key"
                    className="w-full text-xs px-4 py-3 pr-11 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryKey(!showRecoveryKey)}
                    tabIndex={-1}
                    aria-label={showRecoveryKey ? 'Hide key' : 'Show key'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c8e90] hover:text-[#18191b] p-1 transition-colors"
                  >
                    {showRecoveryKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                  New Password (min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full text-xs px-4 py-3 pr-11 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c8e90] hover:text-[#18191b] p-1 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full text-xs px-4 py-3 pr-11 rounded-xl border border-[#caccca] bg-[#fafafa] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c8e90] hover:text-[#18191b] p-1 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#18191b] hover:bg-[#3e4143] disabled:opacity-60 text-white font-sans-clean text-xs font-medium tracking-wide uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password & Save</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError(null);
                }}
                className="w-full text-center text-xs font-sans-clean text-[#8c8e90] hover:text-[#18191b] transition-colors pt-1"
              >
                &larr; Back to Sign In
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-sans-clean text-[11px] text-[#8c8e90]">
        &copy; {new Date().getFullYear()} Taslimah Woli Photography &middot; Content Management System
      </footer>
    </div>
  );
};
