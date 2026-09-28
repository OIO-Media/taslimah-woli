'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { PRINT_COLLECTION, PrintItem } from '@/lib/portfolio-data';
import { usePublishedContent } from '@/lib/cms-store';
import { cmsPrintToPublic } from '@/lib/cms-adapters';
import { DARK_BLUR_DATA_URL, optimizeImageUrl } from '@/lib/image-utils';
import { Check, ArrowRight, X, Send, ChevronDown } from 'lucide-react';

export default function PrintsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [inquiryPrint, setInquiryPrint] = useState<{ print: PrintItem; sizeIdx: number } | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '', framing: 'Unframed' });
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [clickedCardId, setClickedCardId] = useState<string | null>(null);

  // Print collection sourced from verified documentary bodies of work
  const cms = usePublishedContent();
  const allPrints = useMemo(() => {
    const cmsPrints = cms.prints
      .filter(p => p.status === 'published')
      .map(cmsPrintToPublic);
    return cmsPrints.length > 0 ? cmsPrints : PRINT_COLLECTION;
  }, [cms.prints]);

  const handleSelectSize = (printId: string, idx: number) => {
    setSelectedSizes((prev) => ({ ...prev, [printId]: idx }));
  };

  const handleOpenInquiry = (print: PrintItem) => {
    const sizeIdx = selectedSizes[print.id] ?? 0;
    setInquiryPrint({ print, sizeIdx });
    setInquirySuccess(false);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col selection:bg-[#18191b] selection:text-[#eeefef]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        {/* Print Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start mb-24">
          {allPrints.map((print) => {
            const currentSizeIdx = selectedSizes[print.id] ?? 0;
            const currentSize = print.sizes[currentSizeIdx] || print.sizes[0];
            const isExpanded = clickedCardId === print.id || hoveredCardId === print.id;

            const toggleExpand = () => {
              setClickedCardId((prev) => (prev === print.id ? null : print.id));
            };

            return (
              <article
                key={print.id}
                id={`print-${print.id}`}
                onMouseEnter={() => setHoveredCardId(print.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group bg-[#f7f8f8] border border-[#caccca] hover:border-[#18191b] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
              >
                {/* Print Image Frame */}
                <div
                  className="relative aspect-[4/3] w-full bg-[#18191b] overflow-hidden border-b border-[#caccca] cursor-pointer"
                  onClick={() => {
                    if (isExpanded) {
                      handleOpenInquiry(print);
                    } else {
                      toggleExpand();
                    }
                  }}
                >
                  <Image
                    src={optimizeImageUrl(print.image, 1200, 80)}
                    alt={print.title}
                    fill
                    placeholder="blur"
                    blurDataURL={DARK_BLUR_DATA_URL}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover p-2.5 sm:p-3.5 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-[#eeefef]/95 backdrop-blur-md px-2.5 py-1 border border-[#caccca] text-[9px] uppercase tracking-widest font-sans-clean text-[#18191b] font-medium">
                    {print.editionSize}
                  </div>
                </div>

                {/* Collapsed Header: Responds to Click/Tap on Touch Screens & Hover */}
                <div
                  onClick={toggleExpand}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-[#f7f8f8] cursor-pointer hover:bg-white transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="font-serif-luxury text-base sm:text-lg uppercase tracking-wider text-[#18191b] leading-tight truncate">
                      {print.title}
                    </h2>
                    <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mt-0.5 sm:hidden">
                      {isExpanded ? 'Tap to collapse' : 'Tap for sizes & details'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base sm:text-lg font-serif-luxury text-[#18191b] font-light whitespace-nowrap">
                      {currentSize.price} USD
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8c8e90] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-[#18191b]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details: Visible ONLY when hovered */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden px-4 sm:px-5 border-t ${
                    isExpanded
                      ? 'max-h-[600px] opacity-100 border-[#caccca] pb-5 pt-4 pointer-events-auto'
                      : 'max-h-0 opacity-0 border-transparent py-0 pointer-events-none group-hover:max-h-[600px] group-hover:opacity-100 group-hover:border-[#caccca] group-hover:pb-5 group-hover:pt-4 group-hover:pointer-events-auto'
                  }`}
                >
                  <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mb-1">
                    {print.series}
                  </span>
                  <p className="text-xs text-[#8c8e90] font-sans-clean mb-3">
                    {print.paper} · {print.medium}
                  </p>
                  <p className="text-[#3e4143] font-serif-luxury text-xs sm:text-sm leading-relaxed mb-4">
                    {print.description}
                  </p>

                  {/* Size Selector Tabs */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[10px] font-sans-clean uppercase tracking-wider text-[#8c8e90] block">
                      Select Edition Dimension:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-sans-clean">
                      {print.sizes.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSize(print.id, sIdx);
                          }}
                          className={`p-1.5 sm:p-2 border text-left transition-all ${
                            currentSizeIdx === sIdx
                              ? 'bg-[#18191b] text-[#eeefef] border-[#18191b] font-semibold'
                              : 'bg-[#eeefef] text-[#3e4143] border-[#caccca] hover:border-[#18191b]'
                          }`}
                        >
                          <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider opacity-75 truncate">{s.label}</span>
                          <span className="block font-mono text-[10px] sm:text-xs mt-0.5">{s.price}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8c8e90] font-sans-clean block pt-0.5">
                      Dimensions: {currentSize.dimensions}
                    </span>
                  </div>

                  {/* Inquire Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInquiry(print);
                    }}
                    className="w-full py-2.5 bg-[#18191b] text-[#eeefef] text-xs font-semibold uppercase tracking-widest font-sans-clean hover:bg-[#3e4143] transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <span>INQUIRE / ACQUIRE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Framing & Conservation Section */}
        <section className="p-10 sm:p-14 bg-[#f7f8f8] border border-[#caccca] mb-20">
          <div className="max-w-3xl">
            <span className="text-xs font-sans-clean uppercase tracking-[0.25em] text-[#8c8e90] block mb-2">
              EDITIONS & CONSERVATION
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl uppercase tracking-wider text-[#18191b] mb-6">
              ARCHIVAL PRODUCTION & STUDIO PROVENANCE
            </h3>
            <p className="text-[#3e4143] font-serif-luxury text-base sm:text-lg leading-relaxed mb-6">
              Every print is produced in strictly limited editions on 100% archival cotton rag papers (Hahnemühle and Canson Infinity) using pigment-based inks rated for century-scale stability. Each piece is individually inspected, signed, and numbered in graphite by Taslimah Woli, accompanied by a studio Certificate of Authenticity. Conservation mounting, bespoke hardwood shadowboxes, and secure domestic or international crated dispatch are available on request.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-[#18191b] text-[#eeefef] font-semibold text-xs tracking-[0.22em] uppercase font-sans-clean hover:bg-[#3e4143] transition-colors"
              >
                INQUIRE ABOUT PRINTS & FRAMING
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Inquiry / Acquisition Drawer Modal */}
      {inquiryPrint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18191b]/70 backdrop-blur-sm p-4 sm:p-6 animate-fade-in"
          onClick={() => setInquiryPrint(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#eeefef] border border-[#caccca] p-8 text-[#18191b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInquiryPrint(null)}
              className="absolute top-4 right-4 p-2 text-[#8c8e90] hover:text-[#18191b]"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#caccca] flex items-center justify-center mx-auto text-[#18191b]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-2xl uppercase tracking-wider text-[#18191b]">Inquiry Received</h3>
                <p className="text-[#3e4143] font-serif-luxury text-sm leading-relaxed max-w-sm mx-auto">
                  Taslimah Woli&apos;s studio will contact you within 24–48 hours with edition availability, framing options, and insured shipping details.
                </p>
                <button
                  onClick={() => setInquiryPrint(null)}
                  className="px-6 py-2.5 bg-[#18191b] text-[#eeefef] text-xs font-semibold uppercase tracking-widest font-sans-clean mt-4"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#8c8e90] block">
                  PRINT ACQUISITION INQUIRY
                </span>
                <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#18191b]">
                  {inquiryPrint.print.title}
                </h3>
                <div className="p-3 bg-[#f7f8f8] border border-[#caccca] text-xs font-sans-clean text-[#3e4143] flex justify-between">
                  <span>{inquiryPrint.print.sizes[inquiryPrint.sizeIdx]?.dimensions}</span>
                  <span className="font-bold text-[#18191b]">{inquiryPrint.print.sizes[inquiryPrint.sizeIdx]?.price}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full bg-[#f7f8f8] border border-[#caccca] p-2.5 text-xs text-[#18191b] focus:outline-none focus:border-[#18191b] font-sans-clean"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full bg-[#f7f8f8] border border-[#caccca] p-2.5 text-xs text-[#18191b] focus:outline-none focus:border-[#18191b] font-sans-clean"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mb-1">
                    Framing Preference
                  </label>
                  <select
                    value={inquiryForm.framing}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, framing: e.target.value })}
                    className="w-full bg-[#f7f8f8] border border-[#caccca] p-2.5 text-xs text-[#18191b] focus:outline-none focus:border-[#18191b] font-sans-clean"
                  >
                    <option value="Unframed">Unframed (Archival Flat Crate)</option>
                    <option value="Black Walnut">Solid American Black Walnut + Museum Acrylic</option>
                    <option value="Natural Ash">Natural White Ash + Museum Acrylic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-sans-clean uppercase tracking-wider text-[#3e4143] mb-1">
                    Delivery City & Country / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="E.g., London UK, need delivery before November..."
                    className="w-full bg-[#f7f8f8] border border-[#caccca] p-2.5 text-xs text-[#18191b] focus:outline-none focus:border-[#18191b] font-sans-clean"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#18191b] text-[#eeefef] font-semibold text-xs tracking-widest uppercase font-sans-clean hover:bg-[#3e4143] transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span>SUBMIT ACQUISITION INQUIRY</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
