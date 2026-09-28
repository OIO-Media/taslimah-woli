'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { PortfolioItem } from '@/lib/portfolio-data';
import { DARK_BLUR_DATA_URL, optimizeImageUrl } from '@/lib/image-utils';
import { useSiteContent } from '@/lib/site-content-store';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (item: PortfolioItem) => void;
  onSelectItem?: (item: PortfolioItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectItem,
}) => {
  const { content } = useSiteContent();
  const searchPool = content.homePageWorks;
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = searchPool.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.layoutBTitle.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="portfolio-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-[#18191b]/70 backdrop-blur-md text-[#18191b] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#eeefef] border border-[#caccca] rounded-none shadow-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#caccca] pb-4">
          <Search className="w-5 h-5 text-[#8c8e90]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portfolios, subjects, locations, or series..."
            autoFocus
            className="w-full bg-transparent text-sm md:text-base tracking-wide font-sans-clean text-[#18191b] placeholder:text-[#8c8e90] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#8c8e90] hover:text-[#18191b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] uppercase tracking-wider font-sans-clean text-[#8c8e90]">
          <span>Suggestions:</span>
          {['STORIES', 'ASSIGNMENTS', 'JOURNALS', 'PRINTS'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-0.5 border border-[#caccca] bg-[#f7f8f8] text-[#3e4143] hover:border-[#18191b] hover:text-[#18191b] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-6 max-h-[50vh] overflow-y-auto space-y-3 pr-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#8c8e90] text-xs font-sans-clean">
              No portfolio series matched &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectItem) onSelectItem(item);
                  if (onSelectCategory) onSelectCategory(item);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 bg-[#f7f8f8] hover:bg-[#caccca]/30 border border-[#caccca] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 shrink-0 bg-[#caccca] overflow-hidden">
                    <Image
                      src={optimizeImageUrl(item.image, 150, 70)}
                      alt={item.title}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={DARK_BLUR_DATA_URL}
                      quality={70}
                      sizes="48px"
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-sans-clean tracking-wider text-[#8c8e90]">{item.category}</span>
                      <h4 className="font-serif-luxury text-base text-[#18191b] font-medium">
                        {item.layoutBTitle}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#8c8e90] font-sans-clean">{item.title} — {item.tagline}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#8c8e90] group-hover:text-[#18191b] group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
