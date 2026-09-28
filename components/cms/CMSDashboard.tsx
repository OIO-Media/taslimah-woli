'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCMS } from '@/lib/cms-store';
import { CMSUserSession } from '@/lib/cms-types';
import { HomeEditor } from './HomeEditor';
import { StoriesEditor } from './StoriesEditor';
import { AssignmentsEditor } from './AssignmentsEditor';
import { AboutEditor } from './AboutEditor';
import { JournalsEditor } from './JournalsEditor';
import { PrintsEditor } from './PrintsEditor';
import { ContactEditor } from './ContactEditor';
import { SettingsEditor } from './SettingsEditor';
import { ConfirmModal } from './ConfirmModal';
import {
  Home,
  BookOpen,
  Briefcase,
  User,
  ShoppingBag,
  Mail,
  Sliders,
  ExternalLink,
  Send,
  RotateCcw,
  LogOut,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

export type CMSTab =
  | 'home'
  | 'stories'
  | 'assignments'
  | 'about'
  | 'journals'
  | 'prints'
  | 'contact'
  | 'settings';

interface CMSDashboardProps {
  session: CMSUserSession;
  onLogout: () => void;
  isDeveloperPortal?: boolean;
}

export const CMSDashboard: React.FC<CMSDashboardProps> = ({
  session,
  onLogout,
  isDeveloperPortal = false,
}) => {
  const {
    isReady,
    draft,
    hasUnpublishedChanges,
    lastSavedAt,
    lastPublishedAt,
    saveDraft,
    publishDraft,
    discardDraft,
    resetAllToFactoryDefaults,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<CMSTab>('home');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handlePublish = () => {
    publishDraft();
    setShowPublishModal(false);
    showToast('✨ All changes are now live on the public site!');
  };

  const handleDiscard = () => {
    discardDraft();
    setShowDiscardModal(false);
    showToast('Unpublished draft changes discarded. Restored live site version.');
  };

  const handleResetFactory = () => {
    resetAllToFactoryDefaults();
    setShowResetModal(false);
    showToast('Restored all factory brand content defaults.');
  };

  const navItems: { id: CMSTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home & Carousel', icon: Home },
    { id: 'stories', label: 'Stories / Work', icon: Layers },
    { id: 'assignments', label: 'Assignments', icon: Briefcase },
    { id: 'about', label: 'About & Bio', icon: User },
    { id: 'journals', label: 'Journals & Writing', icon: BookOpen },
    { id: 'prints', label: 'Prints Catalog', icon: ShoppingBag },
    { id: 'contact', label: 'Contact Desks', icon: Mail },
    { id: 'settings', label: 'Site & SEO', icon: Sliders },
  ];

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#eeefef] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#18191b] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif-luxury text-sm tracking-widest uppercase text-[#18191b]">
            Opening Studio CMS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col selection:bg-[#18191b] selection:text-[#eeefef]">
      {/* TOP NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[250] bg-[#18191b] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 font-sans-clean text-xs font-medium animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP STUDIO NAVIGATION BAR */}
      <header className="sticky top-0 z-[100] bg-[#eeefef]/95 backdrop-blur-md border-b border-[#caccca] px-6 sm:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand wordmark left */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-serif-luxury text-sm sm:text-base tracking-[0.24em] font-light uppercase text-[#18191b]">
              TASLIMAH WOLI
            </span>
            <span className="font-sans-clean text-[10px] tracking-wider uppercase text-[#8c8e90]">
              {isDeveloperPortal ? 'Developer Maintenance Console' : 'Content Management Studio'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#caccca]">
            {hasUnpublishedChanges ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-sans-clean font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                Unpublished Draft Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-[10px] font-sans-clean font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                All Changes Live
              </span>
            )}

            <span className="text-[10px] font-sans-clean text-[#8c8e90] pl-1">
              Autosaved
            </span>
          </div>
        </div>

        {/* Action Controls right */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 rounded-lg border border-[#caccca] bg-white hover:bg-[#e4e5e5] text-xs font-sans-clean font-medium text-[#18191b] transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8c8e90]" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>

          {hasUnpublishedChanges && (
            <button
              type="button"
              onClick={() => setShowDiscardModal(true)}
              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-sans-clean font-medium text-red-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discard Draft</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans-clean font-medium tracking-wide uppercase transition-all flex items-center gap-2 shadow-xs ${
              hasUnpublishedChanges
                ? 'bg-[#18191b] hover:bg-[#3e4143] text-white ring-2 ring-[#18191b]/20 ring-offset-1'
                : 'bg-[#18191b]/80 hover:bg-[#18191b] text-white'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>Publish Live</span>
          </button>

          <div className="h-6 w-[1px] bg-[#caccca] mx-1" />

          {/* User Signout */}
          <button
            type="button"
            onClick={onLogout}
            title={`Signed in as ${session.user.name}. Click to log out.`}
            className="p-1.5 rounded-lg border border-[#caccca] hover:bg-white text-[#8c8e90] hover:text-[#18191b] transition-colors flex items-center gap-1 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline font-sans-clean text-[11px] text-[#3e4143]">
              Exit
            </span>
          </button>
        </div>
      </header>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <nav className="bg-[#eeefef] border-b border-[#caccca] px-6 sm:px-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 py-2 max-w-7xl mx-auto w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-sans-clean font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#18191b] text-white shadow-xs'
                    : 'text-[#3e4143] hover:text-[#18191b] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8c8e90]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT AREA FOR ACTIVE TAB */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
        {activeTab === 'home' && (
          <HomeEditor
            hero={draft.homeHero}
            bodiesOfWork={draft.bodiesOfWork}
            stories={draft.stories}
            assignments={draft.assignments}
            onHeroChange={(homeHero) => saveDraft({ homeHero })}
            onBodiesOfWorkChange={(bodiesOfWork) => saveDraft({ bodiesOfWork })}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesEditor
            stories={draft.stories}
            onChange={(stories) => saveDraft({ stories })}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsEditor
            assignments={draft.assignments}
            onChange={(assignments) => saveDraft({ assignments })}
          />
        )}

        {activeTab === 'about' && (
          <AboutEditor
            about={draft.about}
            onChange={(about) => saveDraft({ about })}
          />
        )}

        {activeTab === 'journals' && (
          <JournalsEditor
            journals={draft.journals}
            onChange={(journals) => saveDraft({ journals })}
          />
        )}

        {activeTab === 'prints' && (
          <PrintsEditor
            prints={draft.prints}
            onChange={(prints) => saveDraft({ prints })}
          />
        )}

        {activeTab === 'contact' && (
          <ContactEditor
            availabilityBanner={draft.siteWide.availabilityBanner}
            desks={draft.contactDesks}
            onBannerChange={(availabilityBanner) =>
              saveDraft({
                siteWide: { ...draft.siteWide, availabilityBanner },
              })
            }
            onDesksChange={(contactDesks) => saveDraft({ contactDesks })}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsEditor
            settings={draft.siteWide}
            onChange={(siteWide) => saveDraft({ siteWide })}
            onResetDefaults={() => setShowResetModal(true)}
          />
        )}
      </main>

      {/* PUBLISH CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={showPublishModal}
        title="Publish Changes to Live Site"
        message="Are you ready to publish all your current draft changes to the public website? Visitors worldwide will immediately see the updated content."
        confirmLabel="Publish to Live Site"
        cancelLabel="Keep in Draft"
        isDestructive={false}
        onConfirm={handlePublish}
        onCancel={() => setShowPublishModal(false)}
      />

      {/* DISCARD DRAFT MODAL */}
      <ConfirmModal
        isOpen={showDiscardModal}
        title="Discard Unpublished Draft Changes"
        message="Are you sure you want to discard all pending draft changes? Your draft will be reverted to match what is currently live on the site."
        confirmLabel="Discard Draft"
        onConfirm={handleDiscard}
        onCancel={() => setShowDiscardModal(false)}
      />

      {/* FACTORY RESET MODAL */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Restore Factory Brand Defaults"
        message="This will reset all site text, bodies of work, credibility items, and catalog prints back to the original brand defaults. Are you sure?"
        confirmLabel="Reset Everything"
        onConfirm={handleResetFactory}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
