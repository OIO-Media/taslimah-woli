'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { JournalEntryCMS } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { WysiwygEditor } from './WysiwygEditor';
import { ConfirmModal } from './ConfirmModal';
import { Plus, Trash2, ArrowUp, ArrowDown, BookOpen, Clock, Calendar, MapPin, Sparkles } from 'lucide-react';
import { calculateReadTime, extractExcerptFromHtml } from '@/lib/cms-journal-utils';

interface JournalsEditorProps {
  journals: JournalEntryCMS[];
  onChange: (journals: JournalEntryCMS[]) => void;
}

export const JournalsEditor: React.FC<JournalsEditorProps> = ({ journals, onChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Journal state
  const [newTitle, setNewTitle] = useState('');
  const [newChapter, setNewChapter] = useState(`Chapter 0${journals.length + 1}`);
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDate, setNewDate] = useState('Autumn 2026');
  const [newReadTime, setNewReadTime] = useState('5 min read');
  const [newLocation, setNewLocation] = useState('Nigeria');
  const [newCover, setNewCover] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newBody, setNewBody] = useState('');

  const activeJournal = journals.find((j) => j.id === activeId) || null;
  const activeIndex = journals.findIndex((j) => j.id === activeId);

  const handleAddNew = () => {
    if (!newTitle.trim() || !newCover.trim()) return;

    const id = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `journal-${Date.now()}`;

    // newBody is HTML from the WYSIWYG editor
    const bodyHtml = newBody || `<p>${newExcerpt.trim()}</p>`;
    // Extract plain text paragraphs for fallback/search
    const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
    let paragraphs: string[] = [newExcerpt.trim()];
    if (tempDiv) {
      tempDiv.innerHTML = bodyHtml;
      const pEls = tempDiv.querySelectorAll('p, h1, h2, h3, li');
      const texts = Array.from(pEls).map(el => el.textContent?.trim()).filter(Boolean) as string[];
      if (texts.length) paragraphs = texts;
    }

    const newJournal: JournalEntryCMS = {
      id,
      chapter: newChapter.trim(),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'RESEARCH & FIELD NOTES',
      date: newDate.trim(),
      readTime: newReadTime.trim(),
      location: newLocation.trim(),
      coverImage: newCover.trim(),
      excerpt: newExcerpt.trim() || paragraphs[0] || '',
      paragraphs,
      bodyHtml,
      order: journals.length,
      status: 'published',
    };

    onChange([...journals, newJournal]);
    setNewTitle('');
    setNewSubtitle('');
    setNewCover('');
    setNewExcerpt('');
    setNewBody('');
    setIsAdding(false);
    setActiveId(id);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= journals.length) return;

    const next = [...journals];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    const updated = next.map((item, idx) => ({ ...item, order: idx }));
    onChange(updated);
  };

  const handleUpdateActive = (field: keyof JournalEntryCMS, value: any) => {
    if (!activeJournal || activeIndex === -1) return;
    const next = [...journals];
    next[activeIndex] = { ...next[activeIndex], [field]: value };
    if (field === 'bodyHtml') {
      // Extract plain text from HTML for the paragraphs fallback array
      const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
      if (tempDiv) {
        tempDiv.innerHTML = String(value);
        const pEls = tempDiv.querySelectorAll('p, h1, h2, h3, li');
        const texts = Array.from(pEls).map(el => el.textContent?.trim()).filter(Boolean) as string[];
        next[activeIndex].paragraphs = texts.length ? texts : [String(value).replace(/<[^>]+>/g, '')];
      }
    }
    onChange(next);
  };

  const handleDelete = () => {
    if (deleteIdx === null) return;
    const removedId = journals[deleteIdx].id;
    const next = journals.filter((_, idx) => idx !== deleteIdx).map((item, idx) => ({ ...item, order: idx }));
    onChange(next);
    setDeleteIdx(null);
    if (activeId === removedId) setActiveId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Journals &amp; Field Notes ({journals.length})
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Manage carousel cards and reading views for investigative essays and field research.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding(!isAdding);
            setActiveId(null);
          }}
          className="px-4 py-2.5 bg-[#18191b] hover:bg-[#3e4143] text-white text-xs font-sans-clean font-medium rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'Write New Journal Entry'}
        </button>
      </div>

      {/* Add New Journal Drawer */}
      {isAdding && (
        <div className="p-6 bg-white border border-[#caccca] rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
          <h4 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
            Compose Journal Entry
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Chapter / Index *
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 03"
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Entry Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Field Notes: The Architecture of Memory"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Date / Season
              </label>
              <input
                type="text"
                placeholder="e.g. Winter 2025"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-sans-clean font-medium text-[#18191b]">
                  Reading Time
                </label>
                <button
                  type="button"
                  onClick={() => setNewReadTime(calculateReadTime(newBody))}
                  className="text-[10px] text-amber-800 hover:text-amber-900 font-sans-clean underline flex items-center gap-1"
                  title="Auto-calculate from word count"
                >
                  <Clock className="w-2.5 h-2.5" /> Auto
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={newReadTime}
                onChange={(e) => setNewReadTime(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Kaduna, Nigeria"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <ImageUploader
            label="Cover Photograph *"
            value={newCover}
            onChange={(url) => setNewCover(url)}
            helperText="Featured cover image for journals carousel."
          />

          <WysiwygEditor
            label="Full Essay Body (Reading View)"
            value={newBody}
            onChange={(val) => {
              setNewBody(val);
              setNewReadTime(calculateReadTime(val));
              const extracted = extractExcerptFromHtml(val);
              if (extracted) {
                setNewExcerpt(extracted);
              }
            }}
            placeholder="Begin writing the essay here — use the toolbar above to format headings, bold, lists, and more…"
            minHeight="320px"
          />

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
              Save Journal
            </button>
          </div>
        </div>
      )}

      {/* Grid: List on Left, Active Item on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Journals List Sidebar */}
        <div className="lg:col-span-4 bg-white border border-[#caccca] rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="font-serif-luxury text-base text-[#18191b] uppercase tracking-wider mb-2">
            Entries ({journals.length})
          </h4>

          <div className="space-y-2">
            {journals.map((journal, index) => {
              const isSelected = activeId === journal.id;

              return (
                <div
                  key={journal.id}
                  onClick={() => {
                    setActiveId(journal.id);
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
                        src={journal.coverImage}
                        alt={journal.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-sans-clean text-[#8c8e90] block uppercase tracking-wider">
                        {journal.chapter}
                      </span>
                      <h5 className="font-serif-luxury text-sm text-[#18191b] truncate uppercase">
                        {journal.title}
                      </h5>
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
                      disabled={index === journals.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3 text-[#18191b]" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => setDeleteIdx(index)}
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

        {/* Active Journal Editor */}
        <div className="lg:col-span-8">
          {activeJournal ? (
            <div className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#caccca] pb-4">
                <div>
                  <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mb-1">
                    {activeJournal.chapter}
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#18191b] uppercase">
                    {activeJournal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeJournal.status}
                    onChange={(e) => handleUpdateActive('status', e.target.value as any)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#caccca] bg-white font-sans-clean font-medium text-[#18191b]"
                  >
                    <option value="published">Status: Published</option>
                    <option value="draft">Status: Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={activeJournal.chapter}
                    onChange={(e) => handleUpdateActive('chapter', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={activeJournal.title}
                    onChange={(e) => handleUpdateActive('title', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    value={activeJournal.date}
                    onChange={(e) => handleUpdateActive('date', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-sans-clean font-medium text-[#18191b]">
                      Reading Time
                    </label>
                    <button
                      type="button"
                      onClick={() => handleUpdateActive('readTime', calculateReadTime(activeJournal.bodyHtml || ''))}
                      className="text-[10px] text-amber-800 hover:text-amber-900 font-sans-clean underline flex items-center gap-1"
                      title="Auto-calculate from word count"
                    >
                      <Clock className="w-2.5 h-2.5" /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeJournal.readTime}
                    onChange={(e) => handleUpdateActive('readTime', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={activeJournal.location}
                    onChange={(e) => handleUpdateActive('location', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Cover Photograph"
                value={activeJournal.coverImage}
                onChange={(url) => handleUpdateActive('coverImage', url)}
                helperText="Primary image displayed in carousel card."
              />

              {/* WYSIWYG Body */}
              <WysiwygEditor
                label="Full Journal Text (Reading View)"
                value={activeJournal.bodyHtml || activeJournal.paragraphs.map(p => `<p>${p}</p>`).join('')}
                onChange={(val) => {
                  handleUpdateActive('bodyHtml', val);
                  handleUpdateActive('readTime', calculateReadTime(val));
                  const autoExcerpt = extractExcerptFromHtml(val);
                  if (autoExcerpt) {
                    handleUpdateActive('excerpt', autoExcerpt);
                  }
                }}
                minHeight="420px"
                placeholder="Begin writing — use the toolbar for headings, bold, lists, and blockquotes. Select any text for a quick formatting bubble."
              />
            </div>
          ) : (
            <div className="bg-white border border-[#caccca] rounded-2xl p-12 text-center text-[#8c8e90]">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-serif-luxury text-lg text-[#18191b] uppercase">
                Select an entry from the left
              </p>
              <p className="font-sans-clean text-xs mt-1">
                Or click &ldquo;Write New Journal Entry&rdquo; to draft a new piece.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteIdx !== null}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This will be saved to your draft."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
};
