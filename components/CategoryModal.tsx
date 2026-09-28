'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { PortfolioItem } from '@/lib/portfolio-data';
import { DARK_BLUR_DATA_URL, optimizeImageUrl } from '@/lib/image-utils';

interface CategoryModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ item, onClose }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!item) return null;

  const currentPhoto = item.gallery[activePhotoIdx] || {
    url: item.image,
    caption: item.title,
    exif: '35mm format',
  };

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % item.gallery.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + item.gallery.length) % item.gallery.length);
  };

  return (
    <div
      id="category-gallery-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18191b]/70 backdrop-blur-md text-[#18191b] p-4 sm:p-6 md:p-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-[#eeefef] border border-[#caccca] rounded-none flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#caccca] bg-[#f7f8f8]">
          <div className="flex items-center gap-3">
            <span className="font-sans-clean text-xs font-bold tracking-widest text-[#8c8e90] uppercase">
              {item.category}
            </span>
            <span className="text-[#caccca]">•</span>
            <h3 className="font-serif-luxury text-xl tracking-wider uppercase text-[#18191b] font-light">
              {item.layoutBTitle}
            </h3>
            <span className="hidden sm:inline text-xs text-[#8c8e90] tracking-wider font-sans-clean">
              ({item.tagline})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-[#8c8e90] hover:text-[#18191b] transition-colors focus:outline-none"
              title="Toggle Fullscreen View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              id="close-category-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#8c8e90] hover:text-[#18191b] transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Main Photo Display */}
          <div className="lg:col-span-8 relative bg-[#18191b] flex items-center justify-center min-h-[360px] sm:min-h-[480px] lg:min-h-[560px]">
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px]">
              <Image
                src={optimizeImageUrl(currentPhoto.url, 1600, 75)}
                alt={currentPhoto.caption}
                fill
                priority
                placeholder="blur"
                blurDataURL={DARK_BLUR_DATA_URL}
                quality={75}
                sizes="(max-width: 1024px) 100vw, 66vw"
                referrerPolicy="no-referrer"
                className="object-contain p-2 sm:p-4 transition-all duration-300"
              />
            </div>

            {/* Gallery Navigation Controls */}
            {item.gallery.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[#eeefef]/90 hover:bg-[#eeefef] text-[#18191b] border border-[#caccca] rounded-full shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#eeefef]/90 hover:bg-[#eeefef] text-[#18191b] border border-[#caccca] rounded-full shadow-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-4 bg-[#eeefef]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] tracking-widest uppercase font-sans-clean text-[#18191b] border border-[#caccca] shadow-xs">
              {activePhotoIdx + 1} / {item.gallery.length}
            </div>
          </div>

          {/* Details & Thumbnail Sidebar */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#f7f8f8] border-t lg:border-t-0 lg:border-l border-[#caccca]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-sans-clean text-[#8c8e90] block mb-1">
                Curated Series
              </span>
              <h4 className="font-serif-luxury text-2xl font-light tracking-wide text-[#18191b] mb-3">
                {currentPhoto.caption}
              </h4>
              <p className="text-xs font-sans-clean leading-relaxed text-[#3e4143] mb-6">
                {item.description}
              </p>

              {/* Technical / Metadata Box */}
              <div className="space-y-3 py-4 border-y border-[#caccca] text-xs font-sans-clean text-[#3e4143]">
                {item.location && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8c8e90]" />
                    <span>Location: {item.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8c8e90]" />
                  <span>Period: {item.year}</span>
                </div>
                {currentPhoto.exif && (
                  <div className="flex items-start gap-2.5">
                    <Camera className="w-3.5 h-3.5 text-[#8c8e90] mt-0.5 shrink-0" />
                    <span className="text-[11px] leading-relaxed font-mono text-[#8c8e90]">
                      {currentPhoto.exif}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-6">
              <span className="text-[10px] tracking-widest uppercase font-sans-clean text-[#8c8e90] block mb-2">
                Series Plates ({item.gallery.length})
              </span>
              <div className="grid grid-cols-4 gap-2">
                {item.gallery.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative aspect-square border overflow-hidden transition-all ${
                      activePhotoIdx === idx
                        ? 'border-[#18191b] ring-1 ring-[#18191b]'
                        : 'border-[#caccca] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={optimizeImageUrl(g.url, 240, 70)}
                      alt={g.caption}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={DARK_BLUR_DATA_URL}
                      quality={70}
                      sizes="80px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
