'use client';

import React, { useState } from 'react';
import { SiteWideCMS, PageSEO } from '@/lib/cms-types';
import { Globe, Search, Shield, RefreshCw } from 'lucide-react';

interface SettingsEditorProps {
  settings: SiteWideCMS;
  onChange: (settings: SiteWideCMS) => void;
  onResetDefaults?: () => void;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({
  settings,
  onChange,
  onResetDefaults,
}) => {
  const [activeSeoTab, setActiveSeoTab] = useState<keyof SiteWideCMS['seo']>('home');

  const handleUpdateNav = (key: keyof SiteWideCMS['navLabels'], value: string) => {
    onChange({
      ...settings,
      navLabels: {
        ...settings.navLabels,
        [key]: value,
      },
    });
  };

  const handleUpdateSeo = (page: keyof SiteWideCMS['seo'], field: keyof PageSEO, value: string) => {
    onChange({
      ...settings,
      seo: {
        ...settings.seo,
        [page]: {
          ...settings.seo[page],
          [field]: value,
        },
      },
    });
  };

  const seoPages: { id: keyof SiteWideCMS['seo']; label: string; path: string }[] = [
    { id: 'home', label: 'Homepage', path: '/' },
    { id: 'stories', label: 'Stories / Work', path: '/stories' },
    { id: 'assignments', label: 'Assignments', path: '/assignments' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'journals', label: 'Journals', path: '/journals' },
    { id: 'prints', label: 'Prints Catalog', path: '/prints' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="space-y-12">
      {/* SECTION 1: BRAND IDENTITY & NAVIGATION LABELS */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#caccca] pb-4">
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Brand Identity &amp; Navigation Menu
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Wordmark logo, header navigation menu labels, and footer copyright text.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
              Brand Wordmark
            </label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => onChange({ ...settings, brandName: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
              Brand Tagline / Practice
            </label>
            <input
              type="text"
              value={settings.brandSubtitle}
              onChange={(e) => onChange({ ...settings, brandSubtitle: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
        </div>

        {/* Navigation Labels */}
        <div className="pt-4 border-t border-[#caccca] space-y-4">
          <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b]">
            Header Navigation Menu Labels
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(Object.keys(settings.navLabels) as (keyof SiteWideCMS['navLabels'])[]).map((key) => (
              <div key={key}>
                <span className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-1">
                  /{key}
                </span>
                <input
                  type="text"
                  value={settings.navLabels[key]}
                  onChange={(e) => handleUpdateNav(key, e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-[#caccca] bg-[#fafafa] focus:bg-white text-[#18191b] font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <div className="pt-4 border-t border-[#caccca]">
          <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
            Footer Copyright &amp; Colophon Text
          </label>
          <input
            type="text"
            value={settings.footerText}
            onChange={(e) => onChange({ ...settings, footerText: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
          />
        </div>
      </section>

      {/* SECTION 2: SEO META TITLES & DESCRIPTIONS */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#caccca] pb-4">
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            SEO Meta Tags &amp; Search Visibility
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Customize search engine titles and descriptions for each public page.
          </p>
        </div>

        {/* Tabs for pages */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-[#caccca]">
          {seoPages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setActiveSeoTab(page.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans-clean transition-colors ${
                activeSeoTab === page.id
                  ? 'bg-[#18191b] text-white font-medium'
                  : 'bg-[#fafafa] text-[#3e4143] hover:bg-[#e4e5e5]'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Active SEO page editor */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b]">
                Meta Title Tag ({activeSeoTab})
              </label>
              <span className="text-[11px] font-mono text-[#8c8e90]">
                {settings.seo[activeSeoTab]?.title.length || 0} / 65 chars
              </span>
            </div>
            <input
              type="text"
              value={settings.seo[activeSeoTab]?.title || ''}
              onChange={(e) => handleUpdateSeo(activeSeoTab, 'title', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b]">
                Meta Description Tag
              </label>
              <span className="text-[11px] font-mono text-[#8c8e90]">
                {settings.seo[activeSeoTab]?.description.length || 0} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={settings.seo[activeSeoTab]?.description || ''}
              onChange={(e) => handleUpdateSeo(activeSeoTab, 'description', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b] leading-relaxed"
            />
          </div>

          {/* Search Result Snippet Preview */}
          <div className="p-4 bg-[#f7f8f8] rounded-xl border border-[#caccca] space-y-1">
            <span className="text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] block mb-1">
              Google Search Result Snippet Preview
            </span>
            <p className="text-blue-700 text-sm font-medium hover:underline truncate">
              {settings.seo[activeSeoTab]?.title || 'Taslimah Woli'}
            </p>
            <p className="text-emerald-800 text-[11px] truncate">
              https://taslimah-woli.pages.dev{activeSeoTab === 'home' ? '' : `/${activeSeoTab}`}
            </p>
            <p className="text-[#3e4143] text-xs line-clamp-2">
              {settings.seo[activeSeoTab]?.description || 'Documentary photography and spatial research.'}
            </p>
          </div>
        </div>
      </section>

      {/* System Factory Defaults Reset */}
      {onResetDefaults && (
        <section className="bg-red-50/50 border border-red-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif-luxury text-base text-red-900 uppercase">
              Factory Content Reset
            </h4>
            <p className="font-sans-clean text-xs text-red-700 mt-0.5">
              Reset all site content back to initial verified brand questionnaire defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-sans-clean font-medium transition-colors self-start sm:self-auto"
          >
            Reset to Defaults
          </button>
        </section>
      )}
    </div>
  );
};
