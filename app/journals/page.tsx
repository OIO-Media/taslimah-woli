'use client';

import React, { useState, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { JournalsCarousel } from '@/components/journals/JournalsCarousel';
import { JournalReadingView } from '@/components/journals/JournalReadingView';
import { JOURNALS_DATA, JournalEntry } from '@/lib/journals-data';
import { usePublishedContent } from '@/lib/cms-store';
import { cmsJournalToPublic } from '@/lib/cms-adapters';

function JournalsContent() {
  const searchParams = useSearchParams();
  const journalQuery = searchParams.get('journal');

  const cms = usePublishedContent();
  const allJournals = useMemo(() => {
    const cmsJournals = cms.journals
      .filter((j) => j.status === 'published')
      .map((j, i) => cmsJournalToPublic(j, i));
    return cmsJournals.length > 0 ? cmsJournals : JOURNALS_DATA;
  }, [cms.journals]);

  // Derive initial active journal and index from URL query param if present
  const initialJournal = journalQuery
    ? allJournals.find((j) => j.id === journalQuery) || null
    : null;
  const initialIndex = initialJournal
    ? Math.max(0, allJournals.findIndex((j) => j.id === initialJournal.id))
    : 0;

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    initialJournal ? initialJournal.id : null
  );
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const selectedJournal = selectedJournalId
    ? allJournals.find((j) => j.id === selectedJournalId) || null
    : null;

  // Handle opening a journal into the reading page
  const handleSelectJournal = useCallback((journal: JournalEntry) => {
    setSelectedJournalId(journal.id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('journal', journal.id);
      window.history.pushState({}, '', url.toString());
    } catch {
      // Non-browser fallback
    }
  }, []);

  // Handle returning from reading page back to the carousel with the same card active
  const handleBackToCarousel = useCallback(() => {
    setSelectedJournalId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('journal');
      window.history.pushState({}, '', url.toString());
    } catch {
      // Non-browser fallback
    }
  }, []);

  // Handle next/prev chapter navigation within reading page
  const handleNavigateToJournal = useCallback((journalId: string) => {
    setSelectedJournalId(journalId);
    const idx = allJournals.findIndex((j) => j.id === journalId);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('journal', journalId);
      window.history.pushState({}, '', url.toString());
    } catch {
      // Non-browser fallback
    }
  }, [allJournals]);

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col selection:bg-[#18191b] selection:text-[#eeefef]">
      {/* Primary Navigation */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-28 md:pt-32 pb-14 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {selectedJournal ? (
            // PART 2: Reading Page View
            <motion.div
              key={`reading-${selectedJournal.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <JournalReadingView
                journal={selectedJournal}
                onBack={handleBackToCarousel}
                onNavigateToJournal={handleNavigateToJournal}
                allJournals={allJournals}
              />
            </motion.div>
          ) : (
            // PART 1: Journals Staggered Coverflow Carousel
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col"
            >
              {/* Part 1: Staggered Portrait Coverflow Carousel */}
              <JournalsCarousel
                journals={allJournals}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                onSelectJournal={handleSelectJournal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default function JournalsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eeefef] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#18191b] border-t-transparent animate-spin" />
        </div>
      }
    >
      <JournalsContent />
    </Suspense>
  );
}
