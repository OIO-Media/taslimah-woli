'use client';

/**
 * CMS Adapters
 * 
 * Converts CMS data types (from cms-types.ts / cms-store.ts) into the public
 * component types expected by the rendering components (stories-data.ts,
 * assignments-data.ts, journals-data.ts, portfolio-data.ts).
 * 
 * This bridge ensures that CMS edits flow through to the public site without
 * modifying the existing rendering components.
 */

import { StoryProject, StoryPhoto } from './stories-data';
import { AssignmentProject, AssignmentPhoto } from './assignments-data';
import { JournalEntry, JournalArticleSection } from './journals-data';
import { PortfolioItem, PrintItem } from './portfolio-data';
import {
  StoryProjectCMS,
  AssignmentProjectCMS,
  JournalEntryCMS,
  BodyOfWorkItem,
  PrintItemCMS,
  GalleryPhoto,
} from './cms-types';

// ─── Stories ────────────────────────────────────────────────────────────────

export function cmsStoryToPublic(story: StoryProjectCMS, index: number): StoryProject {
  return {
    id: story.id,
    number: String(index + 1).padStart(2, '0'),
    title: story.title,
    subtitle: story.subtitle || 'Documentary Series',
    year: story.year,
    photoCount: story.photos.length,
    location: story.location,
    camera: (story as any).camera || 'Medium Format & 35mm Systems',
    coverImage: story.coverImage,
    rating: (story as any).rating,
    formatBadge: (story as any).formatBadge,
    leadParagraph: story.leadParagraph,
    narrative: (story as any).narrative || extractNarrative(story.projectStatement || story.leadParagraph),
    photos: story.photos.map(cmsPhotoToStoryPhoto),
  };
}

function cmsPhotoToStoryPhoto(photo: GalleryPhoto): StoryPhoto {
  return {
    id: photo.id,
    url: photo.url,
    caption: photo.caption,
    exif: photo.exif,
    aspect: detectAspect(photo),
  };
}

// ─── Assignments ────────────────────────────────────────────────────────────

export function cmsAssignmentToPublic(assignment: AssignmentProjectCMS, index: number): AssignmentProject {
  return {
    id: assignment.id,
    number: String(index + 1).padStart(2, '0'),
    title: assignment.title,
    subtitle: assignment.subtitle || assignment.commissionType || 'Commission',
    client: assignment.client,
    commissionType: assignment.commissionType,
    artDirector: (assignment as any).artDirector,
    publishedIn: (assignment as any).publishedIn,
    year: assignment.year,
    photoCount: assignment.photos.length,
    location: assignment.location,
    camera: (assignment as any).camera || 'Documentary Imaging Systems',
    coverImage: assignment.coverImage,
    rating: (assignment as any).rating,
    formatBadge: (assignment as any).formatBadge || 'COMMISSION',
    leadParagraph: assignment.leadParagraph,
    narrative: (assignment as any).narrative || extractNarrative(assignment.leadParagraph),
    photos: assignment.photos.map(cmsPhotoToAssignmentPhoto),
  };
}

function cmsPhotoToAssignmentPhoto(photo: GalleryPhoto): AssignmentPhoto {
  return {
    id: photo.id,
    url: photo.url,
    caption: photo.caption,
    exif: photo.exif,
    aspect: detectAspect(photo),
  };
}

// ─── Journals ───────────────────────────────────────────────────────────────

