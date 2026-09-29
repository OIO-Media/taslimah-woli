'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Briefcase } from 'lucide-react';
import { AssignmentProject } from '@/lib/assignments-data';
import { optimizeImageUrl, DARK_BLUR_DATA_URL } from '@/lib/image-utils';

interface AssignmentCoverflowCarouselProps {
  assignments: AssignmentProject[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelectProject: (project: AssignmentProject) => void;
}

const OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

export const AssignmentCoverflowCarousel: React.FC<AssignmentCoverflowCarouselProps> = ({
  assignments,
  activeIndex,
  onActiveIndexChange,
  onSelectProject,
}) => {
  const total = assignments.length;
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Virtual index keeps track of infinite linear progress (0, 1, 2, 3... or -1, -2...)
  // so cards ALWAYS slide in the correct physical direction without wraparound jumps.
  const [virtualIndex, setVirtualIndex] = useState<number>(activeIndex);
  const virtualIndexRef = useRef<number>(virtualIndex);
  const lastReportedActiveIndexRef = useRef<number>(activeIndex);

  useEffect(() => {
    virtualIndexRef.current = virtualIndex;
  }, [virtualIndex]);

  // Responsive screen detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all cover images
  useEffect(() => {
    assignments.forEach((assignment) => {
      const img = new window.Image();
      img.src = assignment.coverImage;
    });
  }, [assignments]);

  // Synchronize when activeIndex changes from outside without causing cascading effect renders
  useEffect(() => {
    if (lastReportedActiveIndexRef.current === activeIndex) {
      return;
    }
    lastReportedActiveIndexRef.current = activeIndex;
    const currentActive = ((virtualIndexRef.current % total) + total) % total;
    if (currentActive !== activeIndex) {
      let delta = activeIndex - currentActive;
      if (delta > total / 2) delta -= total;
      if (delta < -total / 2) delta += total;
      const nextV = virtualIndexRef.current + delta;
      virtualIndexRef.current = nextV;
      setVirtualIndex(nextV);
    }
  }, [activeIndex, total]);

  // Navigation functions: smooth single-step increments/decrements
  const changeVirtualIndex = useCallback(
    (offsetDelta: number) => {
      const nextV = virtualIndexRef.current + offsetDelta;
      virtualIndexRef.current = nextV;
      setVirtualIndex(nextV);
      const nextActive = ((nextV % total) + total) % total;
      lastReportedActiveIndexRef.current = nextActive;
      onActiveIndexChange(nextActive);
    },
    [total, onActiveIndexChange]
  );

  const handlePrev = useCallback(() => {
    changeVirtualIndex(-1);
  }, [changeVirtualIndex]);

  const handleNext = useCallback(() => {
    changeVirtualIndex(1);
  }, [changeVirtualIndex]);

  const handleShift = useCallback(
    (offsetDelta: number) => {
      changeVirtualIndex(offsetDelta);
    },
    [changeVirtualIndex]
  );

  const handleJumpTo = useCallback(
    (targetIndex: number) => {
      const currentActive = ((virtualIndexRef.current % total) + total) % total;
      let delta = targetIndex - currentActive;
      if (delta > total / 2) delta -= total;
      if (delta < -total / 2) delta += total;
      const nextV = virtualIndexRef.current + delta;
      virtualIndexRef.current = nextV;
      setVirtualIndex(nextV);
      lastReportedActiveIndexRef.current = targetIndex;
      onActiveIndexChange(targetIndex);
    },
    [total, onActiveIndexChange]
  );

  // Keyboard navigation
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
        const currentActive = ((virtualIndexRef.current % total) + total) % total;
        onSelectProject(assignments[currentActive]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onSelectProject, assignments, total]);

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
      const THRESHOLD = 46;

