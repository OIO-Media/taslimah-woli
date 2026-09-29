'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Camera, Maximize2, X, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react';
import { StoryProject, StoryPhoto } from '@/lib/stories-data';
import { optimizeImageUrl, DARK_BLUR_DATA_URL } from '@/lib/image-utils';
import { PortfolioImage } from '@/components/ui/PortfolioImage';

interface StoryDetailViewProps {
  project: StoryProject;
  onBack: () => void;
  onNavigateToProject: (projectId: string) => void;
  allProjects: StoryProject[];
}

export const StoryDetailView: React.FC<StoryDetailViewProps> = ({
  project,
  onBack,
  onNavigateToProject,
  allProjects,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhotoIndex]);

  // Touch gesture tracking for mobile swipe navigation
  const lightboxTouchStartXRef = React.useRef<number | null>(null);
  const lightboxTouchStartYRef = React.useRef<number | null>(null);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartXRef.current = e.touches[0].clientX;
    lightboxTouchStartYRef.current = e.touches[0].clientY;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartXRef.current === null || lightboxTouchStartYRef.current === null) return;
    const diffX = lightboxTouchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = lightboxTouchStartYRef.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe left -> Next photo
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % project.photos.length : null));
      } else {
        // Swipe right -> Prev photo
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + project.photos.length) % project.photos.length : null
        );
      }
    } else if (diffY < -70 && Math.abs(diffY) > Math.abs(diffX)) {
      // Swipe down -> Dismiss lightbox
      setSelectedPhotoIndex(null);
    }

    lightboxTouchStartXRef.current = null;
    lightboxTouchStartYRef.current = null;
  };

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [selectedPhotoIndex]);

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + project.photos.length) % project.photos.length : null
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev + 1) % project.photos.length : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, project.photos.length]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen bg-[#eeefef] text-[#18191b]"
    >
      {/* Top Sticky Breadcrumb & Back Bar */}
      <div className="sticky top-16 md:top-18 z-30 bg-[#eeefef]/90 backdrop-blur-md border-b border-[#caccca] px-6 sm:px-10 lg:px-16 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 text-xs font-sans-clean tracking-widest uppercase text-[#18191b] hover:text-[#3e4143] transition-colors focus:outline-none"
        >
          <span className="w-7 h-7 rounded-full bg-[#18191b] text-[#eeefef] group-hover:bg-[#3e4143] flex items-center justify-center transition-colors shadow-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold">Return to Stories Carousel</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#caccca] bg-white/70 hover:bg-[#18191b] hover:text-white text-xs font-sans-clean tracking-wider uppercase transition-all shadow-2xs"
            aria-label="Share story link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 sm:pt-12 pb-24">
        {/* Project Header Info */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.26em] uppercase text-[#8c8e90] font-sans-clean font-medium mb-3">
            <span>STORY {project.number}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#18191b]" />
              {project.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#18191b]" />
              {project.year}
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#18191b] leading-[1.08] tracking-tight uppercase mb-4">
            {project.title}
          </h1>

          <p className="font-serif-luxury text-xl sm:text-2xl text-[#3e4143] italic max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </header>

        {/* Expanded Hero Image (Connected with the Card Cover) */}
        <motion.div
          layoutId={`card-${project.id}`}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#18191b] shadow-2xl border border-[#caccca] mb-12 sm:mb-16 group"
        >
          <PortfolioImage
            src={project.coverImage}
            alt={project.title}
            context="hero"
            priority
            className="filter contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

          {/* Bottom Banner Over Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
            <div className="max-w-xl">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-sans-clean font-medium mb-1">
                EXHIBITION MONOGRAPH
              </div>
              <p className="text-sm sm:text-base font-sans-clean text-white/95 leading-snug">
                {project.leadParagraph}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPhotoIndex(0)}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#18191b] backdrop-blur-md border border-white/30 text-xs font-sans-clean tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Lightbox</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Two-Column Editorial Narrative & Technical Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b border-[#caccca] mb-16 sm:mb-20">
          <div className="lg:col-span-8 space-y-6 text-[#3e4143] font-sans-clean text-base sm:text-lg leading-[1.8] font-normal">
            {project.narrative.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="lg:col-span-4 bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#caccca] space-y-5 h-fit shadow-xs">
            <div className="text-[10px] tracking-[0.24em] uppercase text-[#8c8e90] font-sans-clean font-semibold">
              TECHNICAL SPECIFICATIONS
            </div>

            <div className="space-y-3.5 text-xs font-sans-clean">
              <div className="flex items-start gap-2.5">
                <Camera className="w-4 h-4 text-[#18191b] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[#8c8e90] uppercase text-[10px]">Principal Rig</div>
                  <div className="text-[#18191b] font-medium">{project.camera}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#18191b] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[#8c8e90] uppercase text-[10px]">Territory</div>
                  <div className="text-[#18191b] font-medium">{project.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#18191b] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[#8c8e90] uppercase text-[10px]">Production Period</div>
                  <div className="text-[#18191b] font-medium">{project.year}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#caccca]/60 text-[11px] text-[#8c8e90] leading-relaxed">
              Archival silver gelatin and high-fidelity Giclée pigment editions are produced on Hahnemühle Photo Rag Baryta 315gsm.
            </div>
          </div>
        </div>

        {/* Complete Album Gallery Section */}
        <section className="mb-20 sm:mb-24">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.26em] text-[#8c8e90] font-sans-clean font-medium mb-1">
                CURATED ALBUM
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18191b] font-light uppercase">
                All Project Frames ({project.photos.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {project.photos.map((photo, pIdx) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(pIdx)}
                className="group cursor-pointer space-y-3"
              >
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-[20px] overflow-hidden bg-[#18191b] border border-[#caccca] shadow-md transition-all duration-500 group-hover:shadow-2xl">
                  <PortfolioImage
                    src={photo.url}
                    alt={photo.caption}
                    context="grid"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="filter contrast-[1.03] transition-transform duration-700 group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors pointer-events-none" />

                  {/* Expand badge */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="px-1">
                  <div className="font-serif-luxury text-lg text-[#18191b] font-medium leading-snug">
                    {photo.caption}
                  </div>
                  {photo.exif && (
                    <div className="text-xs font-sans-clean text-[#8c8e90] tracking-wide mt-1">
                      {photo.exif}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Story Navigation: Next and Previous Stories */}
        <section className="pt-12 border-t border-[#caccca]">
          <div className="text-xs uppercase tracking-[0.26em] text-[#8c8e90] font-sans-clean font-medium mb-6 text-center">
            CONTINUE THE MONOGRAPH SERIES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Prev Project Card */}
            <div
              onClick={() => onNavigateToProject(prevProject.id)}
              className="group cursor-pointer rounded-2xl p-5 border border-[#caccca] bg-white/50 hover:bg-[#18191b] hover:text-[#eeefef] transition-all duration-300 flex items-center gap-4 shadow-xs hover:shadow-xl"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0">
                <Image
                  src={optimizeImageUrl(prevProject.coverImage, 300, 80)}
                  alt={prevProject.title}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-[#8c8e90] group-hover:text-white/60 mb-0.5">
                  ← PREVIOUS STORY
                </div>
                <div className="font-serif-luxury text-xl font-light truncate">
                  {prevProject.title}
                </div>
                <div className="text-xs font-sans-clean text-[#8c8e90] group-hover:text-white/70">
                  {prevProject.location} · {prevProject.year}
                </div>
              </div>
            </div>

            {/* Next Project Card */}
            <div
              onClick={() => onNavigateToProject(nextProject.id)}
              className="group cursor-pointer rounded-2xl p-5 border border-[#caccca] bg-white/50 hover:bg-[#18191b] hover:text-[#eeefef] transition-all duration-300 flex items-center justify-between gap-4 shadow-xs hover:shadow-xl text-right"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-[#8c8e90] group-hover:text-white/60 mb-0.5">
                  NEXT STORY →
                </div>
                <div className="font-serif-luxury text-xl font-light truncate">
                  {nextProject.title}
                </div>
                <div className="text-xs font-sans-clean text-[#8c8e90] group-hover:text-white/70">
                  {nextProject.location} · {nextProject.year}
                </div>
              </div>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0">
                <Image
                  src={optimizeImageUrl(nextProject.coverImage, 300, 80)}
                  alt={nextProject.title}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onBack}
              className="px-8 py-3 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] text-xs font-sans-clean tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none"
            >
              Return to Stories Coverflow
            </button>
          </div>
        </section>
      </div>

      {/* Lightbox Modal for any photo in the album */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setSelectedPhotoIndex(null)}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Top Toolbar */}
            <div
              className="flex items-center justify-between text-white/80 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-sans-clean tracking-widest uppercase">
                <span>{project.title}</span> — Frame {selectedPhotoIndex + 1} of{' '}
                {project.photos.length}
              </div>

              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image in Lightbox */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
                <PortfolioImage
                  src={project.photos[selectedPhotoIndex].url}
                  alt={project.photos[selectedPhotoIndex].caption}
                  context="lightbox"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Prev / Next Arrows */}
              <button
                onClick={() =>
                  setSelectedPhotoIndex(
                    (selectedPhotoIndex - 1 + project.photos.length) % project.photos.length
                  )
                }
                className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setSelectedPhotoIndex((selectedPhotoIndex + 1) % project.photos.length)
                }
                className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption and EXIF */}
            <div
              className="text-center text-white max-w-2xl mx-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-serif-luxury text-lg sm:text-xl font-light">
                {project.photos[selectedPhotoIndex].caption}
              </div>
              {project.photos[selectedPhotoIndex].exif && (
                <div className="text-xs font-sans-clean text-white/60 tracking-wider mt-1">
                  {project.photos[selectedPhotoIndex].exif}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