export function cmsJournalToPublic(journal: JournalEntryCMS, index: number): JournalEntry {
  // Extract chapter number from chapter string like "Chapter 01" → 1
  const chapterMatch = journal.chapter.match(/(\d+)/);
  const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : index + 1;

  // Build sections from paragraphs as fallback if no bodyHtml
  const sections: JournalArticleSection[] = journal.paragraphs.length > 0
    ? buildSectionsFromParagraphs(journal.paragraphs, journal.excerpt)
    : [];

  const entry: JournalEntry = {
    id: journal.id,
    chapterNumber,
    chapterLabel: journal.chapter || `Essay ${String(index + 1).padStart(2, '0')}`,
    title: journal.title,
    subtitle: journal.subtitle || 'Research & Field Notes',
    category: (journal as any).category || 'Published Essay',
    date: journal.date,
    shortDate: (journal as any).shortDate || journal.date,
    readTime: journal.readTime,
    lastUpdated: (journal as any).lastUpdated,
    accentColor: (journal as any).accentColor || '#3e4143',
    accentGlow: (journal as any).accentGlow || 'rgba(62, 65, 67, 0.45)',
    accentBg: (journal as any).accentBg || 'rgba(62, 65, 67, 0.12)',
    coverImage: journal.coverImage,
    coverImageAlt: (journal as any).coverImageAlt || journal.title,
    excerpt: journal.excerpt,
    author: (journal as any).author || {
      name: 'Taslimah Woli',
      role: 'Documentary Photographer & Researcher',
      avatar: '/taslimah_portrait.jpg',
    },
    sections,
  };

  // Preserve bodyHtml for the reading view's dangerouslySetInnerHTML path
  if (journal.bodyHtml) {
    (entry as any).bodyHtml = journal.bodyHtml;
  }

  return entry;
}

function buildSectionsFromParagraphs(paragraphs: string[], excerpt?: string): JournalArticleSection[] {
  if (paragraphs.length === 0) return [];

  // Simple approach: group paragraphs into sections of 2-3
  const sections: JournalArticleSection[] = [];
  const chunkSize = 2;
  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    const chunk = paragraphs.slice(i, i + chunkSize);
    sections.push({
      paragraphs: chunk,
      ...(i === 0 && excerpt ? { callout: excerpt } : {}),
    });
  }
  return sections;
}

// ─── Home Page (Bodies of Work → PortfolioItem) ─────────────────────────────

export function cmsBodyOfWorkToPortfolioItem(item: BodyOfWorkItem): PortfolioItem {
  return {
    id: item.id,
    number: '',
    title: item.title,
    layoutBTitle: item.layoutBTitle || item.title.toUpperCase(),
    tagline: item.tagline || '',
    category: item.category,
    image: item.image,
    imageAlt: item.imageAlt || item.title,
    description: item.description || '',
    location: item.location,
    year: item.year,
    gallery: item.gallery.map((g) => ({
      url: g.url,
      caption: g.caption,
      exif: g.exif,
    })),
  };
}

// ─── Prints ─────────────────────────────────────────────────────────────────

export function cmsPrintToPublic(print: PrintItemCMS): PrintItem {
  return {
    id: print.id,
    title: print.title,
    series: print.series,
    medium: print.medium,
    paper: print.paper,
    editionSize: print.editionSize,
    image: print.image,
    description: print.description,
    sizes: print.sizes.map((s) => ({
      label: s.label,
      dimensions: s.dimensions,
      price: s.price,
    })),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract narrative paragraphs from a rich text string or plain text.
 * Used when the CMS has projectStatement (HTML) but no explicit narrative array.
 */
function extractNarrative(text?: string): string[] {
  if (!text) return ['A personal documentary inquiry by Taslimah Woli.'];

  // If it's HTML, strip tags and split on double newlines or <p> blocks
  if (text.includes('<')) {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
      div.innerHTML = text;
      const paragraphs = Array.from(div.querySelectorAll('p'))
        .map((p) => p.textContent?.trim())
        .filter((t): t is string => !!t && t.length > 0);
      if (paragraphs.length > 0) return paragraphs;
    }
    // SSR fallback: regex strip
    const stripped = text.replace(/<[^>]+>/g, '\n');
    const parts = stripped.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
    return parts.length > 0 ? parts : [text.replace(/<[^>]+>/g, ' ').trim()];
  }

  // Plain text: split on double newlines
  const parts = text.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

/**
 * Detect photo aspect ratio from any stored hints.
 * Falls back to undefined (component will use default aspect).
 */
function detectAspect(photo: GalleryPhoto): 'portrait' | 'landscape' | 'square' | undefined {
  return (photo as any).aspect || undefined;
}
