'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Eye, RotateCcw } from 'lucide-react';
import { PORTFOLIO_ITEMS, PortfolioItem } from '@/lib/portfolio-data';
import { DARK_BLUR_DATA_URL, optimizeImageUrl } from '@/lib/image-utils';
import { usePublishedContent } from '@/lib/cms-store';
import { PortfolioImage } from '@/components/ui/PortfolioImage';

interface LayoutAProps {
  items?: PortfolioItem[];
  onSelectCategory: (item: PortfolioItem) => void;
}

export const LayoutA_Stacked: React.FC<LayoutAProps> = ({
  items,
  onSelectCategory,
}) => {
  const displayItems = items && items.length > 0 ? items : PORTFOLIO_ITEMS;
  const cms = usePublishedContent();
  const footerText = cms.siteWide?.footerText || '© 2026 Taslimah Woli';
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const targetIndexRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingScrubRef = useRef(false);

  const totalItems = displayItems.length;

  const scrollToPanel = useCallback((index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const maxIndex = totalItems - 1;
    const safeIndex = Math.max(0, Math.min(maxIndex, index));
    const { scrollWidth, clientWidth } = container;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 500);

    if (safeIndex === 0) {
      container.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
      return;
    }

    if (safeIndex === maxIndex) {
      container.scrollTo({
        left: maxScroll,
        behavior: 'smooth',
      });
      return;
    }

    const targetEl = children[safeIndex];
    if (targetEl) {
      const baseOffset = children[0].offsetLeft;
      const targetLeft = Math.max(0, Math.min(maxScroll, targetEl.offsetLeft - baseOffset));
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    }
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    const maxIndex = totalItems - 1;
    let prev = targetIndexRef.current - 1;
    if (prev < 0) {
      prev = maxIndex;
    }
    targetIndexRef.current = prev;
    setCurrentIndex(prev);
    scrollToPanel(prev);
  }, [totalItems, scrollToPanel]);

  const handleNext = useCallback(() => {
    const maxIndex = totalItems - 1;
    let next = targetIndexRef.current + 1;
    if (next > maxIndex) {
      next = 0;
    }
    targetIndexRef.current = next;
    setCurrentIndex(next);
    scrollToPanel(next);
  }, [totalItems, scrollToPanel]);

  // Keyboard arrow keys for one-by-one panel navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Wheel listener: strictly ignore vertical scroll (deltaY) so scrolling up/down never scrolls the carousel.
  // Only horizontal scrolling (left/right, deltaX) scrolls the carousel.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      // Strictly ignore vertical scrolling - scrolling up and down must never advance the carousel
      if (!isHorizontal) return;

      if (Math.abs(e.deltaX) < 6) return;

      e.preventDefault();
      accumulatedDelta += e.deltaX;

      if (wheelTimeout) clearTimeout(wheelTimeout);

      wheelTimeout = setTimeout(() => {
        const threshold = 28;
        if (accumulatedDelta > threshold) {
          handleNext();
        } else if (accumulatedDelta < -threshold) {
          handlePrev();
        }
        accumulatedDelta = 0;
      }, 35);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [handleNext, handlePrev]);

  // Fluid scroll handler: calculates real-time scrollProgress (0 to 1) and active panel index
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = Math.max(1, scrollWidth - clientWidth);

    const ratio = Math.min(1, Math.max(0, scrollLeft / maxScroll));
    setScrollProgress(ratio);

    if (!isProgrammaticScrollRef.current) {
      if (scrollLeft <= 12) {
        targetIndexRef.current = 0;
        setCurrentIndex(0);
        return;
      }
      if (scrollLeft >= maxScroll - 12) {
        targetIndexRef.current = totalItems - 1;
        setCurrentIndex(totalItems - 1);
        return;
      }

      const children = Array.from(container.children) as HTMLElement[];
      if (children.length > 0) {
        const baseOffset = children[0].offsetLeft;
        let closestIdx = 0;
        let minDiff = Infinity;
        children.forEach((child, i) => {
          const diff = Math.abs(child.offsetLeft - baseOffset - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });
        targetIndexRef.current = closestIdx;
        setCurrentIndex(closestIdx);
      }
    }
  }, [totalItems]);

  // Sync scroll position on mount
  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  // Global mouse/touch up for scrubber dragging
  useEffect(() => {
    const handlePointerUp = () => {
      isDraggingScrubRef.current = false;
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const formatIndex = (idx: number) => {
    const num = idx + 1;
    return num < 10 ? `0${num}.` : `${num}.`;
  };

  // Fluid percentage computation
  const fluidPercentage =
    scrollProgress >= 0.985 || currentIndex >= totalItems - 1
      ? 100
      : Math.min(
          100,
          Math.max(
            (1 / totalItems) * 100,
            ((1 + scrollProgress * (totalItems - 1)) / totalItems) * 100
          )
        );

  const handleScrubInteraction = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      const maxScroll = Math.max(1, scrollWidth - clientWidth);
      const estIndex = Math.min(totalItems - 1, Math.max(0, Math.round(ratio * (totalItems - 1))));
      targetIndexRef.current = estIndex;
      setCurrentIndex(estIndex);

      containerRef.current.scrollTo({
        left: ratio * maxScroll,
        behavior: isDraggingScrubRef.current ? 'auto' : 'smooth',
      });
    }
  };

  // Native touch gesture tracking to prevent accidental clicks while scrolling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.touches[0].clientX;
    const diffY = touchStartYRef.current - e.touches[0].clientY;
    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  };

  return (
    <div
      id="layout-a-container"
      className="relative w-full h-screen bg-[#eeefef] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Left Edge PREV Navigation Control */}
      <button
        id="layout-a-prev-btn"
        onClick={handlePrev}
        aria-label="Previous portfolio panel"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 pl-3 pr-3.5 py-10 text-[11px] tracking-[0.25em] uppercase font-sans-clean transition-all duration-300 group bg-[#eeefef]/90 hover:bg-white backdrop-blur-md border-r border-[#caccca] shadow-sm ${
          currentIndex === 0 ? 'text-[#8c8e90] hover:text-[#18191b]' : 'text-[#3e4143] hover:text-[#18191b]'
        }`}
      >
        <span className="flex items-center gap-1.5 [writing-mode:vertical-lr] rotate-180">
          <ChevronLeft className="w-3.5 h-3.5 rotate-90 inline-block transition-transform group-hover:-translate-y-1" />
          <span>PREV</span>
        </span>
      </button>

      {/* Right Edge NEXT Navigation Control */}
      <button
        id="layout-a-next-btn"
        onClick={handleNext}
        aria-label="Next portfolio panel"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 pr-3 pl-3.5 py-10 text-[11px] tracking-[0.25em] uppercase font-sans-clean transition-all duration-300 group bg-[#eeefef]/90 hover:bg-white backdrop-blur-md border-l border-[#caccca] shadow-sm text-[#3e4143] hover:text-[#18191b]"
      >
        <span className="flex items-center gap-1.5 [writing-mode:vertical-lr] rotate-180">
          {currentIndex >= totalItems - 1 ? (
            <>
              <RotateCcw className="w-3 h-3 rotate-90 inline-block transition-transform group-hover:rotate-180" />
              <span>TO START</span>
            </>
          ) : (
            <>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 inline-block transition-transform group-hover:translate-y-1" />
              <span>NEXT</span>
            </>
          )}
        </span>
      </button>

      {/* Main Horizontal Panels Viewport: 2 panels per screen extending directly to under the header down to footer */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        id="layout-a-panels-wrapper"
        className="w-full h-full flex items-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar touch-pan-x touch-pan-y pl-10 pr-14 sm:pl-14 sm:pr-18 lg:pl-20 lg:pr-24 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 pt-[57px] md:pt-[61px] pb-[53px] sm:pb-[57px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {displayItems.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const isActiveLeading = currentIndex === idx;

          // 2 Panels View with breathing room and margins in between:
          // Desktop (lg+): Exactly 2 panels fit the screen with generous gap in between
          // Tablet (md): 2 panels
          // Mobile (sm/xs): 1 primary hero panel with glimpse of the next
          const widthClass = 'w-[85vw] sm:w-[72vw] md:w-[calc((100vw-160px)/2)] lg:w-[calc((100vw-220px)/2)] xl:w-[calc((100vw-260px)/2)] 2xl:w-[calc((100vw-300px)/2)]';

          return (
            <div
              key={item.id}
              id={`panel-${item.id}`}
              onClick={() => {
                if (isSwipingRef.current) return;
                onSelectCategory(item);
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative flex-none ${widthClass} h-[calc(100vh-110px)] md:h-[calc(100vh-118px)] cursor-pointer snap-start overflow-hidden group border border-[#caccca] hover:border-[#18191b] transition-all duration-500 bg-[#18191b] shadow-[0_12px_35px_rgba(24,25,27,0.12)] hover:shadow-[0_24px_50px_rgba(24,25,27,0.22)]`}
            >
              {/* Image Container with Desaturated Cinematic Treatment & Zoom */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#18191b]">
                <PortfolioImage
                  src={item.image}
                  alt={item.imageAlt}
                  context="hero"
                  priority={idx < 2}
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 50vw"
                  protection={true}
                  className={`object-cover object-center transition-all duration-700 ease-out filter ${
                    isHovered
                      ? 'scale-105 brightness-95 saturate-100 contrast-105'
                      : isActiveLeading
                      ? 'scale-100 brightness-85 contrast-105 saturate-[0.85]'
                      : 'scale-100 brightness-75 contrast-100 saturate-[0.70]'
                  }`}
                />
                {/* Subtle vignette and bottom dark gradient for high typography contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90 transition-opacity group-hover:opacity-95" />
              </div>

              {/* View Overlay Indicator in Top Corner - always visible on touch, reveals on hover on desktop */}
              <div
                className="absolute top-5 right-5 z-20 transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:-translate-y-2 sm:group-hover:translate-y-0"
              >
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#eeefef]/95 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest text-[#18191b] border border-[#caccca] shadow-md">
                  <Eye className="w-3 h-3" />
                  <span>View Project</span>
                </span>
              </div>

              {/* Panel Content & Labels - Clean layout without numbering */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 lg:p-8 z-20 pointer-events-none transition-transform duration-500 group-hover:-translate-y-1">
                {/* Clean sans-serif Category Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans-clean font-bold tracking-tight text-white mb-2 leading-tight">
                  {item.title}
                </h3>

                {/* Small category tag line beneath */}
                <p className="text-[10px] lg:text-[11px] font-sans-clean tracking-[0.24em] uppercase text-[#eeefef]/80 font-medium">
                  {item.tagline}
                </p>

                {/* Location & Year info */}
                <p className="text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#caccca]/70 mt-1">
                  {item.location} · {item.year}
                </p>
              </div>

              {/* Subtle border highlight line on hover */}
              <div className="absolute inset-0 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Bottom Bar: Copyright & Progress Scrub Bar */}
      <footer
        id="layout-a-footer"
        className="fixed bottom-0 left-0 right-0 z-30 px-6 md:px-10 py-3.5 sm:py-4 bg-[#eeefef]/92 backdrop-blur-md border-t border-[#caccca] flex flex-wrap items-center justify-between gap-4 text-[#3e4143] text-[11px] tracking-wider font-sans-clean pointer-events-auto shadow-xs"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[#18191b] font-medium">{footerText}</span>
        </div>

        {/* Elongated Fluid Progress Slider Line & Dynamic Counter (01. / 12.) */}
        <div className="flex items-center gap-3 sm:gap-4.5">
          <span className="text-[11px] font-mono tracking-widest text-[#18191b] font-semibold tabular-nums min-w-[58px]">
            {formatIndex(currentIndex)} / {totalItems < 10 ? `0${totalItems}.` : `${totalItems}.`}
          </span>

          {/* Elongated Interactive Fluid Scrub Bar - Click or drag anywhere to scrub */}
          <div
            id="layout-a-scrub-bar"
            role="slider"
            aria-label="Portfolio scroll progress"
            aria-valuenow={Math.round(fluidPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={(e) => {
              isDraggingScrubRef.current = true;
              handleScrubInteraction(e.clientX, e.currentTarget);
            }}
            onPointerMove={(e) => {
              if (isDraggingScrubRef.current) {
                handleScrubInteraction(e.clientX, e.currentTarget);
              }
            }}
            className="relative w-44 sm:w-64 md:w-80 lg:w-[420px] xl:w-[500px] 2xl:w-[580px] h-6 flex items-center cursor-pointer group/progress select-none touch-none"
            title="Drag or click to jump across portfolio"
          >
            {/* Track Background */}
            <div className="relative w-full h-[3px] group-hover/progress:h-[5px] bg-[#caccca] group-hover/progress:bg-[#8c8e90] rounded-full transition-all duration-200">
              {/* Fluid Active Fill - 100% full at panel 12 */}
              <div
                className="h-full bg-[#18191b] rounded-full transition-[width] duration-75 ease-out shadow-[0_0_6px_rgba(24,25,27,0.3)]"
                style={{
                  width: `${fluidPercentage}%`,
                }}
              />
              {/* Subtle thumb indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#18191b] shadow-[0_0_8px_rgba(24,25,27,0.4)] opacity-90 group-hover/progress:opacity-100 group-hover/progress:scale-125 transition-transform pointer-events-none"
                style={{
                  left: `${fluidPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* Scroll Hint */}
          <span className="hidden md:inline text-[9px] uppercase tracking-widest text-[#8c8e90] font-sans-clean">
            Scroll or drag
          </span>
        </div>
      </footer>
    </div>
  );
};


