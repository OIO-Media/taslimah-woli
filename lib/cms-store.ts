'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { FullCMSData, CMSState } from './cms-types';
import { INITIAL_CMS_DATA } from './cms-defaults';

const CMS_STORAGE_KEY = 'wolitaslimah_cms_v4_state';
const CMS_EVENT_KEY = 'wolitaslimah:cms-state-change';

const DEFAULT_STATE: CMSState = {
  published: INITIAL_CMS_DATA,
  draft: INITIAL_CMS_DATA,
  hasUnpublishedChanges: false,
  lastPublishedAt: new Date().toISOString(),
  lastSavedAt: new Date().toISOString(),
};

let memoryState: CMSState | null = null;

function upgradeDataIfNeeded(data: FullCMSData): FullCMSData {
  if (!data || !data.journals) return data;
  const upgradedJournals = data.journals.map((j) => {
    const initialMatch = INITIAL_CMS_DATA.journals.find((ij) => ij.id === j.id);
    if (initialMatch && (!j.bodyHtml || (!j.bodyHtml.includes('<h2>') && !j.bodyHtml.includes('<figure')))) {
      return {
        ...j,
        bodyHtml: initialMatch.bodyHtml,
        paragraphs: initialMatch.paragraphs,
      };
    }
    return j;
  });
  return { ...data, journals: upgradedJournals };
}

function loadStoredState(): CMSState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    const published = upgradeDataIfNeeded(parsed.published || INITIAL_CMS_DATA);
    const draft = upgradeDataIfNeeded(parsed.draft || parsed.published || INITIAL_CMS_DATA);
    return {
      published,
      draft,
      hasUnpublishedChanges: !!parsed.hasUnpublishedChanges,
      lastPublishedAt: parsed.lastPublishedAt || new Date().toISOString(),
      lastSavedAt: parsed.lastSavedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to load CMS state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

function persistState(state: CMSState) {
  if (typeof window === 'undefined') return;
  try {
    memoryState = state;
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CMS_EVENT_KEY, { detail: state }));
  } catch (err) {
    console.error('Failed to persist CMS state:', err);
  }
}

function getSnapshot(): CMSState {
  if (!memoryState) {
    memoryState = loadStoredState();
  }
  return memoryState;
}

function getServerSnapshot(): CMSState {
  return DEFAULT_STATE;
}

function subscribe(onStoreChange: () => void) {
  const handler = () => {
    memoryState = null;
    onStoreChange();
  };
  window.addEventListener(CMS_EVENT_KEY, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CMS_EVENT_KEY, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Hook to access and update CMS content
 */
export function useCMS() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update draft (autosave or explicit save)
  const saveDraft = useCallback((updater: Partial<FullCMSData> | ((prev: FullCMSData) => FullCMSData)) => {
    const current = getSnapshot();
    const nextDraft: FullCMSData = typeof updater === 'function'
      ? updater(current.draft)
      : { ...current.draft, ...updater, lastUpdated: new Date().toISOString() };

    const updatedState: CMSState = {
      ...current,
      draft: nextDraft,
      hasUnpublishedChanges: true,
      lastSavedAt: new Date().toISOString(),
    };
    persistState(updatedState);
    return updatedState;
  }, []);

  // Publish draft to live public site
  const publishDraft = useCallback(() => {
    const current = getSnapshot();
    const publishedAt = new Date().toISOString();
    const publishedContent: FullCMSData = {
      ...current.draft,
      lastUpdated: publishedAt,
    };

    const updatedState: CMSState = {
      ...current,
      published: publishedContent,
      draft: publishedContent,
      hasUnpublishedChanges: false,
      lastPublishedAt: publishedAt,
      lastSavedAt: publishedAt,
    };
    persistState(updatedState);
    return updatedState;
  }, []);

  // Discard draft changes and restore published state
  const discardDraft = useCallback(() => {
    const current = getSnapshot();
    const updatedState: CMSState = {
      ...current,
      draft: current.published,
      hasUnpublishedChanges: false,
      lastSavedAt: new Date().toISOString(),
    };
    persistState(updatedState);
    return updatedState;
  }, []);

  // Reset everything to original defaults
  const resetAllToFactoryDefaults = useCallback(() => {
    persistState(DEFAULT_STATE);
    return DEFAULT_STATE;
  }, []);

  return {
    isReady: isClient,
    published: state.published,
    draft: state.draft,
    hasUnpublishedChanges: state.hasUnpublishedChanges,
    lastPublishedAt: state.lastPublishedAt,
    lastSavedAt: state.lastSavedAt,
    saveDraft,
    publishDraft,
    discardDraft,
    resetAllToFactoryDefaults,
  };
}

/**
 * Lightweight hook for public-facing pages to read the published content
 */
export function usePublishedContent(): FullCMSData {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return state.published;
}
