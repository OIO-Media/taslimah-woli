'use client';

import React, { useCallback } from 'react';
import { useCMSAuth } from '@/lib/cms-client';
import { CMSLoginView } from '@/components/cms/CMSLoginView';
import { CMSDashboard } from '@/components/cms/CMSDashboard';

export default function AdminPage() {
  const { session, isAuthenticated, loading, logout, refreshSession } = useCMSAuth('owner');

  const handleLoginSuccess = useCallback(() => {
    // Re-read stored session so the parent re-renders into the dashboard
    refreshSession();
  }, [refreshSession]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeefef] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#18191b] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif-luxury text-xs tracking-widest uppercase text-[#18191b]">
            Verifying Studio Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <CMSLoginView
        title="Taslimah Woli Studio CMS"
        subtitle="Sign in to edit portfolio bodies of work, journals, prints catalog, and site copy."
        roleHint="owner"
        defaultUsername="taslimah@taslimahwoli.com"
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return <CMSDashboard session={session} onLogout={logout} isDeveloperPortal={false} />;
}
