'use client';

import React, { useState } from 'react';
import { ContactDeskCMS } from '@/lib/cms-types';
import { ConfirmModal } from './ConfirmModal';
import { Plus, Trash2, ArrowUp, ArrowDown, Globe, Mail, Phone } from 'lucide-react';

interface ContactEditorProps {
  availabilityBanner: string;
  desks: ContactDeskCMS[];
  onBannerChange: (banner: string) => void;
  onDesksChange: (desks: ContactDeskCMS[]) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({
  availabilityBanner,
  desks,
  onBannerChange,
  onDesksChange,
}) => {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New desk state
  const [newCity, setNewCity] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newTel, setNewTel] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleAddNew = () => {
    if (!newCity.trim() || !newEmail.trim()) return;

    const newDesk: ContactDeskCMS = {
      id: `desk-${Date.now()}`,
      city: newCity.trim().toUpperCase(),
      role: newRole.trim(),
      address: newAddress.trim(),
      postal: newPostal.trim(),
      tel: newTel.trim() || 'Direct inquiry via email',
      email: newEmail.trim(),
      order: desks.length,
    };

    onDesksChange([...desks, newDesk]);
    setNewCity('');
    setNewRole('');
    setNewAddress('');
    setNewPostal('');
    setNewTel('');
    setNewEmail('');
    setIsAdding(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= desks.length) return;

    const list = [...desks];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const updated = list.map((item, idx) => ({ ...item, order: idx }));
    onDesksChange(updated);
  };

  const handleUpdateDesk = (index: number, field: keyof ContactDeskCMS, value: string) => {
    const list = [...desks];
    list[index] = { ...list[index], [field]: value };
    if (field === 'city') {
      list[index].city = value.toUpperCase();
    }
    onDesksChange(list);
  };

  const handleDelete = () => {
    if (deleteIdx === null) return;
    const list = desks.filter((_, idx) => idx !== deleteIdx).map((item, idx) => ({ ...item, order: idx }));
    onDesksChange(list);
    setDeleteIdx(null);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: AVAILABILITY STATEMENT BANNER */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b border-[#caccca] pb-4">
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
            Availability Headline Banner
          </h3>
          <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
            Displayed prominently at the top of the Contact page.
          </p>
        </div>

        <div>
          <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#18191b] mb-1.5">
            Availability &amp; Operating Territory Statement
          </label>
          <textarea
            rows={2}
            value={availabilityBanner}
            onChange={(e) => onBannerChange(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b] leading-relaxed"
          />
        </div>
      </section>

      {/* SECTION 2: CONTACT & REPRESENTATION DESKS */}
      <section className="bg-white border border-[#caccca] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#caccca] pb-4">
          <div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18191b] uppercase tracking-wide">
              Studio Representation Desks ({desks.length})
            </h3>
            <p className="font-sans-clean text-xs text-[#8c8e90] mt-1">
              Commissions, Studio &amp; Archive, and Print Editions inquiries. Add, edit, or reorder.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2.5 bg-[#18191b] hover:bg-[#3e4143] text-white text-xs font-sans-clean font-medium rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'Cancel' : 'Add Representation Desk'}
          </button>
        </div>

        {/* Add Desk Drawer */}
        {isAdding && (
          <div className="p-5 bg-[#f7f8f8] border border-[#caccca] rounded-xl space-y-4 animate-in fade-in duration-150">
            <h4 className="font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
              New Representation Desk
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Desk Label / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. COMMISSIONS & EDITORIAL"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Role / Scope *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Publications & Cultural Institutions"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                Description / Coverage
              </label>
              <textarea
                rows={2}
                placeholder="Direct commissioning desk for documentary, architectural, and editorial assignments..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Territory
                </label>
                <input
                  type="text"
                  placeholder="e.g. Local & International Coverage"
                  value={newPostal}
                  onChange={(e) => setNewPostal(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Booking Note / Tel
                </label>
                <input
                  type="text"
                  placeholder="e.g. Field bookings & consultations"
                  value={newTel}
                  onChange={(e) => setNewTel(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1">
                  Desk Email *
                </label>
                <input
                  type="email"
                  placeholder="inquiries@taslimahwoli.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-[#caccca] text-xs font-sans-clean font-medium rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newCity.trim() || !newEmail.trim()}
                onClick={handleAddNew}
                className="px-5 py-2 bg-[#18191b] disabled:opacity-40 text-white text-xs font-sans-clean font-medium rounded-lg hover:bg-[#3e4143]"
              >
                Save Desk
              </button>
            </div>
          </div>
        )}

        {/* Existing Desks List */}
        <div className="space-y-4">
          {desks.map((desk, index) => (
            <div
              key={desk.id || index}
              className="p-5 bg-[#fafafa] border border-[#caccca] rounded-xl space-y-4 transition-all"
            >
              <div className="flex items-center justify-between border-b border-[#caccca]/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#8c8e90]">#{index + 1}</span>
                  <input
                    type="text"
                    value={desk.city}
                    onChange={(e) => handleUpdateDesk(index, 'city', e.target.value)}
                    className="font-serif-luxury text-lg text-[#18191b] uppercase bg-transparent border-b border-transparent focus:border-[#18191b] focus:outline-none px-1"
                  />
                </div>

                <div className="flex items-center gap-1.5">
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
                    disabled={index === desks.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 rounded border border-[#caccca] hover:bg-[#e4e5e5] disabled:opacity-30 text-[#18191b]"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete desk"
                    disabled={desks.length <= 1}
                    onClick={() => setDeleteIdx(index)}
                    className="p-1.5 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={desk.role}
                    onChange={(e) => handleUpdateDesk(index, 'role', e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                    Desk Email
                  </label>
                  <input
                    type="email"
                    value={desk.email}
                    onChange={(e) => handleUpdateDesk(index, 'email', e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                  Scope &amp; Description
                </label>
                <textarea
                  rows={2}
                  value={desk.address}
                  onChange={(e) => handleUpdateDesk(index, 'address', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                    Territory
                  </label>
                  <input
                    type="text"
                    value={desk.postal}
                    onChange={(e) => handleUpdateDesk(index, 'postal', e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] mb-0.5">
                    Booking Note
                  </label>
                  <input
                    type="text"
                    value={desk.tel}
                    onChange={(e) => handleUpdateDesk(index, 'tel', e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-[#caccca] bg-white text-[#18191b]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteIdx !== null}
        title="Remove Representation Desk"
        message="Are you sure you want to remove this contact desk from the Contact page? This change will be saved to your working draft."
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
};
