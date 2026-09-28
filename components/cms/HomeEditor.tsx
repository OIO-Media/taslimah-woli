'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HomeHeroConfig, BodyOfWorkItem, StoryProjectCMS, AssignmentProjectCMS } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { ConfirmModal } from './ConfirmModal';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit3, Check, Search, X } from 'lucide-react';

interface HomeEditorProps {
  hero: HomeHeroConfig;
  bodiesOfWork: BodyOfWorkItem[];
  stories: StoryProjectCMS[];
  assignments: AssignmentProjectCMS[];
  onHeroChange: (hero: HomeHeroConfig) => void;
  onBodiesOfWorkChange: (items: BodyOfWorkItem[]) => void;
}

// ── Project Picker Modal ─────────────────────────────────────────────────────

interface PickerModalProps {
  stories: StoryProjectCMS[];
  assignments: AssignmentProjectCMS[];
  alreadyAdded: string[]; // ids already in carousel
  onSelect: (item: BodyOfWorkItem) => void;
  onClose: () => void;
}

const ProjectPickerModal: React.FC<PickerModalProps> = ({
  stories,
  assignments,
  alreadyAdded,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  type PickerEntry = { id: string; title: string; subtitle: string; location: string; year: string; image: string; category: 'Stories' | 'Assignments'; description: string };

  const allProjects: PickerEntry[] = [
    ...stories.map(s => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      location: s.location,
      year: s.year,
      image: s.coverImage,
      category: 'Stories' as const,
      description: s.leadParagraph,
    })),
    ...assignments.map(a => ({
      id: a.id,
      title: a.title,
      subtitle: a.subtitle,
      location: a.location,
      year: a.year,
      image: a.coverImage,
      category: 'Assignments' as const,
      description: a.leadParagraph,
    })),
  ];

  const filtered = allProjects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const handlePick = (p: PickerEntry) => {
    const bowItem: BodyOfWorkItem = {
      id: p.id,
      title: p.title,
      layoutBTitle: p.title.toUpperCase(),
      tagline: p.subtitle.toUpperCase(),
      category: p.category,
      image: p.image,
      imageAlt: `${p.title} — documentary photography by Taslimah Woli`,
      description: p.description,
      location: p.location,
      year: p.year,
      order: 0, // will be overwritten by parent
      status: 'published',
      gallery: [{ id: `img-${p.id}-0`, url: p.image, caption: p.title, order: 0 }],
    };
    onSelect(bowItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18191b]/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#caccca]">
          <h3 className="font-serif-luxury text-lg text-[#18191b] uppercase tracking-wide">
            Select a Project
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#eeefef] text-[#8c8e90]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-[#eeefef]">
          <div className="flex items-center gap-2 bg-[#f7f8f8] border border-[#caccca] rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-[#8c8e90] shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search stories or assignments…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-sans-clean text-[#18191b] placeholder:text-[#8c8e90] focus:outline-none"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#eeefef]">
          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-xs font-sans-clean text-[#8c8e90]">
              No projects found. Add projects in the Stories or Assignments tabs first.
            </div>
          )}
          {filtered.map(p => {
            const isAdded = alreadyAdded.includes(p.id);
            return (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f7f8f8] transition-colors">
                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-md overflow-hidden bg-[#eeefef] shrink-0 border border-[#caccca]">
                  <Image src={p.image} alt={p.title} fill className="object-cover" sizes="64px" unoptimized />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif-luxury text-sm text-[#18191b] uppercase truncate">{p.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-sans-clean px-1.5 py-0.5 rounded font-medium ${
                      p.category === 'Stories' ? 'bg-[#eeefef] text-[#18191b]' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {p.category}
                    </span>
                    <span className="text-[10px] font-sans-clean text-[#8c8e90]">· {p.location} · {p.year}</span>
                  </div>
                </div>

                {/* Action */}
                {isAdded ? (
                  <span className="flex items-center gap-1 text-[10px] font-sans-clean text-[#8c8e90] shrink-0">
                    <Check className="w-3 h-3" /> Added
                  </span>
                ) : (
                  <button
                    onClick={() => handlePick(p)}
                    className="px-3 py-1.5 bg-[#18191b] text-white text-[10px] font-sans-clean font-medium rounded-lg hover:bg-[#3e4143] transition-colors shrink-0"
                  >
                    Add to Carousel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Main HomeEditor ──────────────────────────────────────────────────────────

export const HomeEditor: React.FC<HomeEditorProps> = ({
  hero,
  bodiesOfWork,
  stories,
  assignments,
  onHeroChange,
  onBodiesOfWorkChange,
}) => {
  const [activeWorkIdx, setActiveWorkIdx] = useState<number | null>(null);
  const [deleteWorkIdx, setDeleteWorkIdx] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const alreadyAddedIds = bodiesOfWork.map(b => b.id);

  const handlePickProject = (item: BodyOfWorkItem) => {
    const withOrder = { ...item, order: bodiesOfWork.length };
    onBodiesOfWorkChange([...bodiesOfWork, withOrder]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= bodiesOfWork.length) return;
    const list = [...bodiesOfWork];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    onBodiesOfWorkChange(list.map((item, idx) => ({ ...item, order: idx })));
  };

  const handleUpdateItem = (index: number, field: keyof BodyOfWorkItem, value: any) => {
    const list = [...bodiesOfWork];
    list[index] = { ...list[index], [field]: value };
    if (field === 'title') list[index].layoutBTitle = String(value).toUpperCase();
    if (field === 'tagline') list[index].tagline = String(value).toUpperCase();
    onBodiesOfWorkChange(list);
  };

  const handleDeleteItem = () => {
    if (deleteWorkIdx === null) return;
    const list = bodiesOfWork
      .filter((_, idx) => idx !== deleteWorkIdx)
      .map((item, idx) => ({ ...item, order: idx }));
    onBodiesOfWorkChange(list);
    setDeleteWorkIdx(null);
    if (activeWorkIdx === deleteWorkIdx) setActiveWorkIdx(null);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: HERO & INTRO */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="border-b border-[#caccca] pb-4 mb-6">
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Homepage Hero &amp; Intro Header
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Edit the primary visual opening, brand titles, and subtitle on the landing screen.
          </p>
        </div>

        <div className="space-y-6">
          <ImageUploader
            label="Hero Background Photograph"
            value={hero.image}
            altText={hero.imageAlt}
            onAltChange={(alt) => onHeroChange({ ...hero, imageAlt: alt })}
            onChange={(url) => onHeroChange({ ...hero, image: url })}
            helperText="Wide architectural photograph representing Taslimah Woli's spatial aesthetic."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                Top Tagline (Microcopy)
              </label>
              <input
                type="text"
                value={hero.tagline}
                onChange={(e) => onHeroChange({ ...hero, tagline: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                Scroll Prompt Pill
              </label>
              <input
                type="text"
                value={hero.scrollPrompt}
                onChange={(e) => onHeroChange({ ...hero, scrollPrompt: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                Headline Line 1
              </label>
              <input
                type="text"
                value={hero.titleLine1}
                onChange={(e) => onHeroChange({ ...hero, titleLine1: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
                Headline Line 2
              </label>
              <input
                type="text"
                value={hero.titleLine2}
                onChange={(e) => onHeroChange({ ...hero, titleLine2: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
              Practice Subtitle
            </label>
            <input
              type="text"
              value={hero.subtitle}
              onChange={(e) => onHeroChange({ ...hero, subtitle: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: BODIES-OF-WORK CAROUSEL */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#caccca] pb-4 mb-6">
          <div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
              Homepage Bodies-of-Work Carousel ({bodiesOfWork.length})
            </h3>
            <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
              Choose which Stories and Assignments appear here. Details autofill from the project.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="px-4 py-2.5 bg-[#18191b] hover:bg-[#3e4143] text-white text-xs font-sans-clean font-medium rounded-lg flex items-center gap-2 transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            Add from Projects
          </button>
        </div>

        {bodiesOfWork.length === 0 && (
          <div className="py-12 text-center border border-dashed border-[#caccca] rounded-xl">
            <p className="text-xs font-sans-clean text-[#8c8e90]">No projects added yet.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="mt-3 px-4 py-2 bg-[#18191b] text-white text-xs font-sans-clean font-medium rounded-lg hover:bg-[#3e4143] transition-colors"
            >
              Pick a Project
            </button>
          </div>
        )}

        {/* Carousel Card List */}
        <div className="space-y-4">
          {bodiesOfWork.map((item, index) => {
            const isEditing = activeWorkIdx === index;

            return (
              <div
                key={item.id || index}
                className="border border-[#caccca] rounded-xl overflow-hidden bg-[#fafafa] transition-all"
              >
                {/* Header row */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#8c8e90] w-6 text-center">
                      #{index + 1}
                    </span>
                    <div className="relative w-20 h-16 rounded-md overflow-hidden bg-[#18191b] shrink-0 border border-[#caccca]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-base text-[#18191b] uppercase">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] font-sans-clean text-[#8c8e90] mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded font-medium text-[10px] ${
                          item.category === 'Stories' ? 'bg-[#eeefef] text-[#18191b]' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {item.category}
                        </span>
                        <span>·</span>
                        <span>{item.location}</span>
                        <span>·</span>
                        <span className={item.year.toLowerCase().includes('development') ? 'text-amber-700 font-medium' : ''}>
                          {item.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      title="Move up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 text-[#18191b]"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={index === bodiesOfWork.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 text-[#18191b]"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveWorkIdx(isEditing ? null : index)}
                      className={`px-3 py-1.5 text-xs font-sans-clean font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                        isEditing
                          ? 'bg-[#18191b] text-white border-[#18191b]'
                          : 'border-[#caccca] bg-white text-[#18191b] hover:bg-[#eeefef]'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditing ? 'Done' : 'Override'}
                    </button>
                    <button
                      type="button"
                      title="Remove from Carousel"
                      onClick={() => setDeleteWorkIdx(index)}
                      className="p-1.5 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Override / Edit Form — only shown if user wants to customise autofilled values */}
                {isEditing && (
                  <div className="p-6 border-t border-[#caccca] bg-[#f7f8f8] space-y-4 animate-in fade-in duration-150">
                    <p className="text-[11px] font-sans-clean text-[#8c8e90] italic">
                      These values are autofilled from the source project. Edit here to override just what appears on the homepage carousel without changing the original project.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                          Title (carousel override)
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                          Tagline / Subtitle (carousel override)
                        </label>
                        <input
                          type="text"
                          value={item.tagline}
                          onChange={(e) => handleUpdateItem(index, 'tagline', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                          Location (carousel override)
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                          Year / Status (carousel override)
                        </label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => handleUpdateItem(index, 'year', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                        />
                      </div>
                    </div>

                    <ImageUploader
                      label="Cover Photo (carousel override)"
                      value={item.image}
                      altText={item.imageAlt}
                      onAltChange={(alt) => handleUpdateItem(index, 'imageAlt', alt)}
                      onChange={(url) => handleUpdateItem(index, 'image', url)}
                      helperText="Override the cover photo shown specifically in the carousel."
                    />

                    <div>
                      <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                        Lead Description (carousel override)
                      </label>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Project Picker Modal */}
      {showPicker && (
        <ProjectPickerModal
          stories={stories}
          assignments={assignments}
          alreadyAdded={alreadyAddedIds}
          onSelect={handlePickProject}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteWorkIdx !== null}
        title="Remove Body of Work"
        message="Are you sure you want to remove this project from the homepage carousel? The original project in Stories or Assignments is not affected."
        confirmLabel="Remove"
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteWorkIdx(null)}
      />
    </div>
  );
};
