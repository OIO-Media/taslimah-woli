'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AssignmentProjectCMS } from '@/lib/cms-types';
import { ImageUploader } from './ImageUploader';
import { GalleryManager } from './GalleryManager';
import { ConfirmModal } from './ConfirmModal';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';

interface AssignmentsEditorProps {
  assignments: AssignmentProjectCMS[];
  onChange: (assignments: AssignmentProjectCMS[]) => void;
}

export const AssignmentsEditor: React.FC<AssignmentsEditorProps> = ({ assignments, onChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New assignment state
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCommissionType, setNewCommissionType] = useState('Editorial & Architectural Study');
  const [newYear, setNewYear] = useState('2024');
  const [newLocation, setNewLocation] = useState('Nigeria');
  const [newLead, setNewLead] = useState('');
  const [newCover, setNewCover] = useState('');

  const activeAssignment = assignments.find((a) => a.id === activeId) || null;
  const activeIndex = assignments.findIndex((a) => a.id === activeId);

  const handleAddNew = () => {
    if (!newTitle.trim() || !newCover.trim()) return;

    const id = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `assignment-${Date.now()}`;

    const newAssignment: AssignmentProjectCMS = {
      id,
      title: newTitle.trim(),
      client: newClient.trim() || 'Selected Client',
      subtitle: newCommissionType.trim(),
      commissionType: newCommissionType.trim(),
      year: newYear.trim(),
      location: newLocation.trim(),
      leadParagraph: newLead.trim() || 'Commissioned documentary study by Taslimah Woli.',
      coverImage: newCover.trim(),
      order: assignments.length,
      status: 'published',
      photos: [
        {
          id: `photo-${id}-0`,
          url: newCover.trim(),
          caption: `${newTitle.trim()} study for ${newClient.trim()}`,
          order: 0,
        },
      ],
    };

    onChange([...assignments, newAssignment]);
    setNewTitle('');
    setNewClient('');
    setNewLead('');
    setNewCover('');
    setIsAdding(false);
    setActiveId(id);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= assignments.length) return;

    const next = [...assignments];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    const updated = next.map((item, idx) => ({ ...item, order: idx }));
    onChange(updated);
  };

  const handleUpdateActive = (field: keyof AssignmentProjectCMS, value: any) => {
    if (!activeAssignment || activeIndex === -1) return;
    const next = [...assignments];
    next[activeIndex] = { ...next[activeIndex], [field]: value };
    onChange(next);
  };

  const handleDelete = () => {
    if (deleteIdx === null) return;
    const removedId = assignments[deleteIdx].id;
    const next = assignments.filter((_, idx) => idx !== deleteIdx).map((item, idx) => ({ ...item, order: idx }));
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
            Institutional &amp; Editorial Assignments ({assignments.length})
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Manage commissioned fieldwork, client credentials, and architectural photo series.
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
          {isAdding ? 'Cancel' : 'Create New Assignment'}
        </button>
      </div>

      {/* Add New Assignment Form */}
      {isAdding && (
        <div className="p-6 bg-white border border-[#caccca] rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
          <h4 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
            New Commission / Assignment Entry
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Modernist Spatial Geometry"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Client / Publication Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Architectural Atelier / Tell That Story"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Commission Type
              </label>
              <input
                type="text"
                placeholder="e.g. Institutional Documentation"
                value={newCommissionType}
                onChange={(e) => setNewCommissionType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Lagos, Nigeria"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2024"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>
          </div>

          <ImageUploader
            label="Cover Photograph *"
            value={newCover}
            onChange={(url) => setNewCover(url)}
            helperText="Lead image for carousel card."
          />

          <div>
            <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
              Assignment Overview / Brief
            </label>
            <textarea
              rows={3}
              placeholder="Describe the institutional commission scope, spatial focus, and visual documentation methodology..."
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
              Save Assignment
            </button>
          </div>
        </div>
      )}

      {/* Grid: List on Left, Active Item on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Assignments List Sidebar */}
        <div className="lg:col-span-4 bg-white border border-[#caccca] rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="font-serif-luxury text-base text-[#18191b] uppercase tracking-wider mb-2">
            Assignments ({assignments.length})
          </h4>

          <div className="space-y-2">
            {assignments.map((assignment, index) => {
              const isSelected = activeId === assignment.id;

              return (
                <div
                  key={assignment.id}
                  onClick={() => {
                    setActiveId(assignment.id);
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
                        src={assignment.coverImage}
                        alt={assignment.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-serif-luxury text-sm text-[#18191b] truncate uppercase">
                        {assignment.title}
                      </h5>
                      <p className="font-sans-clean text-[10px] text-[#8c8e90] truncate">
                        {assignment.client} · {assignment.photos.length} photos
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
                      disabled={index === assignments.length - 1}
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

        {/* Active Assignment Editor */}
        <div className="lg:col-span-8">
          {activeAssignment ? (
            <div className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#caccca] pb-4">
                <div>
                  <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mb-1">
                    Commissioned Work
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#18191b] uppercase">
                    {activeAssignment.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeAssignment.status}
                    onChange={(e) => handleUpdateActive('status', e.target.value as any)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#caccca] bg-white font-sans-clean font-medium text-[#18191b]"
                  >
                    <option value="published">Status: Published</option>
                    <option value="draft">Status: Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={activeAssignment.title}
                    onChange={(e) => handleUpdateActive('title', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={activeAssignment.client}
                    onChange={(e) => handleUpdateActive('client', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Commission Type
                  </label>
                  <input
                    type="text"
                    value={activeAssignment.commissionType}
                    onChange={(e) => handleUpdateActive('commissionType', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={activeAssignment.location}
                    onChange={(e) => handleUpdateActive('location', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={activeAssignment.year}
                    onChange={(e) => handleUpdateActive('year', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Cover Photograph"
                value={activeAssignment.coverImage}
                onChange={(url) => handleUpdateActive('coverImage', url)}
                helperText="Cover photograph for assignment carousel."
              />

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Commission Overview
                </label>
                <textarea
                  rows={3}
                  value={activeAssignment.leadParagraph}
                  onChange={(e) => handleUpdateActive('leadParagraph', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>

              {/* Gallery Manager */}
              <div className="pt-4 border-t border-[#caccca]">
                <GalleryManager
                  photos={activeAssignment.photos}
                  onChange={(photos) => handleUpdateActive('photos', photos)}
                  title={`${activeAssignment.title} Photos`}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#caccca] rounded-2xl p-12 text-center text-[#8c8e90]">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-serif-luxury text-lg text-[#18191b] uppercase">
                Select an assignment from the left
              </p>
              <p className="font-sans-clean text-xs mt-1">
                Or click &ldquo;Create New Assignment&rdquo; to add a new commissioned project.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteIdx !== null}
        title="Delete Assignment"
        message="Are you sure you want to remove this commissioned assignment? This change will be saved to your working draft."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
};
