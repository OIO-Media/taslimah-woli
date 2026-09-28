'use client';

import React, { useCallback } from 'react';
import { useCMSAuth } from '@/lib/cms-client';
import { CMSLoginView } from '@/components/cms/CMSLoginView';
import { CMSDashboard } from '@/components/cms/CMSDashboard';

export default function DeveloperAccessPage() {
  const { session, isAuthenticated, loading, logout, refreshSession } = useCMSAuth('developer');

  const handleLoginSuccess = useCallback(() => {
    refreshSession();
  }, [refreshSession]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18191b] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs tracking-widest text-[#8c8e90]">
            INITIALIZING DEV ENVIRONMENT...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <CMSLoginView
        title="Developer Maintenance Console"
        subtitle="Unlisted developer maintenance portal. Authentication required for system-level controls."
        roleHint="developer"
        defaultUsername="Ohayo"
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return <CMSDashboard session={session} onLogout={logout} isDeveloperPortal={true} />;
}
