'use client';

import React, { useState } from 'react';
import { AboutContentCMS, CredibilityItem } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { ConfirmModal } from './ConfirmModal';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2, Award, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface AboutEditorProps {
  about: AboutContentCMS;
  onChange: (about: AboutContentCMS) => void;
}

const CATEGORY_PRESETS = [
  'Commissions & Features',
  'Exhibitions',
  'Critiques & Masterclasses',
  'Artist Residencies',
  'Published Essay & Grants',
  'Lectures & Presentations',
  'Awards & Honors',
];

export const AboutEditor: React.FC<AboutEditorProps> = ({ about, onChange }) => {
  const [deleteCredIdx, setDeleteCredIdx] = useState<number | null>(null);
  const [deleteBioIdx, setDeleteBioIdx] = useState<number | null>(null);

  // New credibility item state
  const [isAddingCred, setIsAddingCred] = useState(false);
  const [newCredCategory, setNewCredCategory] = useState(CATEGORY_PRESETS[0]);
  const [newCredTitle, setNewCredTitle] = useState('');
  const [newCredUrl, setNewCredUrl] = useState('');

  // Bio paragraph management
  const handleUpdateBioParagraph = (index: number, text: string) => {
    const list = [...about.bioParagraphs];
    list[index] = text;
    onChange({ ...about, bioParagraphs: list });
  };

  const handleAddBioParagraph = () => {
    onChange({
      ...about,
      bioParagraphs: [...about.bioParagraphs, ''],
    });
  };

  const handleRemoveBioParagraph = () => {
    if (deleteBioIdx === null) return;
    const list = about.bioParagraphs.filter((_, idx) => idx !== deleteBioIdx);
    onChange({ ...about, bioParagraphs: list });
    setDeleteBioIdx(null);
  };

  // Credibility items management
  const handleAddCredibility = () => {
    if (!newCredTitle.trim()) return;

    const newItem: CredibilityItem = {
      id: `cred-${Date.now()}`,
      category: newCredCategory,
      title: newCredTitle.trim(),
      url: newCredUrl.trim() || undefined,
      order: about.credibilityItems.length,
    };

    onChange({
      ...about,
      credibilityItems: [...about.credibilityItems, newItem],
    });
    setNewCredTitle('');
    setNewCredUrl('');
    setIsAddingCred(false);
  };

  const handleMoveCred = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= about.credibilityItems.length) return;

    const list = [...about.credibilityItems];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const updated = list.map((item, idx) => ({ ...item, order: idx }));
    onChange({ ...about, credibilityItems: updated });
  };

  const handleUpdateCred = (index: number, field: keyof CredibilityItem, value: string) => {
    const list = [...about.credibilityItems];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...about, credibilityItems: list });
  };

  const handleDeleteCred = () => {
    if (deleteCredIdx === null) return;
    const list = about.credibilityItems.filter((_, idx) => idx !== deleteCredIdx).map((item, idx) => ({ ...item, order: idx }));
    onChange({ ...about, credibilityItems: list });
    setDeleteCredIdx(null);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: PORTRAIT & BIO PARAGRAPHS */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#caccca] pb-4">
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Artist Portrait &amp; Biography
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Edit the portrait photograph, narrative paragraphs, and spatial methodology statements.
          </p>
        </div>

        <ImageUploader
          label="Portrait Photograph"
          value={about.portraitImage}
          altText={about.portraitAlt}
          onAltChange={(alt) => onChange({ ...about, portraitAlt: alt })}
          onChange={(url) => onChange({ ...about, portraitImage: url })}
          helperText="High-resolution monochrome or architectural portrait of Taslimah Woli."
          aspectRatioHint="Portrait ratio (approx 4:5 or 3:4)"
        />

        <div className="space-y-4 pt-4 border-t border-[#caccca]">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b]">
              Bio Narrative Paragraphs ({about.bioParagraphs.length})
            </label>
            <button
              type="button"
              onClick={handleAddBioParagraph}
              className="text-xs font-sans-clean font-medium text-[#18191b] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Paragraph
            </button>
          </div>

          <div className="space-y-3">
            {about.bioParagraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="font-mono text-xs text-[#8c8e90] pt-2 w-6 text-center shrink-0">
                  {index + 1}.
                </span>
                <textarea
                  rows={4}
                  value={paragraph}
                  onChange={(e) => handleUpdateBioParagraph(index, e.target.value)}
                  placeholder={`Bio paragraph ${index + 1}...`}
                  className="flex-1 text-xs px-3 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b] leading-relaxed"
                />
                <button
                  type="button"
                  title="Remove paragraph"
                  disabled={about.bioParagraphs.length <= 1}
                  onClick={() => setDeleteBioIdx(index)}
                  className="p-2 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-30 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: INDIVIDUALLY ADDABLE/EDITABLE CREDIBILITY LIST */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#caccca] pb-4">
          <div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
              Selected Credibility &amp; Career Records ({about.credibilityItems.length})
            </h3>
            <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
              Each commission, exhibition, residency, critique, and grant is individually editable, reorderable, and removable.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingCred(!isAddingCred)}
            className="px-4 py-2.5 bg-[#18191b] hover:bg-[#3e4143] text-white text-xs font-sans-clean font-medium rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {isAddingCred ? 'Cancel' : 'Add Credibility Item'}
          </button>
        </div>

        {/* Add Credibility Item Drawer */}
        {isAddingCred && (
          <div className="p-5 bg-[#f7f8f8] border border-[#caccca] rounded-xl space-y-4 animate-in fade-in duration-150">
            <h4 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
              New Credibility Record
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Category
                </label>
                <select
                  value={newCredCategory}
                  onChange={(e) => setNewCredCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                >
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Description / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open Arts (Kaduna) · Rongo Art Foundation (Benin City)"
                  value={newCredTitle}
                  onChange={(e) => setNewCredTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Link / URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://... or /journals?journal=..."
                  value={newCredUrl}
                  onChange={(e) => setNewCredUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingCred(false)}
                className="px-4 py-2 border border-[#caccca] text-xs font-sans-clean font-medium rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newCredTitle.trim()}
                onClick={handleAddCredibility}
                className="px-5 py-2 bg-[#18191b] disabled:opacity-40 text-white text-xs font-sans-clean font-medium rounded-lg hover:bg-[#3e4143]"
              >
                Save Record
              </button>
            </div>
          </div>
        )}

        {/* Existing Credibility Items List */}
        <div className="space-y-3">
          {about.credibilityItems.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3.5 bg-[#fafafa] border border-[#caccca] rounded-xl flex flex-col sm:flex-row items-center gap-4 transition-all"
            >
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs text-[#8c8e90] w-5 text-center">
                  #{index + 1}
                </span>
                <span className="w-7 h-7 rounded-full bg-[#eeefef] border border-[#caccca] flex items-center justify-center text-[#18191b]">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleUpdateCred(index, 'category', e.target.value)}
                    placeholder="Category"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-white text-[#8c8e90] uppercase tracking-wider font-semibold focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateCred(index, 'title', e.target.value)}
                    placeholder="Details e.g. Exhibition title, venue, grant name"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b] font-medium focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={item.url || ''}
                      onChange={(e) => handleUpdateCred(index, 'url', e.target.value)}
                      placeholder="Link URL (optional)"
                      className="w-full text-xs px-2.5 py-1.5 pr-7 rounded border border-[#caccca] bg-white text-[#18191b] placeholder:text-[#8c8e90] focus:outline-none focus:border-[#18191b]"
                    />
                    {item.url && (
                      <a
                        href={item.url}
                        target={item.url.startsWith('http') ? '_blank' : undefined}
                        rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="absolute right-2 text-[#8c8e90] hover:text-[#18191b]"
                        title="Open link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => handleMoveCred(index, 'up')}
                  className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 text-[#18191b]"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={index === about.credibilityItems.length - 1}
                  onClick={() => handleMoveCred(index, 'down')}
                  className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 text-[#18191b]"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove item"
                  onClick={() => setDeleteCredIdx(index)}
                  className="p-1.5 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: DIRECT CONTACT & SOCIAL LINKS */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#caccca] pb-4">
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Direct Inquiries &amp; Social Links
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Contact email, WhatsApp link, and social profiles shown on the About page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
              Direct Contact Email
            </label>
            <input
              type="email"
              value={about.email}
              onChange={(e) => onChange({ ...about, email: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
              Location Line
            </label>
            <input
              type="text"
              value={about.location}
              onChange={(e) => onChange({ ...about, location: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={about.socials?.instagram || ''}
              onChange={(e) =>
                onChange({
                  ...about,
                  socials: { ...about.socials, instagram: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              WhatsApp Link
            </label>
            <input
              type="url"
              value={about.socials?.whatsapp || ''}
              onChange={(e) =>
                onChange({
                  ...about,
                  socials: { ...about.socials, whatsapp: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={about.socials?.linkedin || ''}
              onChange={(e) =>
                onChange({
                  ...about,
                  socials: { ...about.socials, linkedin: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={about.socials?.facebook || ''}
              onChange={(e) =>
                onChange({
                  ...about,
                  socials: { ...about.socials, facebook: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
            />
          </div>
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={deleteCredIdx !== null}
        title="Remove Credibility Record"
        message="Are you sure you want to remove this record from the About page? This will be saved to your working draft."
        confirmLabel="Remove"
        onConfirm={handleDeleteCred}
        onCancel={() => setDeleteCredIdx(null)}
      />

      <ConfirmModal
        isOpen={deleteBioIdx !== null}
        title="Remove Bio Paragraph"
        message="Are you sure you want to delete this paragraph from your biography?"
        confirmLabel="Remove"
        onConfirm={handleRemoveBioParagraph}
        onCancel={() => setDeleteBioIdx(null)}
      />
    </div>
  );
};
