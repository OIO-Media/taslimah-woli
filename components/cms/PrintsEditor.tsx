'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PrintItemCMS, PrintSizeTier } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { ConfirmModal } from './ConfirmModal';
import { Plus, Trash2, ArrowUp, ArrowDown, ShoppingBag, DollarSign, Layers } from 'lucide-react';

interface PrintsEditorProps {
  prints: PrintItemCMS[];
  onChange: (prints: PrintItemCMS[]) => void;
}

export const PrintsEditor: React.FC<PrintsEditorProps> = ({ prints, onChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Print state
  const [newTitle, setNewTitle] = useState('');
  const [newSeries, setNewSeries] = useState('People and Places');
  const [newMedium, setNewMedium] = useState('Archival Pigment Print on Cotton Rag');
  const [newPaper, setNewPaper] = useState('Hahnemühle Photo Rag 308gsm (100% Cotton)');
  const [newEditionSize, setNewEditionSize] = useState('Edition of 15 + 2 Artist Proofs');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('Hand-signed and numbered in graphite on recto, accompanied by stamped certificate of authenticity.');

  // Default tiers for new print
  const [newSizes, setNewSizes] = useState<PrintSizeTier[]>([
    { id: 'size-1', label: 'Studio Edition', dimensions: '16 × 20 in (40 × 50 cm)', price: '$650', inStock: true },
    { id: 'size-2', label: 'Gallery Edition', dimensions: '24 × 36 in (60 × 90 cm)', price: '$1,250', inStock: true },
    { id: 'size-3', label: 'Exhibition Edition', dimensions: '30 × 45 in (75 × 115 cm)', price: '$2,200', inStock: true },
  ]);

  const activePrint = prints.find((p) => p.id === activeId) || null;
  const activeIndex = prints.findIndex((p) => p.id === activeId);

  const handleAddNew = () => {
    if (!newTitle.trim() || !newImage.trim()) return;

    const id = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `print-${Date.now()}`;

    const newPrint: PrintItemCMS = {
      id,
      title: newTitle.trim(),
      series: newSeries.trim(),
      medium: newMedium.trim(),
      paper: newPaper.trim(),
      editionSize: newEditionSize.trim(),
      image: newImage.trim(),
      description: newDescription.trim(),
      order: prints.length,
      status: 'published',
      sizes: newSizes,
    };

    onChange([...prints, newPrint]);
    setNewTitle('');
    setNewImage('');
    setIsAdding(false);
    setActiveId(id);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= prints.length) return;

    const next = [...prints];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    const updated = next.map((item, idx) => ({ ...item, order: idx }));
    onChange(updated);
  };

  const handleUpdateActive = (field: keyof PrintItemCMS, value: any) => {
    if (!activePrint || activeIndex === -1) return;
    const next = [...prints];
    next[activeIndex] = { ...next[activeIndex], [field]: value };
    onChange(next);
  };

  // Size tier updates
  const handleUpdateSizeTier = (sizeIdx: number, field: keyof PrintSizeTier, val: any) => {
    if (!activePrint || activeIndex === -1) return;
    const sizes = [...activePrint.sizes];
    sizes[sizeIdx] = { ...sizes[sizeIdx], [field]: val };
    handleUpdateActive('sizes', sizes);
  };

  const handleAddSizeTier = () => {
    if (!activePrint) return;
    const nextTier: PrintSizeTier = {
      id: `size-${Date.now()}`,
      label: 'New Edition Tier',
      dimensions: '20 × 30 in',
      price: '$950',
      inStock: true,
    };
    handleUpdateActive('sizes', [...activePrint.sizes, nextTier]);
  };

  const handleRemoveSizeTier = (sizeIdx: number) => {
    if (!activePrint) return;
    const sizes = activePrint.sizes.filter((_, idx) => idx !== sizeIdx);
    handleUpdateActive('sizes', sizes);
  };

  const handleDelete = () => {
    if (deleteIdx === null) return;
    const removedId = prints[deleteIdx].id;
    const next = prints.filter((_, idx) => idx !== deleteIdx).map((item, idx) => ({ ...item, order: idx }));
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
            Limited Edition Prints Catalog ({prints.length})
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Manage museum-grade prints, cotton rag paper specs, dimension editions, and tier pricing.
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
          {isAdding ? 'Cancel' : 'Add New Print to Catalog'}
        </button>
      </div>

      {/* Add New Print Form */}
      {isAdding && (
        <div className="p-6 bg-white border border-[#caccca] rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
          <h4 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
            Catalog New Limited Edition Print
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Print Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Domestic Threshold, Morning Light"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Series / Body of Work *
              </label>
              <input
                type="text"
                placeholder="e.g. People and Places"
                value={newSeries}
                onChange={(e) => setNewSeries(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Medium
              </label>
              <input
                type="text"
                value={newMedium}
                onChange={(e) => setNewMedium(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Paper Specification
              </label>
              <input
                type="text"
                value={newPaper}
                onChange={(e) => setNewPaper(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Edition Run
              </label>
              <input
                type="text"
                value={newEditionSize}
                onChange={(e) => setNewEditionSize(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <ImageUploader
            label="Print Photograph *"
            value={newImage}
            onChange={(url) => setNewImage(url)}
            helperText="High-resolution image of the print artwork."
          />

          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              Curatorial Description &amp; Certificate Note
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
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
              disabled={!newTitle.trim() || !newImage.trim()}
              onClick={handleAddNew}
              className="px-5 py-2 bg-[#18191b] disabled:opacity-40 text-white text-xs font-sans-clean font-medium rounded-lg hover:bg-[#3e4143]"
            >
              Add to Catalog
            </button>
          </div>
        </div>
      )}

      {/* Grid: Print list on Left, Active Print Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Prints List Sidebar */}
        <div className="lg:col-span-4 bg-white border border-[#caccca] rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="font-serif-luxury text-base text-[#18191b] uppercase tracking-wider mb-2">
            Catalog Items ({prints.length})
          </h4>

          <div className="space-y-2">
            {prints.map((print, index) => {
              const isSelected = activeId === print.id;

              return (
                <div
                  key={print.id}
                  onClick={() => {
                    setActiveId(print.id);
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
                        src={print.image}
                        alt={print.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-sans-clean text-[#8c8e90] block truncate uppercase">
                        {print.series}
                      </span>
                      <h5 className="font-serif-luxury text-sm text-[#18191b] truncate uppercase">
                        {print.title}
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
                      disabled={index === prints.length - 1}
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

        {/* Active Print Details & Sizing Editor */}
        <div className="lg:col-span-8">
          {activePrint ? (
            <div className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#caccca] pb-4">
                <div>
                  <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mb-1">
                    {activePrint.series}
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#18191b] uppercase">
                    {activePrint.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activePrint.status}
                    onChange={(e) => handleUpdateActive('status', e.target.value as any)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#caccca] bg-white font-sans-clean font-medium text-[#18191b]"
                  >
                    <option value="published">Status: In Catalog</option>
                    <option value="draft">Status: Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Print Title
                  </label>
                  <input
                    type="text"
                    value={activePrint.title}
                    onChange={(e) => handleUpdateActive('title', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Series Name
                  </label>
                  <input
                    type="text"
                    value={activePrint.series}
                    onChange={(e) => handleUpdateActive('series', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={activePrint.medium}
                    onChange={(e) => handleUpdateActive('medium', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Paper Specification
                  </label>
                  <input
                    type="text"
                    value={activePrint.paper}
                    onChange={(e) => handleUpdateActive('paper', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Edition Run
                  </label>
                  <input
                    type="text"
                    value={activePrint.editionSize}
                    onChange={(e) => handleUpdateActive('editionSize', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Artwork Image"
                value={activePrint.image}
                onChange={(url) => handleUpdateActive('image', url)}
                helperText="Primary image showcased in prints catalog card and inquiry modal."
              />

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Provenance &amp; Certificate Description
                </label>
                <textarea
                  rows={2}
                  value={activePrint.description}
                  onChange={(e) => handleUpdateActive('description', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>

              {/* Sizing & Pricing Tiers */}
              <div className="pt-4 border-t border-[#caccca] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-luxury text-base text-[#18191b] uppercase tracking-wide">
                      Dimensions &amp; Edition Tier Pricing ({activePrint.sizes.length})
                    </h4>
                    <p className="font-sans-clean text-xs text-[#8c8e90]">
                      Add custom sizes, paper dimensions, and edition pricing tiers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSizeTier}
                    className="text-xs font-sans-clean font-medium text-[#18191b] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size Tier
                  </button>
                </div>

                <div className="space-y-3">
                  {activePrint.sizes.map((size, sIdx) => (
                    <div
                      key={size.id || sIdx}
                      className="p-3 bg-[#f7f8f8] border border-[#caccca] rounded-xl flex flex-col sm:flex-row items-center gap-3"
                    >
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                          Tier Label
                        </label>
                        <input
                          type="text"
                          value={size.label}
                          onChange={(e) => handleUpdateSizeTier(sIdx, 'label', e.target.value)}
                          placeholder="e.g. Gallery Edition"
                          className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b] font-medium"
                        />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={size.dimensions}
                          onChange={(e) => handleUpdateSizeTier(sIdx, 'dimensions', e.target.value)}
                          placeholder="e.g. 24 × 36 in (60 × 90 cm)"
                          className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b]"
                        />
                      </div>
                      <div className="w-full sm:w-1/4">
                        <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                          Price
                        </label>
                        <input
                          type="text"
                          value={size.price}
                          onChange={(e) => handleUpdateSizeTier(sIdx, 'price', e.target.value)}
                          placeholder="$1,250"
                          className="w-full text-xs px-2.5 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b] font-semibold"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={activePrint.sizes.length <= 1}
                        onClick={() => handleRemoveSizeTier(sIdx)}
                        className="p-2 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-30 self-end sm:self-center shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#caccca] rounded-2xl p-12 text-center text-[#8c8e90]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-serif-luxury text-lg text-[#18191b] uppercase">
                Select a print from the left
              </p>
              <p className="font-sans-clean text-xs mt-1">
                Or click &ldquo;Add New Print to Catalog&rdquo; to add a new edition.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteIdx !== null}
        title="Remove Print from Catalog"
        message="Are you sure you want to remove this print edition from the catalog? This change will be saved to your working draft."
        confirmLabel="Remove Print"
        onConfirm={handleDelete}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
};
