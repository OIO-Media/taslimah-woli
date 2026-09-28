/**
 * High-performance image utilities & pipeline for professional documentary photography.
 * Replicates the behavior of Format, Cloudinary, and Imgix at Vercel Edge.
 */

export type ImageContext = 'thumbnail' | 'grid' | 'coverflow' | 'hero' | 'lightbox';

export interface ImageContextOptions {
  maxWidth: number;
  quality: number;
  sizes: string;
  priority?: boolean;
}

export const IMAGE_CONTEXT_CONFIG: Record<ImageContext, ImageContextOptions> = {
  thumbnail: {
    maxWidth: 400,
    quality: 72,
    sizes: '(max-width: 640px) 120px, (max-width: 1024px) 180px, 240px',
  },
  grid: {
    maxWidth: 1080,
    quality: 78,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  coverflow: {
    maxWidth: 1400,
    quality: 80,
    sizes: '(max-width: 768px) 90vw, (max-width: 1280px) 65vw, 900px',
  },
  hero: {
    maxWidth: 1920,
    quality: 82,
    sizes: '100vw',
    priority: true,
  },
  lightbox: {
    maxWidth: 2560,
    quality: 86,
    sizes: '100vw',
  },
};

// Ultra-lightweight base64 SVG blur placeholder data URIs (~150 bytes, zero network overhead)
// Provides instant visual continuity without blocking the main thread or causing layout shift.
export const DARK_BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23141416"/%3E%3Cstop offset="50%25" stop-color="%23222226"/%3E%3Cstop offset="100%25" stop-color="%23101012"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23g)"/%3E%3C/svg%3E';

export const WARM_BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3Cdefs%3E%3ClinearGradient id="gw" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23d8cfc0"/%3E%3Cstop offset="50%25" stop-color="%23e8e1d5"/%3E%3Cstop offset="100%25" stop-color="%23c4baa8"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23gw)"/%3E%3C/svg%3E';

/**
 * Optimizes origin URLs before passing to Next.js image loader:
 * - Unsplash: ensures auto=format (AVIF/WebP), fit=crop, downscaled bounds, perceptual quality
 * - Supabase: handles direct CDN paths
 */
export function optimizeImageUrl(
  url: string,
  maxWidth = 1400,
  quality = 78
): string {
  if (!url) return '';
  try {
    if (url.includes('images.unsplash.com')) {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', maxWidth.toString());
      parsed.searchParams.set('q', quality.toString());
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}
