'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, ArrowUpRight } from 'lucide-react';
import { JournalEntry } from '@/lib/journals-data';
import { optimizeImageUrl, DARK_BLUR_DATA_URL } from '@/lib/image-utils';

interface JournalsCarouselProps {
  journals: JournalEntry[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelectJournal: (journal: JournalEntry) => void;
}

export const JournalsCarousel: React.FC<JournalsCarouselProps> = ({
  journals,
  activeIndex,
  onActiveIndexChange,
  onSelectJournal,
}) => {
  const total = journals.length;
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Responsive screen detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all cover images so there is never a flash when transitioning
  useEffect(() => {
    journals.forEach((entry) => {
      const img = new window.Image();
      img.src = entry.coverImage;
    });
  }, [journals]);

  // Navigate functions with bounded ends (stops at first and last)
  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      onActiveIndexChange(activeIndex - 1);
    }
  }, [activeIndex, onActiveIndexChange]);

  const handleNext = useCallback(() => {
    if (activeIndex < total - 1) {
      onActiveIndexChange(activeIndex + 1);
    }
  }, [activeIndex, total, onActiveIndexChange]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Enter/Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelectJournal(journals[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onSelectJournal, journals, activeIndex]);

  // Smooth wheel & trackpad scroll handling with momentum absorption
  const accumulatedDeltaRef = useRef<number>(0);
  const lastWheelTimeRef = useRef<number>(0);
  const wheelResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      // Strictly ignore vertical wheel/touchpad gestures - only horizontal scrolling moves the carousel
      if (!isHorizontal) return;

      const delta = e.deltaX;
      if (Math.abs(delta) < 4) return;

      if (Math.abs(e.deltaX) > 12) {
        e.preventDefault();
      }

      accumulatedDeltaRef.current += delta;
      const now = performance.now();
      const timeSinceLast = now - lastWheelTimeRef.current;
      const THRESHOLD = 44;

      if (Math.abs(accumulatedDeltaRef.current) >= THRESHOLD && timeSinceLast > 250) {
        if (accumulatedDeltaRef.current > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        accumulatedDeltaRef.current = 0;
        lastWheelTimeRef.current = now;
      }

      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = setTimeout(() => {
        accumulatedDeltaRef.current = 0;
      }, 140);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
    };
  }, [handleNext, handlePrev]);

  // Card dimensions & Stagger configuration
  // Wider, elegant editorial book proportion
  const cardWidth = isMobile ? 220 : 300;
  const cardHeight = isMobile ? 350 : 450;
  const spacing = isMobile ? 236 : 330;
  const staggerOffset = isMobile ? 8 : 16; // Subtle vertical alternating stagger

  const activeJournal = journals[activeIndex];

  // Native touch gesture handling for mobile swipe
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchDeltaXRef.current = 0;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.touches[0].clientX;
    const diffY = touchStartYRef.current - e.touches[0].clientY;
    touchDeltaXRef.current = diffX;
    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null) return;
    const diffX = touchDeltaXRef.current;
    const THRESHOLD = 35;
    if (Math.abs(diffX) >= THRESHOLD) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchDeltaXRef.current = 0;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full select-none overflow-hidden py-4 sm:py-6 md:py-8 focus:outline-none touch-pan-y"
      tabIndex={0}
      role="region"
      aria-label="Journals horizontal carousel"
    >
      {/* Main Viewport Container */}
      <motion.div
        className="relative mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          height: cardHeight + 85, // Clean headroom for subtle stagger + labels
        }}
        onPanEnd={(_, info) => {
          const threshold = 35;
          const velocityThreshold = 180;
          if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            handleNext();
          } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            handlePrev();
          }
        }}
      >
        {journals.map((journal, idx) => {
          const dist = idx - activeIndex;
          const absDist = Math.abs(dist);
          const isActive = idx === activeIndex;

          // Staggered vertical rhythm: alternating even and odd cards
          const isEven = idx % 2 === 0;
          const staggerY = isEven ? -staggerOffset : staggerOffset;
          const liftY = isActive ? -6 : 0; // Gentle active card lift

          // Relative X position centered around activeIndex
          const xOffset = dist * spacing;

          // Progressive scale, opacity & blur based on distance from center
          let scale = 1.0;
          let opacity = 1.0;
          let blurPx = 0;

          if (isActive) {
            scale = isMobile ? 1.05 : 1.08;
            opacity = 1.0;
            blurPx = 0;
          } else if (absDist === 1) {
            scale = isMobile ? 0.88 : 0.86;
            opacity = isMobile ? 0.65 : 0.68;
            blurPx = 2.5;
          } else if (absDist === 2) {
            scale = isMobile ? 0.78 : 0.75;
            opacity = isMobile ? 0.38 : 0.42;
            blurPx = 4.5;
          } else {
            scale = 0.68;
            opacity = 0.20;
            blurPx = 6.5;
          }

          // Layering: active card sits highest (well below Navbar's z-[100])
          const zIndex = isActive ? 30 : 20 - Math.min(absDist, 3) * 3;

          return (
            <motion.div
              key={journal.id}
              onClick={() => {
                if (isSwipingRef.current) return;
                if (isActive) {
                  onSelectJournal(journal);
                } else {
                  onActiveIndexChange(idx);
                }
              }}
              className="absolute cursor-pointer will-change-transform flex flex-col items-center"
              style={{
                width: cardWidth,
                zIndex,
              }}
              animate={{
                x: prefersReducedMotion ? 0 : xOffset,
                y: prefersReducedMotion ? 0 : staggerY + liftY,
                scale: prefersReducedMotion ? 1 : scale,
                opacity,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.42,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={
                isActive
                  ? { scale: prefersReducedMotion ? 1 : (isMobile ? 1.07 : 1.1) }
                  : { opacity: Math.min(opacity + 0.18, 0.85) }
              }
              whileTap={{ scale: 0.98 }}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={`${journal.chapterLabel}: ${journal.title}. ${
                isActive ? 'Click to open and read journal entry' : 'Click to bring to center'
              }`}
            >
              {/* Proportional wider monograph card */}
              <div
                className={`relative w-full rounded-xl overflow-hidden bg-[#18191b] transition-all duration-500 ${
                  isActive
                    ? 'shadow-[0_20px_45px_rgba(0,0,0,0.3)] ring-1 ring-black/10'
                    : 'shadow-[0_10px_25px_rgba(0,0,0,0.18)]'
                }`}
                style={{
                  height: cardHeight,
                }}
              >
                {/* Full-bleed Cover Image with compositor-accelerated grayscale and blur */}
                <Image
                  src={optimizeImageUrl(journal.coverImage, 900, 85)}
                  alt={journal.coverImageAlt}
                  fill
                  priority={absDist <= 1}
                  placeholder="blur"
                  blurDataURL={DARK_BLUR_DATA_URL}
                  sizes="(max-width: 640px) 240px, 320px"
                  className="object-cover object-center transition-[filter] duration-500 ease-out"
                  style={{
                    filter: isActive
                      ? 'grayscale(0%) contrast(100%)'
                      : `grayscale(100%) contrast(92%) blur(${blurPx}px)`,
                  }}
                />

                {/* Inactive card vignette overlay */}
                <div
                  className={`absolute inset-0 bg-black/30 transition-opacity duration-400 pointer-events-none ${
                    isActive ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Subtle Inner Border */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15 pointer-events-none" />

                {/* Top Subtle Chapter Watermark */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest text-white/70 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                    0{journal.chapterNumber}
                  </span>
                </div>
              </div>

              {/* Overlapping Badge: Chapter Label with clean matte border, no glowing accent */}
              <div
                className="relative -mt-4 z-20 px-3.5 py-1 rounded-full bg-[#18191b] border border-white/20 shadow-md transition-all duration-300 flex items-center justify-center gap-1.5"
                style={{
                  minWidth: isMobile ? '110px' : '130px',
                }}
              >
                <span className="text-[10px] sm:text-[11px] font-sans-clean font-bold uppercase tracking-widest text-white">
                  {journal.chapterLabel}
                </span>
              </div>

              {/* Text Metadata underneath card: Date, Average Minutes of Read and Read Article (title & tag removed) */}
              <div
                className={`mt-2.5 text-center px-2 w-full transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {/* Date & Reading Time */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans-clean text-[#8c8e90]">
                  <span>{journal.shortDate}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8c8e90]" />
                    <span>{journal.readTime}</span>
                  </span>
                </div>

                {/* Active "Read Article" action */}
                {isActive && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-sans-clean font-semibold uppercase tracking-widest text-[#18191b] hover:text-[#3e4143] transition-colors">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Arrow Controls: End-aware (dims at ends) */}
      <div className="hidden sm:flex absolute inset-y-0 left-3 sm:left-8 md:left-12 items-center pointer-events-none">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous journal entry"
          className={`pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#18191b]/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#18191b] ${
            activeIndex === 0
              ? 'opacity-25 cursor-not-allowed'
              : 'hover:bg-[#18191b] hover:scale-110'
          }`}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>
      </div>

      <div className="hidden sm:flex absolute inset-y-0 right-3 sm:right-8 md:right-12 items-center pointer-events-none">
        <button
          onClick={handleNext}
          disabled={activeIndex === total - 1}
          aria-label="Next journal entry"
          className={`pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#18191b]/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#18191b] ${
            activeIndex === total - 1
              ? 'opacity-25 cursor-not-allowed'
              : 'hover:bg-[#18191b] hover:scale-110'
          }`}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>
      </div>

      {/* Active Journal Bottom Action CTA: Long Dark Bar Carrying Writing Title */}
      <div className="mt-7 text-center px-4 flex items-center justify-center gap-2 sm:gap-4">
        {/* Mobile Prev Tap Target */}
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous journal entry"
          className={`sm:hidden w-10 h-10 rounded-full bg-[#18191b] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-md ${
            activeIndex === 0 ? 'opacity-25 pointer-events-none' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectJournal(activeJournal)}
          className="group inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] text-[11px] sm:text-xs font-sans-clean tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#18191b] max-w-[270px] sm:max-w-2xl truncate"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 hidden sm:inline-block" />
          <span className="truncate">
            Read {activeJournal.chapterLabel}: {activeJournal.title}
          </span>
          <BookOpen className="w-3.5 h-3.5 text-white/80 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Mobile Next Tap Target */}
        <button
          onClick={handleNext}
          disabled={activeIndex === total - 1}
          aria-label="Next journal entry"
          className={`sm:hidden w-10 h-10 rounded-full bg-[#18191b] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-md ${
            activeIndex === total - 1 ? 'opacity-25 pointer-events-none' : ''
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Chapter Indicator Dots with Clean Monochrome Styling */}
      <div
        className="mt-5 flex items-center justify-center gap-2 sm:gap-2.5"
        role="tablist"
        aria-label="Journal chapters"
      >
        {journals.map((journal, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={journal.id}
              onClick={() => onActiveIndexChange(idx)}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#18191b]'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#caccca] hover:bg-[#8c8e90]'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-label={`Jump to ${journal.chapterLabel}: ${journal.title}`}
            />
          );
        })}
      </div>
    </div>
  );
};
