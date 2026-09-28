'use client';

import { useSyncExternalStore, useState, useEffect, useCallback } from 'react';
import {
  PORTFOLIO_ITEMS,
  PortfolioItem,
  ARTIST_INFO,
  HERO_CONFIG,
  PRINT_COLLECTION,
  PrintItem,
} from './portfolio-data';
import { STORIES_DATA, StoryProject } from './stories-data';
import { ASSIGNMENTS_DATA, AssignmentProject } from './assignments-data';
import { JOURNALS_DATA, JournalEntry } from './journals-data';

export interface SiteArtistInfo {
  name: string;
  subtitle: string;
  bio: string;
  bioParagraphs?: string[];
  awards: string[];
  clients: string[];
  email: string;
  phone: string;
  location: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface SiteHeroConfig {
  image: string;
  imageAlt: string;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  scrollPrompt: string;
}

export interface SiteContent {
  homePageWorks: PortfolioItem[];
  stories: StoryProject[];
  assignments: AssignmentProject[];
  journals: JournalEntry[];
  artistInfo: SiteArtistInfo;
  heroConfig: SiteHeroConfig;
  printCollection: PrintItem[];
  lastModified?: string;
}

const STORAGE_KEY = 'wolitaslimah_site_content_v3';
const EVENT_NAME = 'wolitaslimah:content-updated';

// Helper to convert Story to Home PortfolioItem
export function storyToPortfolioItem(story: StoryProject): PortfolioItem {
  return {
    id: `story-${story.id}`,
    number: '',
    title: story.title,
    layoutBTitle: story.title.toUpperCase(),
    tagline: story.subtitle.toUpperCase(),
    category: 'Stories',
    image: story.coverImage,
    imageAlt: `${story.title} documentary photography by Taslimah Woli`,
    description: story.leadParagraph,
    location: story.location,
    year: story.year,
    gallery: story.photos.map((p) => ({
      url: p.url,
      caption: p.caption,
      exif: p.exif,
    })),
  };
}

// Helper to convert Assignment to Home PortfolioItem
export function assignmentToPortfolioItem(assignment: AssignmentProject): PortfolioItem {
  return {
    id: `assignment-${assignment.id}`,
    number: '',
    title: assignment.title,
    layoutBTitle: assignment.title.toUpperCase(),
    tagline: (assignment.subtitle || assignment.commissionType).toUpperCase(),
    category: 'Assignments',
    image: assignment.coverImage,
    imageAlt: `${assignment.title} assignment photography for ${assignment.client}`,
    description: assignment.leadParagraph,
    location: assignment.location,
    year: assignment.year,
    gallery: assignment.photos.map((p) => ({
      url: p.url,
      caption: p.caption,
      exif: p.exif,
    })),
  };
}

// Clean default portfolio items without numbers
const DEFAULT_CLEAN_PORTFOLIO_ITEMS: PortfolioItem[] = PORTFOLIO_ITEMS.map((item) => ({
  ...item,
  number: '', // Guarantee no numberings
}));

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homePageWorks: DEFAULT_CLEAN_PORTFOLIO_ITEMS,
  stories: STORIES_DATA,
  assignments: ASSIGNMENTS_DATA,
  journals: JOURNALS_DATA,
  artistInfo: {
    ...ARTIST_INFO,
    bioParagraphs: [
      'Taslimah Woli is a documentary photographer based in Nigeria, working across Africa and internationally. Her practice is centered on people, architecture, and the relationship between people and the spaces they inhabit. Alongside personal documentary projects, she undertakes editorial, architectural, and institutional commissions, and is beginning to explore film.',
      'Her background in architecture directly shapes her visual instinct. She works with strong perspective, geometry, and the rule of thirds, positioning people in relation to buildings and inhabited space rather than in isolation. Her images carry a characteristic distance and quietness—favoring research, spatial sensitivity, and sustained observation over spectacle.',
      'She works for magazines, publications, cultural organisations, institutions, and selected brands. Her practice unites photographic rigor with architectural understanding and investigative writing, researching the context of what she documents rather than focusing solely on aesthetics.',
    ],
    socials: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      whatsapp: 'https://wa.me/2348000000000',
    },
  },
  heroConfig: HERO_CONFIG,
  printCollection: PRINT_COLLECTION,
  lastModified: new Date().toISOString(),
};

