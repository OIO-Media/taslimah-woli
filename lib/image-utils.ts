/**
 * High-performance image utilities for instant loading on average/poor networks
 * while preserving crispy sharp rendering.
 */

// Ultra-lightweight base64 blur placeholder data URIs (~150 bytes, zero network overhead)
// Provides instant visual continuity without blocking the main thread or causing layout shift.
export const DARK_BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23141416"/%3E%3Cstop offset="50%25" stop-color="%23222226"/%3E%3Cstop offset="100%25" stop-color="%23101012"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23g)"/%3E%3C/svg%3E';

export const WARM_BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3Cdefs%3E%3ClinearGradient id="gw" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23d8cfc0"/%3E%3Cstop offset="50%25" stop-color="%23e8e1d5"/%3E%3Cstop offset="100%25" stop-color="%23c4baa8"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23gw)"/%3E%3C/svg%3E';

/**
 * Optimizes Unsplash CDN URLs:
 * - Ensures auto=format (CDN serves AVIF to modern browsers, WebP fallback)
 * - Sets compression quality to 75 (sweet spot: visually identical to 100% but 3-5x smaller payload)
 * - Sets fit=crop and sensible max width
 */
export function optimizeImageUrl(url: string, maxWidth = 1400, quality = 75): string {
  try {
    if (!url.includes('images.unsplash.com')) {
      return url;
    }
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', maxWidth.toString());
    parsed.searchParams.set('q', quality.toString());
    return parsed.toString();
  } catch {
    return url;
  }
}
