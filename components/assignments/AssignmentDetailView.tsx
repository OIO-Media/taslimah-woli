'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Building2,
  Briefcase,
  Layers,
} from 'lucide-react';
import { AssignmentProject, AssignmentPhoto } from '@/lib/assignments-data';
import { optimizeImageUrl, DARK_BLUR_DATA_URL } from '@/lib/image-utils';
import { PortfolioImage } from '@/components/ui/PortfolioImage';

interface AssignmentDetailViewProps {
  project: AssignmentProject;
  onBack: () => void;
  onNavigateToProject: (projectId: string) => void;
  allProjects: AssignmentProject[];
}

export const AssignmentDetailView: React.FC<AssignmentDetailViewProps> = ({
  project,
  onBack,
  onNavigateToProject,
  allProjects,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Touch gesture handling for mobile lightbox swipe
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
          <span className="font-semibold hidden sm:inline">Return to Assignments Carousel</span>
          <span className="font-semibold sm:hidden">Return to Carousel</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#caccca] bg-white/70 hover:bg-[#18191b] hover:text-white text-xs font-sans-clean tracking-wider uppercase transition-all shadow-2xs"
            aria-label="Share assignment link"
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
            <span className="text-[#18191b] font-semibold">ASSIGNMENT {project.number}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <Briefcase className="w-3 h-3" />
              {project.client}
            </span>
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

        {/* Expanded Hero Image */}
        <motion.div
          layoutId={`assignment-card-${project.id}`}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#18191b] shadow-2xl border border-[#caccca] mb-12 sm:mb-16 group"
        >
          <PortfolioImage
            src={project.coverImage}
            alt={project.title}
            context="hero"
            priority
            className="filter contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

          {/* Bottom Banner Over Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
            <div className="max-w-xl">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300 font-sans-clean font-semibold mb-1">
                COMMISSIONED EDITORIAL & BRIEF
              </div>
              <p className="text-sm sm:text-base font-sans-clean text-white/95 leading-snug">
                {project.leadParagraph}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPhotoIndex(0)}
                className="px-5 py-2.5 rounded-full bg-white text-[#18191b] hover:bg-[#eeefef] text-xs font-sans-clean tracking-wider uppercase font-semibold flex items-center gap-2 transition-all shadow-lg hover:scale-105"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Launch Gallery</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Technical Ledger & Client Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pb-14 sm:pb-20 border-b border-[#caccca]">
          {/* Commission Metadata Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[#caccca] space-y-5 text-xs font-sans-clean shadow-2xs">
              <h2 className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#18191b] border-b border-[#caccca] pb-3 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                <span>Commission Profile</span>
              </h2>

              <div>
                <span className="text-[#8c8e90] uppercase tracking-wider block text-[10px]">CLIENT</span>
                <span className="text-[#18191b] font-medium text-sm block mt-0.5">{project.client}</span>
              </div>

              <div>
                <span className="text-[#8c8e90] uppercase tracking-wider block text-[10px]">COMMISSION TYPE</span>
                <span className="text-[#18191b] font-medium block mt-0.5">{project.commissionType}</span>
              </div>

              {project.publishedIn && (
                <div>
                  <span className="text-[#8c8e90] uppercase tracking-wider block text-[10px]">PUBLICATION / CAMPAIGN</span>
                  <span className="text-[#18191b] font-medium block mt-0.5">{project.publishedIn}</span>
                </div>
              )}

              {project.artDirector && (
                <div>
                  <span className="text-[#8c8e90] uppercase tracking-wider block text-[10px]">ART DIRECTION</span>
                  <span className="text-[#18191b] font-medium block mt-0.5">{project.artDirector}</span>
                </div>
              )}

              <div>
                <span className="text-[#8c8e90] uppercase tracking-wider block text-[10px]">PRIMARY INSTRUMENT</span>
                <span className="text-[#18191b] font-medium block mt-0.5">{project.camera}</span>
              </div>

              <div>
                <span className="text-[#8c8e90] uppercase tracking-wider block text-[10px]">CURATED FRAMES</span>
                <span className="text-[#18191b] font-medium block mt-0.5">
                  {project.photoCount} Exhibition Plates
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xs uppercase tracking-[0.24em] font-sans-clean text-[#8c8e90] font-medium">
              THE CREATIVE BRIEF & PRODUCTION
            </h2>

            <div className="space-y-5 text-base sm:text-lg font-serif-luxury text-[#3e4143] leading-relaxed">
              {project.narrative.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Curated Gallery Exhibition Frames */}
        <section className="pt-14 sm:pt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] font-sans-clean text-[#8c8e90] mb-2 font-medium">
                COMMISSION PORTFOLIO
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18191b] font-light uppercase">
                EXHIBITION PLATES ({project.photos.length})
              </h2>
            </div>

            <p className="text-xs text-[#8c8e90] font-sans-clean">
              Click any plate to open full-resolution inspection viewer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {project.photos.map((photo, index) => {
              const isLandscape = photo.aspect === 'landscape';
              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`group relative cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden border border-[#caccca] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    isLandscape && index % 3 === 0 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div
                    className={`relative w-full bg-[#18191b] overflow-hidden ${
                      isLandscape ? 'aspect-[16/10]' : 'aspect-[4/5]'
                    }`}
                  >
                    <PortfolioImage
                      src={photo.url}
                      alt={photo.caption}
                      context="grid"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                      className="group-hover:scale-103 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/90 text-[#18191b] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-5 h-5" />
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-sans-clean font-bold text-white border border-white/15">
                      PLATE {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <p className="font-serif-luxury text-sm sm:text-base text-[#18191b] font-normal leading-snug mb-2">
                      {photo.caption}
                    </p>

                    {photo.exif && (
                      <div className="text-[10px] sm:text-[11px] font-sans-clean text-[#8c8e90] uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-3 h-3 text-[#18191b]" />
                        <span>{photo.exif}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Project Next / Previous Navigation Footer */}
        <nav className="mt-20 pt-10 border-t border-[#caccca] flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={() => onNavigateToProject(prevProject.id)}
            className="group flex items-center gap-4 text-left p-4 rounded-2xl hover:bg-white transition-colors w-full sm:w-auto"
          >
            <span className="w-10 h-10 rounded-full border border-[#caccca] bg-white group-hover:bg-[#18191b] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8c8e90] block font-sans-clean">
                Previous Assignment
              </span>
              <span className="font-serif-luxury text-base text-[#18191b] group-hover:underline">
                {prevProject.title}
              </span>
            </div>
          </button>

          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-full border border-[#18191b] text-xs font-sans-clean tracking-widest uppercase hover:bg-[#18191b] hover:text-white transition-colors"
          >
            All Assignments
          </button>

          <button
            onClick={() => onNavigateToProject(nextProject.id)}
            className="group flex items-center gap-4 text-right p-4 rounded-2xl hover:bg-white transition-colors w-full sm:w-auto sm:flex-row-reverse"
          >
            <span className="w-10 h-10 rounded-full border border-[#caccca] bg-white group-hover:bg-[#18191b] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8c8e90] block font-sans-clean">
                Next Assignment
              </span>
              <span className="font-serif-luxury text-base text-[#18191b] group-hover:underline">
                {nextProject.title}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 select-none"
            onClick={() => setSelectedPhotoIndex(null)}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between text-white/80 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs tracking-widest uppercase font-sans-clean">
                <span className="text-white font-medium">{project.title}</span>
                <span className="mx-2 text-white/40">/</span>
                <span className="text-amber-400 font-medium">{project.client}</span>
                <span className="mx-2 text-white/40">/</span>
                <span>
                  Plate {selectedPhotoIndex + 1} of {project.photos.length}
                </span>
              </div>

              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Center Image */}
            <div
              className="relative flex-1 w-full max-h-[78vh] my-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-5xl">
                <PortfolioImage
                  src={project.photos[selectedPhotoIndex].url}
                  alt={project.photos[selectedPhotoIndex].caption}
                  context="lightbox"
                  priority
                  className="object-contain"
                />
              </div>

              {/* Prev / Next Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(
                    (selectedPhotoIndex - 1 + project.photos.length) % project.photos.length
                  );
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all focus:outline-none"
                aria-label="Previous plate"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((selectedPhotoIndex + 1) % project.photos.length);
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all focus:outline-none"
                aria-label="Next plate"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & EXIF */}
            <div
              className="text-center max-w-2xl mx-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white text-sm sm:text-base font-serif-luxury mb-1">
                {project.photos[selectedPhotoIndex].caption}
              </p>
              {project.photos[selectedPhotoIndex].exif && (
                <p className="text-[11px] font-mono text-white/60">
                  {project.photos[selectedPhotoIndex].exif}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