      if (Math.abs(accumulatedDeltaRef.current) >= THRESHOLD && timeSinceLast > 240) {
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

  // Active assignment and dimensions
  const currentActiveIndex = ((virtualIndex % total) + total) % total;
  const activeAssignment = assignments[currentActiveIndex];

  // Card dimensions and uniform spacing step
  const cardWidth = isMobile ? 270 : 330;
  const cardHeight = isMobile ? 390 : 480;
  const spacing = isMobile ? 180 : 255;

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
      className="relative w-full select-none overflow-hidden py-8 sm:py-12 md:py-16 focus:outline-none touch-pan-y"
      tabIndex={0}
      role="region"
      aria-label="Assignments coverflow carousel"
    >
      {/* Ambient Radial Glow behind the active card */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] sm:w-[650px] md:w-[800px] h-[350px] sm:h-[450px] rounded-full bg-radial from-amber-900/10 sm:from-amber-900/15 via-[#18191b]/5 to-transparent blur-3xl transform -translate-y-4" />
      </div>

      {/* Main Coverflow Viewport with 3D perspective */}
      <motion.div
        className="relative mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          height: cardHeight + 40,
          perspective: 1200,
          transformStyle: 'preserve-3d',
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
        {OFFSETS.map((k) => {
          const slotVirtualIndex = virtualIndex + k;
          const assignmentIndex = ((slotVirtualIndex % total) + total) % total;
          const assignment = assignments[assignmentIndex];
          const isActive = k === 0;
          const absK = Math.abs(k);

          // Uniform linear step so every card moves at the exact same physical speed
          const xOffset = k * spacing;

          // Smooth scale progression
          let scale = 1.0;
          if (absK === 1) scale = isMobile ? 0.85 : 0.84;
          else if (absK === 2) scale = isMobile ? 0.70 : 0.68;
          else if (absK >= 3) scale = 0.52;

          // Fade out edges smoothly
          let opacity = 1.0;
          if (absK === 1) opacity = 0.75;
          else if (absK === 2) opacity = 0.38;
          else if (absK >= 3) opacity = 0.0;

          // 3D rotation turning cards towards the center
          let rotateY = 0;
          if (k < 0) rotateY = Math.min(20, 13 + (absK - 1) * 5);
          else if (k > 0) rotateY = Math.max(-20, -13 - (absK - 1) * 5);

          // Layering: active card sits highest
          const zIndex = 40 - absK * 10;

          return (
            <motion.div
              key={slotVirtualIndex}
              onClick={() => {
                if (isSwipingRef.current) return;
                if (isActive) {
                  onSelectProject(assignment);
                } else {
                  handleShift(k);
                }
              }}
              className="absolute cursor-pointer will-change-transform"
              style={{
                width: cardWidth,
                height: cardHeight,
                zIndex,
                transformStyle: 'preserve-3d',
                pointerEvents: absK >= 3 ? 'none' : 'auto',
              }}
              animate={{
                x: prefersReducedMotion ? 0 : xOffset,
                scale: prefersReducedMotion ? 1 : scale,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                opacity,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.44,
                ease: [0.16, 1, 0.3, 1], // Velvet smooth Apple-grade curve
              }}
              whileHover={
                isActive
                  ? { scale: prefersReducedMotion ? 1 : 1.025 }
                  : { opacity: Math.min(opacity + 0.15, 0.9) }
              }
              whileTap={{ scale: 0.98 }}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={`${assignment.title} by ${assignment.client} (${assignment.year}, ${assignment.photoCount} photos). ${
                isActive ? 'Click to open project album' : 'Click to bring to center'
              }`}
            >
              {/* Card Container with rounded corners & shadow */}
              <div
                className={`relative w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#18191b] transition-shadow duration-500 ${
                  isActive
                    ? 'shadow-[0_28px_65px_rgba(0,0,0,0.48)] ring-1 ring-white/30'
                    : 'shadow-[0_14px_35px_rgba(0,0,0,0.22)]'
                }`}
              >
                {/* Cover Image - Fast compositor-level CSS transitions */}
                <Image
                  src={optimizeImageUrl(assignment.coverImage, 900, 85)}
                  alt={assignment.title}
                  fill
                  priority={absK <= 1}
                  placeholder="blur"
                  blurDataURL={DARK_BLUR_DATA_URL}
                  sizes="(max-width: 640px) 270px, 330px"
                  className={`object-cover object-center transition-[filter] duration-500 ease-out ${
                    isActive ? 'grayscale-0 contrast-100' : 'grayscale contrast-[0.95]'
                  }`}
                />

                {/* Dark overlay for inactive cards */}
                <div
                  className={`absolute inset-0 bg-black/25 transition-opacity duration-400 pointer-events-none ${
                    isActive ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Subtle Inner Border */}
                <div className="absolute inset-0 rounded-[24px] sm:rounded-[28px] ring-1 ring-inset ring-white/15 pointer-events-none" />

                {/* Top Badges: Project Number & Format Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] tracking-widest font-sans-clean font-bold uppercase text-white/90 shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{assignment.number}</span>
                  </div>

                  <div className="bg-amber-950/70 backdrop-blur-md border border-amber-400/30 px-2.5 py-1 rounded-full text-[10px] font-sans-clean font-bold text-amber-200 shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <span>{assignment.formatBadge || 'COMMISSION'}</span>
                  </div>
                </div>

                {/* Active Card Glow Accent */}
                {isActive && (
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/35 pointer-events-none" />
                )}

                {/* Bottom Information Gradient */}
                <div className="absolute inset-x-0 bottom-0 pt-24 pb-5 px-5 sm:px-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white flex flex-col justify-end">
                  {/* Commissioning Client Highlight */}
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-amber-300 font-sans-clean font-semibold mb-1">
                    <Briefcase className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{assignment.client}</span>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-light tracking-wide text-white leading-tight mb-2.5 line-clamp-2">
                    {assignment.title}
                  </h3>

                  {/* Metadata Chips: Location & Plates */}
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-sans-clean font-medium">
                    <span className="bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-md text-white/90 border border-white/10 truncate max-w-[120px]">
                      {assignment.location}
                    </span>
                    <span className="bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-md text-white/90 border border-white/10">
                      {assignment.photoCount} Plates
                    </span>
                    {isActive && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-amber-300 flex items-center gap-0.5 group-hover:text-white transition-colors">
                        <span>Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating Arrow Navigation Buttons (Desktop / Tablet) */}
      <div className="hidden sm:flex absolute inset-y-0 left-4 sm:left-8 md:left-14 items-center pointer-events-none">
        <button
          onClick={handlePrev}
          aria-label="Previous assignment"
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#18191b]/80 hover:bg-[#18191b] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#18191b]"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>
      </div>

      <div className="hidden sm:flex absolute inset-y-0 right-4 sm:right-8 md:right-14 items-center pointer-events-none">
        <button
          onClick={handleNext}
          aria-label="Next assignment"
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#18191b]/80 hover:bg-[#18191b] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#18191b]"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>
      </div>

      {/* Active Assignment Action Button & Mobile Controls */}
      <div className="mt-6 sm:mt-8 text-center px-4 flex items-center justify-center gap-2 sm:gap-4">
        {/* Mobile Prev Tap Target */}
        <button
          onClick={handlePrev}
          aria-label="Previous assignment"
          className="sm:hidden w-10 h-10 rounded-full bg-[#18191b] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectProject(activeAssignment)}
          className="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] text-[11px] sm:text-xs font-sans-clean tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#18191b] max-w-[270px] sm:max-w-none truncate"
        >
          <span className="truncate">Explore Album ({activeAssignment.photoCount} Plates)</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-amber-400" />
        </button>

        {/* Mobile Next Tap Target */}
        <button
          onClick={handleNext}
          aria-label="Next assignment"
          className="sm:hidden w-10 h-10 rounded-full bg-[#18191b] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div
        className="mt-6 flex items-center justify-center gap-2.5 sm:gap-3"
        role="tablist"
        aria-label="Assignment pagination"
      >
        {assignments.map((assignment, idx) => {
          const isActive = idx === currentActiveIndex;
          return (
            <button
              key={assignment.id}
              onClick={() => handleJumpTo(idx)}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-amber-700'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#caccca] hover:bg-[#8c8e90]'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-label={`Jump to ${assignment.title}`}
            />
          );
        })}
      </div>
    </div>
  );
};
