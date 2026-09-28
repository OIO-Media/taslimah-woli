'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { optimizeImageFile, formatBytes, validateImageFile } from '@/lib/cms-image';

interface ImageUploaderProps {
  label: string;
  value: string;
  altText?: string;
  helperText?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  aspectRatioHint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  altText = '',
  helperText,
  onChange,
  onAltChange,
  aspectRatioHint = 'Landscape or portrait (auto-adjusted)',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setErrorMsg(null);
    setCompressionInfo(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsProcessing(true);
      const result = await optimizeImageFile(file, { maxWidth: 2400, maxHeight: 2400, quality: 0.86 });
      onChange(result.dataUrl);
      setCompressionInfo(
        `Optimized: ${formatBytes(result.originalSize)} → ${formatBytes(result.optimizedSize)} (${result.format.replace('image/', '').toUpperCase()})`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setShowUrlInput(false);
      setCompressionInfo('Applied web image link');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
          {label}
        </label>
        <span className="text-[11px] font-sans-clean text-[#8c8e90]">{aspectRatioHint}</span>
      </div>

      {value ? (
        <div className="relative border border-[#caccca] rounded-xl overflow-hidden bg-[#e4e5e5] p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-36 h-28 rounded-lg overflow-hidden shrink-0 border border-[#caccca] bg-[#18191b]">
            <Image
              src={value}
              alt={altText || label}
              fill
              className="object-cover"
              sizes="144px"
              unoptimized
            />
          </div>

          <div className="flex-1 w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-sans-clean font-medium text-emerald-800">
              <CheckCircle className="w-4 h-4" />
              <span>Image loaded</span>
            </div>

            {compressionInfo && (
              <p className="text-[11px] font-sans-clean text-[#3e4143] bg-white/70 px-2.5 py-1 rounded inline-block">
                {compressionInfo}
              </p>
            )}

            {onAltChange && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Accessibility description / alt text..."
                  value={altText}
                  onChange={(e) => onAltChange(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-md border border-[#caccca] bg-white font-sans-clean text-[11px] font-medium text-[#18191b] hover:bg-[#eeefef] transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" /> Replace Image
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setCompressionInfo(null);
                }}
                className="px-3 py-1.5 rounded-md border border-red-200 bg-red-50 font-sans-clean text-[11px] font-medium text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#18191b] bg-[#e4e5e5]'
              : 'border-[#caccca] hover:border-[#8c8e90] bg-[#f7f8f8]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <div className="w-8 h-8 border-2 border-[#18191b] border-t-transparent rounded-full animate-spin" />
              <p className="font-sans-clean text-xs text-[#18191b] font-medium">
                Optimizing &amp; converting image...
              </p>
              <p className="font-sans-clean text-[11px] text-[#8c8e90]">
                Automatic WebP compression &amp; size adjustment
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#eeefef] border border-[#caccca] flex items-center justify-center text-[#18191b]">
                <UploadCloud className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="font-sans-clean text-xs font-medium text-[#18191b]">
                  <span className="underline underline-offset-2">Click to upload</span> or drag and drop photo
                </p>
                <p className="font-sans-clean text-[11px] text-[#8c8e90] mt-0.5">
                  JPEG, PNG, WebP or camera RAW up to 50MB (auto-compressed)
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-sans-clean text-[#8c8e90] hover:text-[#18191b] underline"
                >
                  <LinkIcon className="w-3 h-3" /> or paste an image URL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showUrlInput && !value && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2 pt-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#caccca] bg-white text-[#18191b] focus:outline-none focus:border-[#18191b]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#18191b] text-white rounded-lg text-xs font-sans-clean font-medium hover:bg-[#3e4143]"
          >
            Apply URL
          </button>
        </form>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {helperText && <p className="text-[11px] font-sans-clean text-[#8c8e90]">{helperText}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleProcessFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
