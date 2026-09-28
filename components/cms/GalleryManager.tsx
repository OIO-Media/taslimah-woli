'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryPhoto } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { ConfirmModal } from './ConfirmModal';
import { ArrowUp, ArrowDown, Trash2, Plus, Edit2, Check, Camera, Image as ImageIcon } from 'lucide-react';

interface GalleryManagerProps {
  photos: GalleryPhoto[];
  onChange: (photos: GalleryPhoto[]) => void;
  title?: string;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  photos,
  onChange,
  title = 'Project Image Gallery',
}) => {
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoExif, setNewPhotoExif] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim(),
      exif: newPhotoExif.trim(),
      order: photos.length,
    };

    onChange([...photos, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoExif('');
    setIsAdding(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const next = [...photos];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);

    // Reassign order
    const updated = next.map((p, idx) => ({ ...p, order: idx }));
    onChange(updated);
  };

  const handleUpdatePhoto = (index: number, field: keyof GalleryPhoto, value: string) => {
    const next = [...photos];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleConfirmDelete = () => {
    if (deleteIdx === null) return;
    const next = photos.filter((_, idx) => idx !== deleteIdx).map((p, idx) => ({ ...p, order: idx }));
    onChange(next);
    setDeleteIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#caccca]">
        <div>
          <h4 className="font-serif-luxury text-lg text-[#18191b] uppercase tracking-wider">
            {title} ({photos.length})
          </h4>
          <p className="font-sans-clean text-xs text-[#8c8e90]">
            Add, caption, and arrange documentary images in sequence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] text-xs font-sans-clean font-medium rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAdding ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {/* Add New Photo Form Drawer */}
      {isAdding && (
        <div className="p-5 bg-white border border-[#caccca] rounded-xl shadow-sm space-y-4 animate-in fade-in duration-200">
          <h5 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
            Upload or Link New Image
          </h5>

          <ImageUploader
            label="Image File"
            value={newPhotoUrl}
            onChange={(url) => setNewPhotoUrl(url)}
            helperText="Raw camera files up to 50MB will be automatically optimized to clean WebP."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Image Caption / Inscription
              </label>
              <input
                type="text"
                placeholder="e.g. Threshold shadow, domestic courtyard, Lagos"
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Technical Data / EXIF (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 50mm · f/2.0 · 1/250s · ISO 100"
                value={newPhotoExif}
                onChange={(e) => setNewPhotoExif(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
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
              disabled={!newPhotoUrl.trim()}
              onClick={handleAddPhoto}
              className="px-5 py-2 bg-[#18191b] disabled:opacity-40 text-white text-xs font-sans-clean font-medium rounded-lg hover:bg-[#3e4143]"
            >
              Save to Gallery
            </button>
          </div>
        </div>
      )}

      {/* Photos List */}
      {photos.length === 0 ? (
        <div className="py-12 px-6 text-center border-2 border-dashed border-[#caccca] rounded-xl bg-[#f7f8f8]">
          <ImageIcon className="w-10 h-10 mx-auto text-[#8c8e90] mb-2 opacity-60" />
          <p className="font-sans-clean text-xs font-medium text-[#18191b]">
            No photographs added yet
          </p>
          <p className="font-sans-clean text-[11px] text-[#8c8e90] mt-1">
            Click &ldquo;Add Image&rdquo; above to upload the first photograph for this project.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              className="p-3.5 bg-white border border-[#caccca] rounded-xl flex flex-col sm:flex-row items-center gap-4 transition-shadow hover:shadow-2xs"
            >
              {/* Order badge & Thumbnail */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="w-6 text-center font-mono text-xs text-[#8c8e90]">
                  #{index + 1}
                </span>
                <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-[#18191b] border border-[#caccca] shrink-0">
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Project photo'}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                  />
                </div>
              </div>

              {/* Caption & EXIF fields */}
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => handleUpdatePhoto(index, 'caption', e.target.value)}
                    placeholder="Describe spatial context or subject..."
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-[#fcfcfc] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                    EXIF / Technical Note
                  </label>
                  <input
                    type="text"
                    value={photo.exif || ''}
                    onChange={(e) => handleUpdatePhoto(index, 'exif', e.target.value)}
                    placeholder="e.g. 35mm · f/2.8 · 1/500s"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-[#fcfcfc] text-[#18191b] focus:bg-white focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              {/* Reordering & Delete Controls */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  title="Move earlier in sequence"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 disabled:hover:bg-transparent text-[#18191b]"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Move later in sequence"
                  disabled={index === photos.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 disabled:hover:bg-transparent text-[#18191b]"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove photograph"
                  onClick={() => setDeleteIdx(index)}
                  className="p-1.5 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteIdx !== null}
        title="Remove Photograph"
        message="Are you sure you want to remove this photograph from the gallery? This change will be saved to your draft."
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
};