/**
 * Get current site content synchronously (safe for SSR & client)
 */
export function getSiteContent(): SiteContent {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      homePageWorks: (parsed.homePageWorks || DEFAULT_CLEAN_PORTFOLIO_ITEMS).map((item: PortfolioItem) => ({
        ...item,
        number: '', // Guarantee no numberings
      })),
      stories: parsed.stories || STORIES_DATA,
      assignments: parsed.assignments || ASSIGNMENTS_DATA,
      journals: parsed.journals || JOURNALS_DATA,
      artistInfo: { ...DEFAULT_SITE_CONTENT.artistInfo, ...(parsed.artistInfo || {}) },
      heroConfig: { ...DEFAULT_SITE_CONFIG || DEFAULT_SITE_CONTENT.heroConfig, ...(parsed.heroConfig || {}) },
      printCollection: parsed.printCollection || PRINT_COLLECTION,
    };
  } catch (err) {
    console.error('Failed to read site content from localStorage:', err);
    return DEFAULT_SITE_CONTENT;
  }
}

const DEFAULT_SITE_CONFIG = DEFAULT_SITE_CONTENT.heroConfig;

/**
 * Persist site content to localStorage and dispatch update events
 */
export function saveSiteContent(newContent: Partial<SiteContent>): SiteContent {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }
  try {
    const current = getSiteContent();
    const updated: SiteContent = {
      ...current,
      ...newContent,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    cachedSnapshot = updated;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to save site content:', err);
    return getSiteContent();
  }
}

let cachedSnapshot: SiteContent | null = null;

/**
 * Reset site content back to defaults
 */
export function resetSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    localStorage.removeItem(STORAGE_KEY);
    cachedSnapshot = DEFAULT_SITE_CONTENT;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_SITE_CONTENT }));
    return DEFAULT_SITE_CONTENT;
  } catch (err) {
    console.error('Failed to reset site content:', err);
    return DEFAULT_SITE_CONTENT;
  }
}

function subscribe(onStoreChange: () => void) {
  const handler = () => {
    cachedSnapshot = null;
    onStoreChange();
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

function getSnapshot(): SiteContent {
  if (!cachedSnapshot) {
    cachedSnapshot = getSiteContent();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): SiteContent {
  return DEFAULT_SITE_CONTENT;
}

const emptySubscribe = () => () => {};

/**
 * React Hook for consuming and updating dynamic site content
 */
export function useSiteContent() {
  const content = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const updateHomePageWorks = useCallback((works: PortfolioItem[]) => {
    const cleaned = works.map((w) => ({ ...w, number: '' }));
    return saveSiteContent({ homePageWorks: cleaned });
  }, []);

  const updateStories = useCallback((stories: StoryProject[]) => {
    return saveSiteContent({ stories });
  }, []);

  const updateAssignments = useCallback((assignments: AssignmentProject[]) => {
    return saveSiteContent({ assignments });
  }, []);

  const updateJournals = useCallback((journals: JournalEntry[]) => {
    return saveSiteContent({ journals });
  }, []);

  const updateArtistInfo = useCallback((artistInfo: SiteArtistInfo) => {
    return saveSiteContent({ artistInfo });
  }, []);

  const updateHeroConfig = useCallback((heroConfig: SiteHeroConfig) => {
    return saveSiteContent({ heroConfig });
  }, []);

  const updatePrintCollection = useCallback((printCollection: PrintItem[]) => {
    return saveSiteContent({ printCollection });
  }, []);

  const resetToDefaults = useCallback(() => {
    return resetSiteContent();
  }, []);

  const exportBackup = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `wolitaslimah_content_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [content]);

  const importBackup = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;
      saveSiteContent(parsed);
      return true;
    } catch (err) {
      console.error('Invalid backup JSON:', err);
      return false;
    }
  }, []);

  return {
    content,
    isLoaded,
    updateHomePageWorks,
    updateStories,
    updateAssignments,
    updateJournals,
    updateArtistInfo,
    updateHeroConfig,
    updatePrintCollection,
    resetToDefaults,
    exportBackup,
    importBackup,
  };
}
