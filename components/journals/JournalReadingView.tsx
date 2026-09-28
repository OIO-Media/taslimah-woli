'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
} from 'lucide-react';
import { JournalEntry, JOURNALS_DATA } from '@/lib/journals-data';
import { optimizeImageUrl, DARK_BLUR_DATA_URL } from '@/lib/image-utils';

interface JournalReadingViewProps {
  journal: JournalEntry;
  onBack: () => void;
  onNavigateToJournal: (journalId: string) => void;
  allJournals?: JournalEntry[];
}

export const JournalReadingView: React.FC<JournalReadingViewProps> = ({
  journal,
  onBack,
  onNavigateToJournal,
  allJournals = JOURNALS_DATA,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (window.scrollY / docHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top upon opening
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [journal.id, prefersReducedMotion]);

  // Find adjacent chapters
  const currentIndex = allJournals.findIndex((j) => j.id === journal.id);
  const prevJournal = currentIndex > 0 ? allJournals[currentIndex - 1] : null;
  const nextJournal = currentIndex < allJournals.length - 1 ? allJournals[currentIndex + 1] : null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${journal.chapterLabel}: ${journal.title}`,
          text: journal.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {
      // User cancelled or clipboard not permitted
    }
  };

  return (
    <div className="relative w-full pb-28">
      {/* Thin Reading Progress Bar fixed at top of screen */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#caccca]/40">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${readingProgress}%`,
            backgroundColor: journal.accentColor,
            boxShadow: `0 0 10px ${journal.accentGlow}`,
          }}
        />
      </div>

      {/* Main Reading Column: generous whitespace and 680-720px comfortable reading width */}
      <article className="max-w-[720px] mx-auto px-5 sm:px-8 pt-4 sm:pt-6">
        {/* Navigation Bar: Return to Carousel */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans-clean font-semibold text-[#8c8e90] hover:text-[#18191b] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← Back to Journals</span>
          </button>

          <div className="flex items-center gap-2">

            <button
              onClick={handleShare}
              aria-label="Share journal entry"
              className="p-2 rounded-full border border-[#caccca] bg-white/60 text-[#8c8e90] hover:text-[#18191b] transition-all"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Chapter Label Pill with Accent Border */}
        <div className="mb-4">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-sans-clean font-bold uppercase tracking-widest text-white shadow-xs"
            style={{
              backgroundColor: '#18191b',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: journal.accentColor,
              boxShadow: `0 0 14px ${journal.accentGlow}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: journal.accentColor }}
            />
            <span>{journal.chapterLabel}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80 font-normal">{journal.category}</span>
          </div>
        </div>

        {/* Journal Title */}
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#18191b] leading-tight mb-4">
          {journal.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-serif-luxury italic text-[#8c8e90] leading-relaxed mb-6">
          {journal.subtitle}
        </p>

        {/* Article Metadata: Date, Reading Time, Last Updated Badge */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-sans-clean tracking-wider uppercase text-[#8c8e90] pb-6 border-b border-[#caccca] mb-8">
          <span className="flex items-center gap-1.5 text-[#18191b] font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{journal.date}</span>
          </span>
          <span>/</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{journal.readTime}</span>
          </span>

          {journal.lastUpdated && (
            <>
              <span>/</span>
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border"
                style={{
                  borderColor: journal.accentColor,
                  color: journal.accentColor,
                  backgroundColor: journal.accentBg,
                }}
              >
                Last Updated: {journal.lastUpdated}
              </span>
            </>
          )}
        </div>

        {/* Author Byline */}
        <div className="flex items-center gap-3.5 mb-10 p-3 rounded-xl bg-white/40 border border-[#caccca]">
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/80 shadow-xs">
            <Image
              src={optimizeImageUrl(journal.author.avatar, 200, 80)}
              alt={journal.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
              {journal.author.name}
            </div>
            <div className="font-sans-clean text-[11px] text-[#8c8e90] tracking-wide">
              {journal.author.role}
            </div>
          </div>
        </div>

        {/* Hero Cover Image: Soft Framed Print Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="my-8 sm:my-10 p-3 sm:p-4 rounded-2xl bg-white/80 border border-[#caccca] shadow-sm"
        >
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#18191b]">
            <Image
              src={optimizeImageUrl(journal.coverImage, 1200, 85)}
              alt={journal.coverImageAlt}
              fill
              priority
              placeholder="blur"
              blurDataURL={DARK_BLUR_DATA_URL}
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover object-center"
            />
          </div>
          <div className="mt-3 px-1 text-center text-xs text-[#8c8e90] font-sans-clean tracking-wider uppercase">
            {journal.coverImageAlt}
          </div>
        </motion.div>

        {/* Pull Quote Excerpt */}
        <blockquote
          className="my-10 p-6 sm:p-7 rounded-xl bg-white/50 border-l-4 font-serif-luxury italic text-lg sm:text-xl text-[#18191b] leading-relaxed shadow-xs"
          style={{
            borderLeftColor: journal.accentColor,
          }}
        >
          &ldquo;{journal.excerpt}&rdquo;
        </blockquote>

        {/* Main Article Content */}
        <div className="space-y-10">
          {/* If bodyHtml exists (CMS-authored), render it directly */}
          {(journal as any).bodyHtml ? (
            <div
              className="wysiwyg-reading-body"
              dangerouslySetInnerHTML={{ __html: (journal as any).bodyHtml }}
            />
          ) : (
            /* Fallback: legacy sections-based render */
            journal.sections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-6">
                {section.heading && (
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#18191b] tracking-wide mt-10 mb-4">
                    {section.heading}
                  </h2>
                )}

                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="font-serif-luxury text-lg sm:text-xl text-[#3e4143] font-light leading-relaxed sm:leading-loose"
                  >
                    {para}
                  </p>
                ))}

                {section.callout && (
                  <div
                    className="my-8 p-5 sm:p-6 rounded-xl border font-sans-clean text-sm sm:text-base leading-relaxed text-[#18191b] flex items-start gap-3.5 shadow-xs"
                    style={{
                      backgroundColor: journal.accentBg,
                      borderColor: journal.accentColor,
                    }}
                  >
                    <Sparkles
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: journal.accentColor }}
                    />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-xs block mb-1 text-[#18191b]">
                        Field Observation
                      </span>
                      <span className="font-serif-luxury italic text-base sm:text-lg">
                        {section.callout}
                      </span>
                    </div>
                  </div>
                )}

                {section.inlineImage && (
                  <figure className="my-8 sm:my-10 p-3 sm:p-4 rounded-2xl bg-white/80 border border-[#caccca] shadow-sm">
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#18191b]">
                      <Image
                        src={optimizeImageUrl(section.inlineImage.url, 1200, 85)}
                        alt={section.inlineImage.alt}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={DARK_BLUR_DATA_URL}
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-cover object-center"
                      />
                    </div>
                    {section.inlineImage.caption && (
                      <figcaption className="mt-3 px-1 text-center text-xs text-[#8c8e90] font-sans-clean tracking-wider uppercase">
                        {section.inlineImage.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))
          )}
        </div>

        {/* Editorial Footnote */}
        <div className="mt-14 pt-8 border-t border-[#caccca] text-xs font-sans-clean text-[#8c8e90] tracking-wider uppercase leading-relaxed">
          <p>
            Field dispatch recorded for the monograph archives. Prints and portfolio plates from this chapter are available in the{' '}
            <a
              href="/prints"
              className="text-[#18191b] underline decoration-1 underline-offset-4 font-semibold hover:opacity-75 transition-opacity"
            >
              Exhibition Print Collection
            </a>
            .
          </p>
        </div>

        {/* Next / Previous Journal Links at bottom */}
        <div className="mt-16 pt-10 border-t border-[#caccca]">
          <div className="text-xs uppercase tracking-[0.25em] font-sans-clean text-[#8c8e90] mb-6">
            CHAPTER NAVIGATION
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Previous Journal */}
            {prevJournal ? (
              <button
                onClick={() => onNavigateToJournal(prevJournal.id)}
                className="group p-4 rounded-xl border border-[#caccca] bg-white/60 hover:bg-white hover:border-[#18191b] transition-all text-left flex items-center gap-4 focus:outline-none"
              >
                <div className="relative w-14 h-20 rounded-md overflow-hidden bg-[#18191b] shrink-0 border border-black/10">
                  <Image
                    src={optimizeImageUrl(prevJournal.coverImage, 200, 80)}
                    alt={prevJournal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#8c8e90] font-sans-clean font-semibold mb-1">
                    <ChevronLeft className="w-3 h-3" />
                    <span>Previous Chapter</span>
                  </div>
                  <div className="font-serif-luxury text-sm font-medium text-[#18191b] truncate group-hover:text-black">
                    {prevJournal.title}
                  </div>
                  <div className="text-[10px] text-[#8c8e90] font-sans-clean mt-0.5">
                    {prevJournal.chapterLabel} · {prevJournal.readTime}
                  </div>
                </div>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {/* Next Journal */}
            {nextJournal ? (
              <button
                onClick={() => onNavigateToJournal(nextJournal.id)}
                className="group p-4 rounded-xl border border-[#caccca] bg-white/60 hover:bg-white hover:border-[#18191b] transition-all text-left flex items-center gap-4 sm:flex-row-reverse focus:outline-none"
              >
                <div className="relative w-14 h-20 rounded-md overflow-hidden bg-[#18191b] shrink-0 border border-black/10">
                  <Image
                    src={optimizeImageUrl(nextJournal.coverImage, 200, 80)}
                    alt={nextJournal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1 sm:text-right">
                  <div className="flex items-center gap-1 sm:justify-end text-[10px] uppercase tracking-widest text-[#8c8e90] font-sans-clean font-semibold mb-1">
                    <span>Next Chapter</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                  <div className="font-serif-luxury text-sm font-medium text-[#18191b] truncate group-hover:text-black">
                    {nextJournal.title}
                  </div>
                  <div className="text-[10px] text-[#8c8e90] font-sans-clean mt-0.5">
                    {nextJournal.chapterLabel} · {nextJournal.readTime}
                  </div>
                </div>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </div>
      </article>
    </div>
  );
};
