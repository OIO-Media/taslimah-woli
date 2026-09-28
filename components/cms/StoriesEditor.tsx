'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StoryProjectCMS, GalleryPhoto } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { GalleryManager } from './GalleryManager';
import { ConfirmModal } from './ConfirmModal';
import { Plus, X, Trash2, ArrowUp, ArrowDown, Edit3, Camera, ChevronRight, Eye } from 'lucide-react';

interface StoriesEditorProps {
  stories: StoryProjectCMS[];
  onChange: (stories: StoryProjectCMS[]) => void;
}

export const StoriesEditor: React.FC<StoriesEditorProps> = ({ stories, onChange }) => {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [deleteStoryIdx, setDeleteStoryIdx] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Story state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newYear, setNewYear] = useState('2024 – Present');
  const [newLocation, setNewLocation] = useState('Nigeria');
  const [newLead, setNewLead] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newAdditionalPhotos, setNewAdditionalPhotos] = useState<{ url: string; caption: string }[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const activeStory = stories.find((s) => s.id === activeStoryId) || null;
  const activeIndex = stories.findIndex((s) => s.id === activeStoryId);

  const handleAddNew = () => {
    if (!newTitle.trim() || !newCover.trim()) return;

    const id = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `story-${Date.now()}`;

    const allPhotos: GalleryPhoto[] = [
      {
        id: `photo-${id}-0`,
        url: newCover.trim(),
        caption: `${newTitle.trim()} lead photograph`,
        order: 0,
      },
      ...newAdditionalPhotos.map((p, i) => ({
        id: `photo-${id}-${i + 1}`,
        url: p.url,
        caption: p.caption || `${newTitle.trim()} photograph ${i + 2}`,
        order: i + 1,
      })),
    ];

    const newStory: StoryProjectCMS = {
      id,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'DOCUMENTARY PHOTOGRAPHY',
      leadParagraph: newLead.trim() || 'A personal documentary inquiry by Taslimah Woli.',
      year: newYear.trim(),
      location: newLocation.trim(),
      coverImage: newCover.trim(),
      projectStatement: newLead.trim(),
      order: stories.length,
      status: 'published',
      photos: allPhotos,
    };

    const nextStories = [...stories, newStory];
    onChange(nextStories);
    setNewTitle('');
    setNewSubtitle('');
    setNewLead('');
    setNewCover('');
    setNewAdditionalPhotos([]);
    setNewPhotoUrl('');
    setIsAdding(false);
    setActiveStoryId(id);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stories.length) return;

    const next = [...stories];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    const updated = next.map((item, idx) => ({ ...item, order: idx }));
    onChange(updated);
  };

  const handleUpdateActive = (field: keyof StoryProjectCMS, value: any) => {
    if (!activeStory || activeIndex === -1) return;
    const next = [...stories];
    next[activeIndex] = { ...next[activeIndex], [field]: value };
    onChange(next);
  };

  const handleDelete = () => {
    if (deleteStoryIdx === null) return;
    const removedId = stories[deleteStoryIdx].id;
    const next = stories.filter((_, idx) => idx !== deleteStoryIdx).map((item, idx) => ({ ...item, order: idx }));
    onChange(next);
    setDeleteStoryIdx(null);
    if (activeStoryId === removedId) setActiveStoryId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Bar Header */}
      <div className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Stories &amp; Bodies of Work ({stories.length})
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Manage long-term documentary series, project statements, and image sequences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding(!isAdding);
            setActiveStoryId(null);
          }}
          className={`px-4 py-2.5 ${isAdding ? 'bg-white hover:bg-[#f7f8f8] text-[#18191b] border border-[#caccca]' : 'bg-[#18191b] hover:bg-[#3e4143] text-white'} text-xs font-sans-clean font-medium rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto`}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Create New Project'}
        </button>
      </div>

      {/* Add New Story Drawer */}
      {isAdding && (
        <div className="p-6 bg-white border border-[#caccca] rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
          <h4 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
            Start New Documentary Body of Work
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Thresholds of Memory"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. VERNACULAR COURTYARDS & RITUAL"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Benin City, Nigeria"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Year or Status
              </label>
              <input
                type="text"
                placeholder="e.g. 2024 – Present or In development"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <ImageUploader
            label="Cover Image *"
            value={newCover}
            onChange={(url) => setNewCover(url)}
            helperText="Lead photograph representing the project."
          />

          {/* Additional Project Images */}
          <div className="space-y-3">
            <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
              Additional Project Images
            </label>
            <p className="text-[11px] font-sans-clean text-[#8c8e90] -mt-2">
              Add more photographs to this body of work. You can also manage images after creating the project.
            </p>

            {/* Already added photos */}
            {newAdditionalPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {newAdditionalPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group border border-[#caccca] rounded-lg overflow-hidden bg-[#f7f8f8]"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={photo.url}
                        alt={photo.caption || `Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="200px"
                        unoptimized
                      />
                    </div>
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Caption..."
                        value={photo.caption}
                        onChange={(e) => {
                          const updated = [...newAdditionalPhotos];
                          updated[idx] = { ...updated[idx], caption: e.target.value };
                          setNewAdditionalPhotos(updated);
                        }}
                        className="w-full text-[11px] px-2 py-1 rounded border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewAdditionalPhotos(newAdditionalPhotos.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photo uploader */}
            <ImageUploader
              label=""
              value={newPhotoUrl}
              onChange={(url) => {
                if (url) {
                  setNewAdditionalPhotos([...newAdditionalPhotos, { url, caption: '' }]);
                  setNewPhotoUrl('');
                }
              }}
              helperText="Upload or paste URL for additional project photographs."
              aspectRatioHint={`${newAdditionalPhotos.length} additional photo${newAdditionalPhotos.length !== 1 ? 's' : ''} added`}
            />
          </div>

          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              Lead Statement / Description
            </label>
            <textarea
              rows={3}
              placeholder="Introduce the documentary context, architectural premises, and research background..."
              value={newLead}
              onChange={(e) => setNewLead(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-[#caccca] text-xs font-sans-clean font-medium rounded-lg hover:bg-[#f7f8f8]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!newTitle.trim() || !newCover.trim()}
              onClick={handleAddNew}
              className="px-5 py-2 bg-[#18191b] disabled:opacity-40 text-white text-xs font-sans-clean font-medium rounded-lg hover:bg-[#3e4143]"
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Projects List on Left, Active Project Full Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Project Selector Sidebar */}
        <div className="lg:col-span-4 bg-white border border-[#caccca] rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="font-serif-luxury text-base text-[#18191b] uppercase tracking-wider mb-2">
            Bodies of Work ({stories.length})
          </h4>

          <div className="space-y-2">
            {stories.map((story, index) => {
              const isSelected = activeStoryId === story.id;

              return (
                <div
                  key={story.id}
                  onClick={() => {
                    setActiveStoryId(story.id);
                    setIsAdding(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#18191b] bg-[#f7f8f8] shadow-2xs'
                      : 'border-[#caccca] hover:border-[#8c8e90] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-[#8c8e90] w-4 shrink-0">
                      #{index + 1}
                    </span>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#18191b] shrink-0 border border-[#caccca]">
                      <Image
                        src={story.coverImage}
                        alt={story.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-serif-luxury text-sm text-[#18191b] truncate uppercase">
                        {story.title}
                      </h5>
                      <p className="font-sans-clean text-[10px] text-[#8c8e90] truncate">
                        {story.location} · {story.photos.length} photos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      title="Move up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3 text-[#18191b]" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={index === stories.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3 text-[#18191b]" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => setDeleteStoryIdx(index)}
                      className="p-1 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Project Full Detail Editor */}
        <div className="lg:col-span-8">
          {activeStory ? (
            <div className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#caccca] pb-4">
                <div>
                  <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mb-1">
                    Editing Project
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#18191b] uppercase">
                    {activeStory.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeStory.status}
                    onChange={(e) => handleUpdateActive('status', e.target.value as any)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#caccca] bg-white font-sans-clean font-medium text-[#18191b]"
                  >
                    <option value="published">Status: Published</option>
                    <option value="draft">Status: Draft</option>
                  </select>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={activeStory.title}
                    onChange={(e) => handleUpdateActive('title', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={activeStory.subtitle}
                    onChange={(e) => handleUpdateActive('subtitle', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={activeStory.location}
                    onChange={(e) => handleUpdateActive('location', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Year / Date Range
                  </label>
                  <input
                    type="text"
                    value={activeStory.year}
                    onChange={(e) => handleUpdateActive('year', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Cover Photograph"
                value={activeStory.coverImage}
                onChange={(url) => handleUpdateActive('coverImage', url)}
                helperText="Primary image shown on the carousel card."
              />

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Lead Summary Paragraph
                </label>
                <textarea
                  rows={3}
                  value={activeStory.leadParagraph}
                  onChange={(e) => handleUpdateActive('leadParagraph', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>

              {/* Rich Text Project Statement */}
              <RichTextEditor
                label="Curatorial Project Statement (Essay & Research)"
                value={activeStory.projectStatement || activeStory.leadParagraph}
                onChange={(val) => handleUpdateActive('projectStatement', val)}
                helperText="Detailed artist statement exploring architectural context, research premises, and methodology."
                minHeight="200px"
              />

              {/* Ordered Image Gallery with Captions & EXIF */}
              <div className="pt-4 border-t border-[#caccca]">
                <GalleryManager
                  photos={activeStory.photos}
                  onChange={(photos) => handleUpdateActive('photos', photos)}
                  title={`${activeStory.title} Photograph Sequence`}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#caccca] rounded-2xl p-12 text-center text-[#8c8e90]">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-serif-luxury text-lg text-[#18191b] uppercase">
                Select a project from the left
              </p>
              <p className="font-sans-clean text-xs mt-1">
                Or click &ldquo;Create New Project&rdquo; to add a new body of work.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteStoryIdx !== null}
        title="Delete Documentary Project"
        message="Are you sure you want to permanently delete this body of work and all its associated photographs? This will be saved to your draft."
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleteStoryIdx(null)}
      />
    </div>
  );
};
