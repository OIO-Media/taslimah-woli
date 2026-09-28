'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  useSiteContent,
  storyToPortfolioItem,
  assignmentToPortfolioItem,
  SiteArtistInfo,
} from '@/lib/site-content-store';
import { PortfolioItem } from '@/lib/portfolio-data';
import { StoryProject } from '@/lib/stories-data';
import { AssignmentProject } from '@/lib/assignments-data';
import { JournalEntry } from '@/lib/journals-data';
import {
  SlidersHorizontal,
  Home,
  BookOpen,
  Briefcase,
  PenTool,
  User,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  RotateCcw,
  Download,
  ExternalLink,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

type OwnerTab = 'home-works' | 'stories' | 'assignments' | 'journals' | 'contact-bio';

const PRESET_PHOTOS = [
  {
    name: 'Portrait - Craftsman',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Venice Waterways',
    url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Athletic Track Sprint',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Paris Fog Bridge',
    url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Nordic Interior Room',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Alpine Ridge Storm',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Mechanical Horology',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Kyoto Temple Garden',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Subterranean Jazz',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1400&q=75',
  },
  {
    name: 'Minimalist Sea Horizon',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=75',
  },
];

export default function OwnerManagementPage() {
  const {
    content,
    isLoaded,
    updateHomePageWorks,
    updateStories,
    updateAssignments,
    updateJournals,
    updateArtistInfo,
    resetToDefaults,
    exportBackup,
    importBackup,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<OwnerTab>('home-works');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [editingHomeWork, setEditingHomeWork] = useState<PortfolioItem | null>(null);
  const [isAddingCustomHomeWork, setIsAddingCustomHomeWork] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryProject | null>(null);
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentProject | null>(null);
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [isAddingJournal, setIsAddingJournal] = useState(false);

  const handleOpenAddCustomHomeWork = () => {
    setEditingHomeWork({
      id: `custom-${Date.now()}`,
      number: '',
      title: '',
      layoutBTitle: '',
      tagline: '',
      category: 'Stories',
      image: PRESET_PHOTOS[0].url,
      imageAlt: 'Photography work by Taslimah Woli',
      description: '',
      location: 'Nigeria',
      year: '2026',
      gallery: [],
    });
    setIsAddingCustomHomeWork(true);
  };

  const handleOpenAddStory = () => {
    setEditingStory({
      id: `story-${Date.now()}`,
      number: '',
      title: '',
      subtitle: '',
      year: '2026',
      photoCount: 4,
      location: 'Nigeria',
      camera: '35mm Field Rangefinder',
      rating: '9.5',
      formatBadge: 'DOCUMENTARY',
      coverImage: PRESET_PHOTOS[0].url,
      leadParagraph: '',
      narrative: [
        'Research-led documentary study exploring the relationships between people, vernacular architecture, and daily routines.',
      ],
      photos: [
        {
          id: 'p-1',
          url: PRESET_PHOTOS[0].url,
          caption: 'Figure in relation to courtyard architecture, morning light',
          exif: '50mm · f/2.0 · 1/250s · ISO 100',
        },
      ],
    });
    setIsAddingStory(true);
  };

  const handleOpenAddAssignment = () => {
    setEditingAssignment({
      id: `assignment-${Date.now()}`,
      number: '',
      title: '',
      subtitle: '',
      client: 'Editorial Publications & Cultural Foundations',
      commissionType: 'Spatial & Documentary Commission',
      artDirector: '',
      publishedIn: 'Selected Features & Monograph Profiles',
      year: '2026',
      photoCount: 4,
      location: 'Nigeria · Available Internationally',
      camera: '35mm Field Rangefinder',
      rating: '9.6',
      formatBadge: 'COMMISSION',
      coverImage: PRESET_PHOTOS[0].url,
      leadParagraph: '',
      narrative: [
        'Commissioned spatial documentation of built environments and inhabited memory, balancing structural geometry with human context.',
      ],
      photos: [
        {
          id: 'p-1',
          url: PRESET_PHOTOS[1].url,
          caption: 'Facade Perspective at Dawn',
          exif: '35mm · f/4.0 · 1/125s · ISO 100',
        },
      ],
    });
    setIsAddingAssignment(true);
  };

  const handleOpenAddJournal = () => {
    const nextChNum = content.journals.length + 1;
    const now = new Date();
    setEditingJournal({
      id: `journal-${Date.now()}`,
      chapterNumber: nextChNum,
      chapterLabel: `Chapter ${nextChNum}`,
      title: '',
      subtitle: '',
      category: 'Architectural Monograph',
      date: now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      shortDate: now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: '5 min read',
      accentColor: '#e05a47',
      accentGlow: 'rgba(224, 90, 71, 0.45)',
      accentBg: 'rgba(224, 90, 71, 0.12)',
      coverImage: PRESET_PHOTOS[4].url,
      coverImageAlt: 'Interior architectural light',
      excerpt: '',
      author: {
        name: 'Taslimah Woli',
        role: 'Principal Photographer',
        avatar: '/taslimah_portrait.jpg',
      },
      sections: [
        {
          heading: 'On Silence and Illumination',
          paragraphs: [
            'Standing beneath raw cast concrete in early morning light, the building acts less as an enclosure and more as a massive dial for shadows.',
          ],
        },
      ],
    });
    setIsAddingJournal(true);
  };

  const importFileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB. Please select a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
        showToast('Image uploaded successfully.');
      }
    };
    reader.readAsDataURL(file);
  };

  /* 1. HOME SELECTED WORKS HANDLERS */
  const handleMoveHomeWork = (index: number, direction: 'up' | 'down') => {
    const works = [...content.homePageWorks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= works.length) return;
    const [moved] = works.splice(index, 1);
    works.splice(targetIdx, 0, moved);
    updateHomePageWorks(works);
    showToast('Home page order updated.');
  };

  const handleRemoveHomeWork = (id: string) => {
    if (content.homePageWorks.length <= 1) {
      showToast('You must have at least one work on the home page.');
      return;
    }
    const updated = content.homePageWorks.filter((w) => w.id !== id);
    updateHomePageWorks(updated);
    showToast('Work removed from home page.');
  };

  const handleAddStoryToHome = (story: StoryProject) => {
    const alreadyExists = content.homePageWorks.some(
      (w) => w.id === `story-${story.id}` || w.title === story.title
    );
    if (alreadyExists) {
      showToast('This story is already featured on the home page.');
      return;
    }
    const converted = storyToPortfolioItem(story);
    updateHomePageWorks([...content.homePageWorks, converted]);
    showToast(`"${story.title}" added to home page selected works.`);
  };

  const handleAddAssignmentToHome = (assignment: AssignmentProject) => {
    const alreadyExists = content.homePageWorks.some(
      (w) => w.id === `assignment-${assignment.id}` || w.title === assignment.title
    );
    if (alreadyExists) {
      showToast('This assignment is already featured on the home page.');
      return;
    }
    const converted = assignmentToPortfolioItem(assignment);
    updateHomePageWorks([...content.homePageWorks, converted]);
    showToast(`"${assignment.title}" added to home page selected works.`);
  };

  const handleSaveHomeWorkEdit = (updatedItem: PortfolioItem) => {
    const updated = content.homePageWorks.map((item) =>
      item.id === updatedItem.id ? { ...updatedItem, number: '' } : item
    );
    updateHomePageWorks(updated);
    setEditingHomeWork(null);
    showToast('Work details saved.');
  };

  const handleCreateCustomHomeWork = (newItem: PortfolioItem) => {
    const cleanItem = { ...newItem, number: '' };
    updateHomePageWorks([...content.homePageWorks, cleanItem]);
    setIsAddingCustomHomeWork(false);
    showToast('New work added to home page.');
  };

  const handleResetHomeWorksToMix = () => {
    const storiesMix = content.stories.slice(0, 4).map(storyToPortfolioItem);
    const assignmentsMix = content.assignments.slice(0, 4).map(assignmentToPortfolioItem);
    const mixed = [...storiesMix, ...assignmentsMix];
    updateHomePageWorks(mixed);
    showToast('Home page reset to curated mix of Stories and Assignments.');
  };

  /* 2. STORIES HANDLERS */
  const handleSaveStory = (story: StoryProject, featureOnHome = false) => {
    let updatedStories: StoryProject[];
    const exists = content.stories.some((s) => s.id === story.id);
    if (exists) {
      updatedStories = content.stories.map((s) => (s.id === story.id ? story : s));
    } else {
      updatedStories = [story, ...content.stories];
    }
    updateStories(updatedStories);

    if (featureOnHome) {
      handleAddStoryToHome(story);
    }
    setEditingStory(null);
    setIsAddingStory(false);
    showToast(`Story "${story.title}" saved.`);
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const updated = content.stories.filter((s) => s.id !== storyId);
      updateStories(updated);
      const homeUpdated = content.homePageWorks.filter(
        (w) => w.id !== `story-${storyId}` && w.id !== storyId
      );
      updateHomePageWorks(homeUpdated);
      showToast('Story deleted.');
    }
  };

  /* 3. ASSIGNMENTS HANDLERS */
  const handleSaveAssignment = (assignment: AssignmentProject, featureOnHome = false) => {
    let updatedAssignments: AssignmentProject[];
    const exists = content.assignments.some((a) => a.id === assignment.id);
    if (exists) {
      updatedAssignments = content.assignments.map((a) => (a.id === assignment.id ? assignment : a));
    } else {
      updatedAssignments = [assignment, ...content.assignments];
    }
    updateAssignments(updatedAssignments);

    if (featureOnHome) {
      handleAddAssignmentToHome(assignment);
    }
    setEditingAssignment(null);
    setIsAddingAssignment(false);
    showToast(`Assignment "${assignment.title}" saved.`);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      const updated = content.assignments.filter((a) => a.id !== assignmentId);
      updateAssignments(updated);
      const homeUpdated = content.homePageWorks.filter(
        (w) => w.id !== `assignment-${assignmentId}` && w.id !== assignmentId
      );
      updateHomePageWorks(homeUpdated);
      showToast('Assignment deleted.');
    }
  };

  /* 4. JOURNALS HANDLERS */
  const handleSaveJournal = (journal: JournalEntry) => {
    let updatedJournals: JournalEntry[];
    const exists = content.journals.some((j) => j.id === journal.id);
    if (exists) {
      updatedJournals = content.journals.map((j) => (j.id === journal.id ? journal : j));
    } else {
      updatedJournals = [journal, ...content.journals];
    }
    updateJournals(updatedJournals);
    setEditingJournal(null);
    setIsAddingJournal(false);
    showToast(`Journal chapter "${journal.title}" saved.`);
  };

  const handleDeleteJournal = (journalId: string) => {
    if (confirm('Are you sure you want to delete this journal article?')) {
      const updated = content.journals.filter((j) => j.id !== journalId);
      updateJournals(updated);
      showToast('Journal article deleted.');
    }
  };

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col selection:bg-[#18191b] selection:text-[#eeefef]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#18191b] text-white px-5 py-3 shadow-2xl border border-[#caccca] flex items-center gap-3 text-xs tracking-wider uppercase font-sans-clean animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Manager Header */}
      <header className="sticky top-0 z-40 bg-[#eeefef]/95 backdrop-blur-md border-b border-[#caccca] px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#18191b] text-[#eeefef] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans-clean font-bold tracking-[0.24em] text-xs sm:text-sm uppercase text-[#18191b]">
                WOLI TASLIMAH STUDIO MANAGER
              </h1>
              <span className="text-[10px] bg-[#18191b] text-white px-2 py-0.5 tracking-wider font-mono">
                /owner
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-[#8c8e90] font-sans-clean">
              Selected Works · Stories · Assignments · Journals · Contact
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-sans-clean">
          <button
            onClick={exportBackup}
            title="Export a JSON backup of all site content"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#caccca] hover:border-[#18191b] text-[#3e4143] hover:text-[#18191b] transition-colors text-[11px] tracking-wider uppercase bg-white/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label
            title="Import a JSON backup"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#caccca] hover:border-[#18191b] text-[#3e4143] hover:text-[#18191b] transition-colors text-[11px] tracking-wider uppercase cursor-pointer bg-white/60"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
            <input
              ref={importFileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    const success = importBackup(reader.result);
                    if (success) showToast('Backup imported successfully.');
                    else showToast('Failed to import backup: invalid format.');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Restore site back to original default content?')) {
                resetToDefaults();
                showToast('Site restored to original defaults.');
              }
            }}
            title="Restore original portfolio content"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#caccca] hover:border-red-600 text-[#8c8e90] hover:text-red-600 transition-colors text-[11px] tracking-wider uppercase bg-white/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18191b] text-[#eeefef] hover:bg-[#3e4143] transition-colors text-[11px] tracking-widest uppercase font-medium shadow-xs"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav className="bg-[#f7f8f8] border-b border-[#caccca] px-6 sm:px-10 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-6 min-w-max">
          <button
            onClick={() => setActiveTab('home-works')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-sans-clean tracking-[0.2em] uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'home-works'
                ? 'text-[#18191b] font-bold'
                : 'text-[#8c8e90] hover:text-[#18191b]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home Selected Works ({content.homePageWorks.length})</span>
            {activeTab === 'home-works' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18191b]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-sans-clean tracking-[0.2em] uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'stories'
                ? 'text-[#18191b] font-bold'
                : 'text-[#8c8e90] hover:text-[#18191b]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Stories ({content.stories.length})</span>
            {activeTab === 'stories' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18191b]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-sans-clean tracking-[0.2em] uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'text-[#18191b] font-bold'
                : 'text-[#8c8e90] hover:text-[#18191b]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Assignments ({content.assignments.length})</span>
            {activeTab === 'assignments' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18191b]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('journals')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-sans-clean tracking-[0.2em] uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'journals'
                ? 'text-[#18191b] font-bold'
                : 'text-[#8c8e90] hover:text-[#18191b]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Journals ({content.journals.length})</span>
            {activeTab === 'journals' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18191b]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('contact-bio')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-sans-clean tracking-[0.2em] uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'contact-bio'
                ? 'text-[#18191b] font-bold'
                : 'text-[#8c8e90] hover:text-[#18191b]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Contact & Bio</span>
            {activeTab === 'contact-bio' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18191b]" />
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10">
        {/* TAB 1: HOME PAGE SELECTED WORKS */}
        {activeTab === 'home-works' && (
          <div className="space-y-8">
            <div className="bg-white border border-[#caccca] p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#caccca]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury uppercase tracking-wider text-[#18191b]">
                    Home Page Selected Works
                  </h2>
                  <p className="text-xs sm:text-sm font-sans-clean text-[#3e4143] mt-1">
                    The images on the home page are selected works curated by you from Stories,
                    Assignments, or a custom mix. Numbers on the images have been removed for a clean,
                    editorial aesthetic.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleResetHomeWorksToMix}
                    className="px-3.5 py-2 border border-[#caccca] hover:border-[#18191b] text-xs font-sans-clean uppercase tracking-wider text-[#3e4143] hover:text-[#18191b] transition-colors"
                  >
                    Reset Curated Mix
                  </button>
                  <button
                    onClick={handleOpenAddCustomHomeWork}
                    className="flex items-center gap-2 px-4 py-2 bg-[#18191b] text-[#eeefef] text-xs font-sans-clean uppercase tracking-widest font-medium hover:bg-[#3e4143] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom Work</span>
                  </button>
                </div>
              </div>

              {/* Quick Add from Existing Stories & Assignments Bar */}
              <div className="py-6 border-b border-[#caccca] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans-clean uppercase tracking-[0.2em] text-[#8c8e90] font-semibold">
                    Quick-Add Existing Works to Home Page
                  </span>
                  <span className="text-[11px] font-sans-clean text-[#8c8e90]">
                    Click to add any project directly
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From Stories */}
                  <div className="bg-[#f7f8f8] p-4 border border-[#caccca]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-sans-clean font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Stories ({content.stories.length})</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {content.stories.map((story) => {
                        const isFeatured = content.homePageWorks.some(
                          (w) => w.id === `story-${story.id}` || w.title === story.title
                        );
                        return (
                          <button
                            key={story.id}
                            disabled={isFeatured}
                            onClick={() => handleAddStoryToHome(story)}
                            className={`text-[11px] px-2.5 py-1 tracking-wider uppercase font-sans-clean transition-colors flex items-center gap-1 border ${
                              isFeatured
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                                : 'bg-white border-[#caccca] text-[#18191b] hover:border-[#18191b]'
                            }`}
                          >
                            <span>{story.title}</span>
                            {isFeatured ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Plus className="w-3 h-3 text-[#8c8e90]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* From Assignments */}
                  <div className="bg-[#f7f8f8] p-4 border border-[#caccca]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-sans-clean font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Assignments ({content.assignments.length})</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {content.assignments.map((assignment) => {
                        const isFeatured = content.homePageWorks.some(
                          (w) =>
                            w.id === `assignment-${assignment.id}` || w.title === assignment.title
                        );
                        return (
                          <button
                            key={assignment.id}
                            disabled={isFeatured}
                            onClick={() => handleAddAssignmentToHome(assignment)}
                            className={`text-[11px] px-2.5 py-1 tracking-wider uppercase font-sans-clean transition-colors flex items-center gap-1 border ${
                              isFeatured
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                                : 'bg-white border-[#caccca] text-[#18191b] hover:border-[#18191b]'
                            }`}
                          >
                            <span>{assignment.title}</span>
                            {isFeatured ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Plus className="w-3 h-3 text-[#8c8e90]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Home Works Ordered List */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-sans-clean uppercase tracking-[0.2em] font-semibold text-[#18191b]">
                    Current Home Page Lineup ({content.homePageWorks.length} panels)
                  </h3>
                  <span className="text-xs text-[#8c8e90] font-sans-clean">
                    Displayed in horizontal sequence from left to right
                  </span>
                </div>

                <div className="space-y-3">
                  {content.homePageWorks.map((work, idx) => (
                    <div
                      key={work.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#caccca] bg-[#fdfdfd] hover:border-[#18191b] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-[#8c8e90] font-bold w-6">
                          {idx + 1}.
                        </span>

                        <div className="relative w-16 h-12 bg-[#18191b] border border-[#caccca] overflow-hidden flex-none">
                          <Image
                            src={work.image}
                            alt={work.title}
                            fill
                            unoptimized={work.image.startsWith('data:') || !work.image.includes('unsplash.com')}
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif-luxury text-base tracking-wider uppercase text-[#18191b]">
                              {work.title}
                            </h4>
                            <span className="text-[10px] uppercase font-sans-clean px-2 py-0.5 border border-[#caccca] text-[#3e4143]">
                              {work.category}
                            </span>
                          </div>
                          <p className="text-[11px] font-sans-clean text-[#8c8e90] uppercase tracking-wider">
                            {work.tagline} · {work.location} · {work.year}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleMoveHomeWork(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Left / Earlier"
                          className="p-1.5 border border-[#caccca] hover:border-[#18191b] disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveHomeWork(idx, 'down')}
                          disabled={idx === content.homePageWorks.length - 1}
                          title="Move Right / Later"
                          className="p-1.5 border border-[#caccca] hover:border-[#18191b] disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingHomeWork(work)}
                          title="Edit details"
                          className="px-2.5 py-1.5 border border-[#caccca] hover:border-[#18191b] text-xs font-sans-clean uppercase tracking-wider flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleRemoveHomeWork(work.id)}
                          title="Remove from home"
                          className="p-1.5 border border-[#caccca] hover:border-red-600 text-[#8c8e90] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORIES MANAGEMENT */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#caccca] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#caccca]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury uppercase tracking-wider text-[#18191b]">
                    Stories Management
                  </h2>
                  <p className="text-xs sm:text-sm font-sans-clean text-[#3e4143] mt-1">
                    Manage documentary monograph projects. Upload new stories, edit captions, and
                    choose whether to feature them on the home page.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddStory}
                  className="flex items-center gap-2 px-4 py-2 bg-[#18191b] text-[#eeefef] text-xs font-sans-clean uppercase tracking-widest font-medium hover:bg-[#3e4143] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Story Project</span>
                </button>
              </div>

              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.stories.map((story) => {
                  const isFeatured = content.homePageWorks.some(
                    (w) => w.id === `story-${story.id}` || w.title === story.title
                  );
                  return (
                    <div
                      key={story.id}
                      className="border border-[#caccca] bg-[#fdfdfd] flex flex-col justify-between group hover:border-[#18191b] transition-all"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-[#18191b] overflow-hidden">
                          <Image
                            src={story.coverImage}
                            alt={story.title}
                            fill
                            unoptimized={story.coverImage.startsWith('data:') || !story.coverImage.includes('unsplash.com')}
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            {isFeatured && (
                              <span className="bg-[#18191b]/90 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 border border-white/20">
                                Home Featured
                              </span>
                            )}
                            <span className="bg-white/90 text-[#18191b] text-[9px] font-mono px-2 py-0.5 border border-[#caccca]">
                              {story.photoCount || story.photos.length} photos
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-serif-luxury text-lg uppercase tracking-wider text-[#18191b]">
                            {story.title}
                          </h3>
                          <p className="text-[11px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mt-0.5">
                            {story.subtitle}
                          </p>
                          <p className="text-xs text-[#3e4143] font-sans-clean mt-2 line-clamp-2">
                            {story.leadParagraph}
                          </p>
                          <div className="mt-3 text-[10px] text-[#8c8e90] uppercase tracking-wider font-sans-clean flex items-center justify-between border-t border-[#caccca]/60 pt-2">
                            <span>{story.location}</span>
                            <span>{story.year}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#f7f8f8] border-t border-[#caccca] flex items-center justify-between">
                        <button
                          onClick={() =>
                            isFeatured
                              ? handleRemoveHomeWork(`story-${story.id}`)
                              : handleAddStoryToHome(story)
                          }
                          className={`text-[10px] uppercase font-sans-clean tracking-wider px-2 py-1 border transition-colors ${
                            isFeatured
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-[#caccca] text-[#3e4143] hover:border-[#18191b]'
                          }`}
                        >
                          {isFeatured ? '✓ On Home' : '+ Add to Home'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingStory(story)}
                            className="p-1.5 border border-[#caccca] hover:border-[#18191b] text-[#3e4143]"
                            title="Edit story"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="p-1.5 border border-[#caccca] hover:border-red-600 text-[#8c8e90] hover:text-red-600 transition-colors"
                            title="Delete story"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS MANAGEMENT */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#caccca] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#caccca]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury uppercase tracking-wider text-[#18191b]">
                    Assignments Management
                  </h2>
                  <p className="text-xs sm:text-sm font-sans-clean text-[#3e4143] mt-1">
                    Manage architectural, movement, and editorial client commissions. Update client
                    credits, publications, and select works for the home page.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddAssignment}
                  className="flex items-center gap-2 px-4 py-2 bg-[#18191b] text-[#eeefef] text-xs font-sans-clean uppercase tracking-widest font-medium hover:bg-[#3e4143] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Assignment Project</span>
                </button>
              </div>

              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.assignments.map((assignment) => {
                  const isFeatured = content.homePageWorks.some(
                    (w) =>
                      w.id === `assignment-${assignment.id}` || w.title === assignment.title
                  );
                  return (
                    <div
                      key={assignment.id}
                      className="border border-[#caccca] bg-[#fdfdfd] flex flex-col justify-between group hover:border-[#18191b] transition-all"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-[#18191b] overflow-hidden">
                          <Image
                            src={assignment.coverImage}
                            alt={assignment.title}
                            fill
                            unoptimized={assignment.coverImage.startsWith('data:') || !assignment.coverImage.includes('unsplash.com')}
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            {isFeatured && (
                              <span className="bg-[#18191b]/90 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 border border-white/20">
                                Home Featured
                              </span>
                            )}
                            <span className="bg-white/90 text-[#18191b] text-[9px] font-mono px-2 py-0.5 border border-[#caccca]">
                              {assignment.photoCount || assignment.photos.length} photos
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="text-[10px] font-sans-clean font-bold tracking-widest text-[#8c8e90] uppercase">
                            {assignment.client}
                          </div>
                          <h3 className="font-serif-luxury text-lg uppercase tracking-wider text-[#18191b] mt-0.5">
                            {assignment.title}
                          </h3>
                          <p className="text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mt-0.5">
                            {assignment.commissionType}
                          </p>
                          <p className="text-xs text-[#3e4143] font-sans-clean mt-2 line-clamp-2">
                            {assignment.leadParagraph}
                          </p>
                          <div className="mt-3 text-[10px] text-[#8c8e90] uppercase tracking-wider font-sans-clean flex items-center justify-between border-t border-[#caccca]/60 pt-2">
                            <span>{assignment.location}</span>
                            <span>{assignment.year}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#f7f8f8] border-t border-[#caccca] flex items-center justify-between">
                        <button
                          onClick={() =>
                            isFeatured
                              ? handleRemoveHomeWork(`assignment-${assignment.id}`)
                              : handleAddAssignmentToHome(assignment)
                          }
                          className={`text-[10px] uppercase font-sans-clean tracking-wider px-2 py-1 border transition-colors ${
                            isFeatured
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-[#caccca] text-[#3e4143] hover:border-[#18191b]'
                          }`}
                        >
                          {isFeatured ? '✓ On Home' : '+ Add to Home'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingAssignment(assignment)}
                            className="p-1.5 border border-[#caccca] hover:border-[#18191b] text-[#3e4143]"
                            title="Edit assignment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="p-1.5 border border-[#caccca] hover:border-red-600 text-[#8c8e90] hover:text-red-600 transition-colors"
                            title="Delete assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: JOURNALS MANAGEMENT */}
        {activeTab === 'journals' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#caccca] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#caccca]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury uppercase tracking-wider text-[#18191b]">
                    Journal Essays & Monographs
                  </h2>
                  <p className="text-xs sm:text-sm font-sans-clean text-[#3e4143] mt-1">
                    Manage long-form editorial writings, darkroom technical notes, and architectural
                    monographs.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddJournal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#18191b] text-[#eeefef] text-xs font-sans-clean uppercase tracking-widest font-medium hover:bg-[#3e4143] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Journal Chapter</span>
                </button>
              </div>

              <div className="pt-6 space-y-4">
                {content.journals.map((journal) => (
                  <div
                    key={journal.id}
                    className="p-5 border border-[#caccca] bg-[#fdfdfd] hover:border-[#18191b] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-16 bg-[#18191b] border border-[#caccca] overflow-hidden flex-none">
                        <Image
                          src={journal.coverImage}
                          alt={journal.title}
                          fill
                          unoptimized={journal.coverImage.startsWith('data:') || !journal.coverImage.includes('unsplash.com')}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase bg-[#18191b] text-white px-2 py-0.5">
                            {journal.chapterLabel}
                          </span>
                          <span className="text-[10px] uppercase font-sans-clean text-[#8c8e90]">
                            {journal.category} · {journal.date} · {journal.readTime}
                          </span>
                        </div>
                        <h3 className="font-serif-luxury text-lg uppercase tracking-wider text-[#18191b] mt-1">
                          {journal.title}
                        </h3>
                        <p className="text-xs text-[#3e4143] font-sans-clean line-clamp-1 mt-0.5">
                          {journal.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => setEditingJournal(journal)}
                        className="px-3 py-1.5 border border-[#caccca] hover:border-[#18191b] text-xs font-sans-clean uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteJournal(journal.id)}
                        className="p-1.5 border border-[#caccca] hover:border-red-600 text-[#8c8e90] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT & ARTIST BIO */}
        {activeTab === 'contact-bio' && (
          <ContactBioSection
            key={content.lastModified || 'contact-bio'}
            initialArtistInfo={content.artistInfo}
            onSave={(info) => {
              updateArtistInfo(info);
              showToast('Artist biography and contact information updated successfully.');
            }}
          />
        )}
      </main>

      {/* MODAL 1: EDIT / CREATE HOME WORK ITEM */}
      {editingHomeWork && (
        <HomeWorkModal
          item={editingHomeWork}
          isNew={isAddingCustomHomeWork}
          onClose={() => {
            setEditingHomeWork(null);
            setIsAddingCustomHomeWork(false);
          }}
          onSave={(item) => {
            if (isAddingCustomHomeWork) {
              handleCreateCustomHomeWork(item);
            } else {
              handleSaveHomeWorkEdit(item);
            }
          }}
          onFileUpload={handleFileUpload}
        />
      )}

      {/* MODAL 2: EDIT / CREATE STORY PROJECT */}
      {editingStory && (
        <StoryModal
          story={editingStory}
          isNew={isAddingStory}
          onClose={() => {
            setEditingStory(null);
            setIsAddingStory(false);
          }}
          onSave={handleSaveStory}
          onFileUpload={handleFileUpload}
        />
      )}

      {/* MODAL 3: EDIT / CREATE ASSIGNMENT PROJECT */}
      {editingAssignment && (
        <AssignmentModal
          assignment={editingAssignment}
          isNew={isAddingAssignment}
          onClose={() => {
            setEditingAssignment(null);
            setIsAddingAssignment(false);
          }}
          onSave={handleSaveAssignment}
          onFileUpload={handleFileUpload}
        />
      )}

      {/* MODAL 4: EDIT / CREATE JOURNAL ENTRY */}
      {editingJournal && (
        <JournalModal
          journal={editingJournal}
          isNew={isAddingJournal}
          onClose={() => {
            setEditingJournal(null);
            setIsAddingJournal(false);
          }}
          onSave={handleSaveJournal}
          onFileUpload={handleFileUpload}
        />
      )}
    </div>
  );
}

function ContactBioSection({
  initialArtistInfo,
  onSave,
}: {
  initialArtistInfo: SiteArtistInfo;
  onSave: (info: SiteArtistInfo) => void;
}) {
  const [artistForm, setArtistForm] = useState<SiteArtistInfo>(initialArtistInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(artistForm);
  };

  return (
    <div className="bg-white border border-[#caccca] p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-serif-luxury uppercase tracking-wider text-[#18191b] pb-4 border-b border-[#caccca]">
        Artist Profile & Contact Details
      </h2>

      <form onSubmit={handleSubmit} className="pt-6 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-2 font-semibold">
              Artist Display Name
            </label>
            <input
              type="text"
              value={artistForm.name}
              onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#f7f8f8] border border-[#caccca] text-sm font-sans-clean focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-2 font-semibold">
              Discipline / Tagline
            </label>
            <input
              type="text"
              value={artistForm.subtitle}
              onChange={(e) => setArtistForm({ ...artistForm, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#f7f8f8] border border-[#caccca] text-sm font-sans-clean focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-2 font-semibold">
            Primary Biography Summary
          </label>
          <textarea
            rows={4}
            value={artistForm.bio}
            onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#f7f8f8] border border-[#caccca] text-sm font-sans-clean focus:outline-none focus:border-[#18191b]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-2 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Phone Number</span>
            </label>
            <input
              type="text"
              value={artistForm.phone}
              onChange={(e) => setArtistForm({ ...artistForm, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#f7f8f8] border border-[#caccca] text-sm font-sans-clean focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-2 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Studio Inquiry Email</span>
            </label>
            <input
              type="email"
              value={artistForm.email}
              onChange={(e) => setArtistForm({ ...artistForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#f7f8f8] border border-[#caccca] text-sm font-sans-clean focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-2 font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Studio Locations & Representation</span>
          </label>
          <input
            type="text"
            value={artistForm.location}
            onChange={(e) => setArtistForm({ ...artistForm, location: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#f7f8f8] border border-[#caccca] text-sm font-sans-clean focus:outline-none focus:border-[#18191b]"
            required
          />
        </div>

        <div className="pt-4 border-t border-[#caccca] space-y-4">
          <span className="text-xs font-sans-clean uppercase tracking-[0.2em] text-[#8c8e90] font-semibold block">
            Social Channels
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={artistForm.socials?.instagram || ''}
                onChange={(e) =>
                  setArtistForm({
                    ...artistForm,
                    socials: { ...artistForm.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#f7f8f8] border border-[#caccca] text-xs font-sans-clean focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={artistForm.socials?.linkedin || ''}
                onChange={(e) =>
                  setArtistForm({
                    ...artistForm,
                    socials: { ...artistForm.socials, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#f7f8f8] border border-[#caccca] text-xs font-sans-clean focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#caccca] flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#18191b] text-white hover:bg-[#3e4143] transition-colors text-xs font-sans-clean uppercase tracking-widest font-semibold shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Artist & Contact Info</span>
          </button>
        </div>
      </form>
    </div>
  );
}

interface HomeWorkModalProps {
  item: PortfolioItem;
  isNew: boolean;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => void;
}

function HomeWorkModal({ item, isNew, onClose, onSave, onFileUpload }: HomeWorkModalProps) {
  const [form, setForm] = useState<PortfolioItem>({ ...item, number: '' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191b]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#eeefef] border border-[#caccca] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#caccca]">
          <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#18191b]">
            {isNew ? 'Create New Home Panel' : 'Edit Home Selected Work'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#8c8e90] hover:text-[#18191b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...form,
              number: '',
              layoutBTitle: form.title.toUpperCase(),
            });
          }}
          className="pt-6 space-y-4 text-xs font-sans-clean"
        >
          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              >
                <option value="Stories">Stories</option>
                <option value="Assignments">Assignments</option>
                <option value="Prints">Prints</option>
                <option value="About">About</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Location
              </label>
              <input
                type="text"
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Year
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Cover Image
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-white border border-[#caccca] text-xs focus:outline-none focus:border-[#18191b]"
                required
              />
              <label className="px-3 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] cursor-pointer uppercase tracking-wider flex items-center gap-1.5 flex-none transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFileUpload(e, (url) => setForm({ ...form, image: url }))}
                />
              </label>
            </div>

            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] uppercase text-[#8c8e90] mr-1 flex-none">Presets:</span>
              {PRESET_PHOTOS.slice(0, 5).map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setForm({ ...form, image: preset.url })}
                  className="text-[10px] px-2 py-0.5 border border-[#caccca] bg-white hover:border-[#18191b] flex-none truncate max-w-[120px]"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="mt-3 relative w-full h-36 bg-[#18191b] border border-[#caccca] overflow-hidden">
              <Image
                src={form.image}
                alt="Preview"
                fill
                unoptimized={form.image.startsWith('data:') || !form.image.includes('unsplash.com')}
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Short Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
            />
          </div>

          <div className="pt-4 border-t border-[#caccca] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#caccca] text-[#3e4143] hover:text-[#18191b]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] font-medium"
            >
              Save Home Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface StoryModalProps {
  story: StoryProject;
  isNew: boolean;
  onClose: () => void;
  onSave: (story: StoryProject, featureOnHome: boolean) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => void;
}

function StoryModal({ story, isNew, onClose, onSave, onFileUpload }: StoryModalProps) {
  const [form, setForm] = useState<StoryProject>({ ...story, number: '' });
  const [featureOnHome, setFeatureOnHome] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191b]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#eeefef] border border-[#caccca] w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#caccca]">
          <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#18191b]">
            {isNew ? 'Create New Story' : 'Edit Story Project'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#8c8e90] hover:text-[#18191b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form, featureOnHome);
          }}
          className="pt-6 space-y-4 text-xs font-sans-clean"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Story Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Subtitle
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Year
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Camera / Lens
              </label>
              <input
                type="text"
                value={form.camera}
                onChange={(e) => setForm({ ...form, camera: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Cover Image URL or File Upload
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
              <label className="px-3 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] cursor-pointer uppercase tracking-wider flex items-center gap-1.5 flex-none">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onFileUpload(e, (url) => setForm({ ...form, coverImage: url }))
                  }
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Lead Paragraph
            </label>
            <textarea
              rows={3}
              value={form.leadParagraph}
              onChange={(e) => setForm({ ...form, leadParagraph: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="featureOnHomeStory"
              checked={featureOnHome}
              onChange={(e) => setFeatureOnHome(e.target.checked)}
              className="w-4 h-4 accent-[#18191b]"
            />
            <label
              htmlFor="featureOnHomeStory"
              className="text-xs uppercase font-sans-clean font-semibold tracking-wider text-[#18191b] cursor-pointer"
            >
              Also feature this story as a panel on the Home Page
            </label>
          </div>

          <div className="pt-4 border-t border-[#caccca] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#caccca] text-[#3e4143] hover:text-[#18191b]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] font-medium"
            >
              Save Story Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AssignmentModalProps {
  assignment: AssignmentProject;
  isNew: boolean;
  onClose: () => void;
  onSave: (assignment: AssignmentProject, featureOnHome: boolean) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => void;
}

function AssignmentModal({
  assignment,
  isNew,
  onClose,
  onSave,
  onFileUpload,
}: AssignmentModalProps) {
  const [form, setForm] = useState<AssignmentProject>({ ...assignment, number: '' });
  const [featureOnHome, setFeatureOnHome] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191b]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#eeefef] border border-[#caccca] w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#caccca]">
          <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#18191b]">
            {isNew ? 'Create New Assignment' : 'Edit Assignment Project'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#8c8e90] hover:text-[#18191b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form, featureOnHome);
          }}
          className="pt-6 space-y-4 text-xs font-sans-clean"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Client Name
              </label>
              <input
                type="text"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Assignment Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Commission Type
              </label>
              <input
                type="text"
                value={form.commissionType}
                onChange={(e) => setForm({ ...form, commissionType: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Year
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Cover Image URL or File Upload
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
              <label className="px-3 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] cursor-pointer uppercase tracking-wider flex items-center gap-1.5 flex-none">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onFileUpload(e, (url) => setForm({ ...form, coverImage: url }))
                  }
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Lead Paragraph
            </label>
            <textarea
              rows={3}
              value={form.leadParagraph}
              onChange={(e) => setForm({ ...form, leadParagraph: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="featureOnHomeAssignment"
              checked={featureOnHome}
              onChange={(e) => setFeatureOnHome(e.target.checked)}
              className="w-4 h-4 accent-[#18191b]"
            />
            <label
              htmlFor="featureOnHomeAssignment"
              className="text-xs uppercase font-sans-clean font-semibold tracking-wider text-[#18191b] cursor-pointer"
            >
              Also feature this assignment as a panel on the Home Page
            </label>
          </div>

          <div className="pt-4 border-t border-[#caccca] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#caccca] text-[#3e4143] hover:text-[#18191b]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] font-medium"
            >
              Save Assignment Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface JournalModalProps {
  journal: JournalEntry;
  isNew: boolean;
  onClose: () => void;
  onSave: (journal: JournalEntry) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => void;
}

function JournalModal({ journal, isNew, onClose, onSave, onFileUpload }: JournalModalProps) {
  const [form, setForm] = useState<JournalEntry>({ ...journal });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191b]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#eeefef] border border-[#caccca] w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#caccca]">
          <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#18191b]">
            {isNew ? 'Create New Journal Chapter' : 'Edit Journal Chapter'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#8c8e90] hover:text-[#18191b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="pt-6 space-y-4 text-xs font-sans-clean"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Chapter Label (e.g. Chapter 4)
              </label>
              <input
                type="text"
                value={form.chapterLabel}
                onChange={(e) => setForm({ ...form, chapterLabel: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Article Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Subtitle
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Date
              </label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
            <div>
              <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
                Read Time
              </label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Cover Image URL or File Upload
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
                required
              />
              <label className="px-3 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] cursor-pointer uppercase tracking-wider flex items-center gap-1.5 flex-none">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onFileUpload(e, (url) => setForm({ ...form, coverImage: url }))
                  }
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#8c8e90] uppercase tracking-wider mb-1 font-semibold">
              Excerpt / Abstract
            </label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#caccca] focus:outline-none focus:border-[#18191b]"
              required
            />
          </div>

          <div className="pt-4 border-t border-[#caccca] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#caccca] text-[#3e4143] hover:text-[#18191b]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#18191b] text-white hover:bg-[#3e4143] font-medium"
            >
              Save Journal Chapter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
