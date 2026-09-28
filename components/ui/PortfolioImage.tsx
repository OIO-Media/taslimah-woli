'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import {
  ImageContext,
  IMAGE_CONTEXT_CONFIG,
  DARK_BLUR_DATA_URL,
  WARM_BLUR_DATA_URL,
  optimizeImageUrl,
} from '@/lib/image-utils';

export interface PortfolioImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  context?: ImageContext;
  aspectRatio?: '4/5' | '16/10' | '1/1' | '3/2' | '2/3' | 'auto' | string;
  containerClassName?: string;
  protection?: boolean;
  blurTheme?: 'dark' | 'warm';
}

/**
 * High-performance, context-aware image component for fine-art & documentary photography.
 * Replicates the behavior of Format, Cloudinary, and Imgix at Vercel Edge:
 * - Decimates pixel matrix to layout bounds before compression
 * - Negotiates AVIF/WebP automatically
 * - Zero Cumulative Layout Shift (CLS = 0) with progressive blur-up reveal
 * - Anti-scraping protection for exhibition plates
 */
export const PortfolioImage: React.FC<PortfolioImageProps> = ({
  src,
  alt,
  context = 'grid',
  aspectRatio = 'auto',
  containerClassName = '',
  className = '',
  priority = false,
  quality,
  sizes,
  protection = true,
  blurTheme = 'dark',
  fill = true,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const contextConfig = IMAGE_CONTEXT_CONFIG[context] || IMAGE_CONTEXT_CONFIG.grid;
  const targetQuality: number = quality ? Number(quality) : contextConfig.quality;
  const targetSizes = sizes ?? contextConfig.sizes;
  const isPriority = priority || contextConfig.priority || false;

  // Optimize upstream URL if external CDN (Unsplash/Supabase)
  const optimizedSrc = optimizeImageUrl(src, contextConfig.maxWidth, targetQuality);

  // Aspect ratio mapping
  const aspectClassMap: Record<string, string> = {
    '4/5': 'aspect-[4/5]',
    '16/10': 'aspect-[16/10]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
    '2/3': 'aspect-[2/3]',
  };
  const aspectClass = aspectClassMap[aspectRatio] || '';

  const blurPlaceholder = blurTheme === 'warm' ? WARM_BLUR_DATA_URL : DARK_BLUR_DATA_URL;

  return (
    <div
      className={`relative overflow-hidden ${aspectClass} ${containerClassName}`}
      onContextMenu={protection ? (e) => e.preventDefault() : undefined}
    >
      <Image
        src={optimizedSrc || src}
        alt={alt || 'Documentary photograph by Taslimah Woli'}
        fill={fill}
        priority={isPriority}
        loading={isPriority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={targetSizes}
        quality={targetQuality}
        placeholder="blur"
        blurDataURL={blurPlaceholder}
        draggable={!protection}
        onLoad={(e) => {
          setIsLoaded(true);
          if (onLoad) onLoad(e);
        }}
        className={`object-cover transition-opacity duration-700 ease-out select-none ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
