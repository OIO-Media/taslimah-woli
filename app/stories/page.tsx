'use client';

import React, { useState, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { CoverflowCarousel } from '@/components/stories/CoverflowCarousel';
import { StoryDetailView } from '@/components/stories/StoryDetailView';
import { StoryProject, STORIES_DATA } from '@/lib/stories-data';
import { usePublishedContent } from '@/lib/cms-store';
import { cmsStoryToPublic } from '@/lib/cms-adapters';

function StoriesContent() {
  const cms = usePublishedContent();
  const allStories = useMemo(() => {
    const cmsStories = cms.stories.filter(s => s.status === 'published').map((s, i) => cmsStoryToPublic(s, i));
    return cmsStories.length > 0 ? cmsStories : STORIES_DATA;
  }, [cms.stories]);
  const searchParams = useSearchParams();
  const projectQuery = searchParams.get('project');

  // Derive initial values from searchParams without needing an effect
  const initialProject = projectQuery ? allStories.find((s) => s.id === projectQuery) || null : null;
  const initialIndex = initialProject ? Math.max(0, allStories.findIndex((s) => s.id === initialProject.id)) : 0;

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProject ? initialProject.id : null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const selectedProject = selectedProjectId ? allStories.find((s) => s.id === selectedProjectId) || null : null;

  // Handle opening a project
  const handleSelectProject = useCallback((project: StoryProject) => {
    setSelectedProjectId(project.id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('project', project.id);
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore in non-browser context
    }
  }, []);

  // Handle returning to carousel
  const handleBackToCarousel = useCallback(() => {
    setSelectedProjectId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('project');
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore
    }
  }, []);

  // Handle switching projects from within the project page
  const handleNavigateToProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    const idx = allStories.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('project', projectId);
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore
    }
  }, [allStories]);

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col selection:bg-[#18191b] selection:text-[#eeefef]">
      {/* Top Navigation */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 md:pt-24 pb-16 flex flex-col justify-center">
        {selectedProject ? (
          // Full Project Album View
          <StoryDetailView
            project={selectedProject}
            onBack={handleBackToCarousel}
            onNavigateToProject={handleNavigateToProject}
            allProjects={allStories}
          />
        ) : (
          // Coverflow Carousel Showcase
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col">
            {/* Coverflow Carousel Component */}
            <CoverflowCarousel
              stories={allStories}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              onSelectProject={handleSelectProject}
            />
          </div>
        )}
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default function StoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eeefef] flex items-center justify-center text-xs tracking-widest uppercase font-sans-clean text-[#8c8e90]">
          Loading Stories...
        </div>
      }
    >
      <StoriesContent />
    </Suspense>
  );
}
