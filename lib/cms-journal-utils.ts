/**
 * Utility functions for CMS Journal management
 */

/**
 * Calculates estimated read time from HTML content or plain text.
 * Uses standard average reading speed of 200 words per minute.
 */
export function calculateReadTime(content: string): string {
  if (!content || typeof content !== 'string') {
    return '1 min read';
  }

  // Strip HTML tags and entities
  const clean = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .trim();

  if (!clean) {
    return '1 min read';
  }

  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

/**
 * Calculates word count from HTML or plain text
 */
export function countWords(content: string): number {
  if (!content || typeof content !== 'string') return 0;
  const clean = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .trim();
  return clean ? clean.split(/\s+/).filter(Boolean).length : 0;
}
