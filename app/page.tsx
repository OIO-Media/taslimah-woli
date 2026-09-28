'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LayoutA_Stacked } from '@/components/LayoutA_Stacked';
import { CategoryModal } from '@/components/CategoryModal';
import { SearchModal } from '@/components/SearchModal';
import { AboutContactModal, ModalTab } from '@/components/AboutContactModal';
import { PortfolioItem, PORTFOLIO_ITEMS } from '@/lib/portfolio-data';
import { usePublishedContent } from '@/lib/cms-store';
import { cmsBodyOfWorkToPortfolioItem } from '@/lib/cms-adapters';

export default function PortfolioPage() {
  const cms = usePublishedContent();
  let homeWorks = cms.bodiesOfWork
    .filter((b) => b.status === 'published')
    .map(cmsBodyOfWorkToPortfolioItem);

  if (homeWorks.length === 0) {
    homeWorks = PORTFOLIO_ITEMS;
  }
  const [selectedCategory, setSelectedCategory] = useState<PortfolioItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aboutContactOpen, setAboutContactOpen] = useState(false);
  const [aboutContactTab, setAboutContactTab] = useState<ModalTab>('about');

  const handleOpenAbout = () => {
    setAboutContactTab('about');
    setAboutContactOpen(true);
  };

  const handleOpenContact = () => {
    setAboutContactTab('contact');
    setAboutContactOpen(true);
  };

  const handleOpenJournal = () => {
    setAboutContactTab('journal');
    setAboutContactOpen(true);
  };

  const handleOpenPrints = () => {
    setAboutContactTab('prints');
    setAboutContactOpen(true);
  };

  const handleNavCategorySelect = useCallback((id: string) => {
    try {
      window.history.replaceState(null, '', `#${id}`);
    } catch {
      // Ignore
    }

    if (id === 'home') {
      setAboutContactOpen(false);
      setSelectedCategory(null);
      setIsSearchOpen(false);
      const panelsWrapper = document.getElementById('layout-a-panels-wrapper');
      if (panelsWrapper) {
        panelsWrapper.scrollTo({ left: 0, behavior: 'smooth' });
      }
      return;
    }

    if (id === 'about') {
      setSelectedCategory(null);
      setIsSearchOpen(false);
      handleOpenAbout();
      return;
    }

    if (id === 'contact') {
      setSelectedCategory(null);
      setIsSearchOpen(false);
      handleOpenContact();
      return;
    }

    if (id === 'journal' || id === 'journals') {
      setSelectedCategory(null);
      setIsSearchOpen(false);
      handleOpenJournal();
      return;
    }

    if (id === 'prints') {
      setSelectedCategory(null);
      setIsSearchOpen(false);
      handleOpenPrints();
      return;
    }

    if (id === 'stories') {
      setAboutContactOpen(false);
      setSelectedCategory(null);
      setIsSearchOpen(false);
      const firstStory = homeWorks.find((i) => i.category === 'Stories');
      if (firstStory) {
        const el = document.getElementById(`panel-${firstStory.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
          return;
        }
        setSelectedCategory(firstStory);
      }
      return;
    }

    if (id === 'assignments') {
      setAboutContactOpen(false);
      setSelectedCategory(null);
      setIsSearchOpen(false);
      const firstAssignment = homeWorks.find((i) => i.category === 'Assignments');
      if (firstAssignment) {
        const el = document.getElementById(`panel-${firstAssignment.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
          return;
        }
        setSelectedCategory(firstAssignment);
      }
      return;
    }

    const found = homeWorks.find((item) => item.id === id);
    if (found) {
      const el = document.getElementById(`panel-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        return;
      }
      setSelectedCategory(found);
    }
  }, [homeWorks]);

  // Support direct initial deep-linking or browser back/forward with hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    if (initialHash) {
      // Delay slightly for DOM mount
      const timer = setTimeout(() => {
        handleNavCategorySelect(initialHash);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [handleNavCategorySelect]);

  return (
    <main className="relative min-h-screen bg-[#eeefef] text-[#18191b] overflow-hidden">
      {/* Universal Luxury Navigation Bar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={handleNavCategorySelect}
        onOpenAbout={handleOpenAbout}
        onOpenContact={handleOpenContact}
        onOpenJournal={handleOpenJournal}
        onOpenPrints={handleOpenPrints}
      />

      {/* 2 Panels Horizontal Editorial Viewport with Spacing Between Panels */}
      <LayoutA_Stacked
        items={homeWorks}
        onSelectCategory={(item) => setSelectedCategory(item)}
      />

      {/* Interactive Category Gallery Lightbox Modal */}
      <CategoryModal
        item={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      {/* Minimal Portfolio Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCategory={(item) => setSelectedCategory(item)}
      />

      {/* Artist Biography & Studio Commission Inquiry Modal */}
      <AboutContactModal
        isOpen={aboutContactOpen}
        initialTab={aboutContactTab}
        onClose={() => setAboutContactOpen(false)}
      />
    </main>
  );
}
