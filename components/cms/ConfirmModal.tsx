'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#18191b]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#eeefef] border border-[#caccca] rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isDestructive && (
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <h3 className="font-serif-luxury text-xl text-[#18191b] font-normal uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#8c8e90] hover:text-[#18191b] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="font-sans-clean text-sm text-[#3e4143] leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-[#caccca] font-sans-clean text-xs font-medium text-[#18191b] hover:bg-[#e4e5e5] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg font-sans-clean text-xs font-medium tracking-wide uppercase transition-colors ${
              isDestructive
                ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                : 'bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
