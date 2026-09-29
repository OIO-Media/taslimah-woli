'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Mail, MapPin, Award, CheckCircle, Send, BookOpen, Layers, ArrowRight, Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { JOURNAL_ARTICLES, PRINT_COLLECTION, JournalArticle, PrintItem } from '@/lib/portfolio-data';
import { DARK_BLUR_DATA_URL, optimizeImageUrl } from '@/lib/image-utils';
import { useSiteContent } from '@/lib/site-content-store';

export type ModalTab = 'about' | 'contact' | 'journal' | 'prints';

interface AboutContactModalProps {
  initialTab?: ModalTab;
  isOpen: boolean;
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({
  initialTab = 'about',
  isOpen,
  onClose,
}) => {
  const { content } = useSiteContent();
  const artistInfo = content.artistInfo;
  const [prevInitialTab, setPrevInitialTab] = useState<ModalTab>(initialTab);
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Editorial Commission',
    message: '',
  });

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  if (!isOpen) return null;

  const handleInquirePrint = (print: PrintItem) => {
    setFormData((prev) => ({
      ...prev,
      projectType: 'Fine Art Print Acquisition',
      message: `I would like to inquire regarding acquisition availability for the print "${print.title}" (${print.editionSize}). Please share framing choices and delivery details.`,
    }));
    setActiveTab('contact');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      id="about-contact-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 md:p-10 bg-[#18191b]/80 backdrop-blur-md text-[#18191b] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-auto sm:max-h-[92vh] max-w-5xl bg-[#eeefef] border-0 sm:border border-[#caccca] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 border-b border-[#caccca] bg-[#f7f8f8] pt-safe overflow-x-auto">
          <div className="flex items-center gap-4 sm:gap-7 min-w-max">
            <button
              id="modal-tab-about"
              onClick={() => {
                setActiveTab('about');
                setSelectedArticle(null);
              }}
              className={`font-serif-luxury text-base sm:text-lg tracking-wider uppercase transition-colors relative pb-1 ${
                activeTab === 'about'
                  ? 'text-[#18191b] font-semibold'
                  : 'text-[#8c8e90] hover:text-[#3e4143]'
              }`}
            >
              ABOUT
              {activeTab === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#18191b]" />
              )}
            </button>

            <button
              id="modal-tab-journal"
              onClick={() => {
                setActiveTab('journal');
                setSelectedArticle(null);
              }}
              className={`font-serif-luxury text-base sm:text-lg tracking-wider uppercase transition-colors relative pb-1 ${
                activeTab === 'journal'
                  ? 'text-[#18191b] font-semibold'
                  : 'text-[#8c8e90] hover:text-[#3e4143]'
              }`}
            >
              JOURNALS
              {activeTab === 'journal' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#18191b]" />
              )}
            </button>

            <button
              id="modal-tab-prints"
              onClick={() => {
                setActiveTab('prints');
                setSelectedArticle(null);
              }}
              className={`font-serif-luxury text-base sm:text-lg tracking-wider uppercase transition-colors relative pb-1 ${
                activeTab === 'prints'
                  ? 'text-[#18191b] font-semibold'
                  : 'text-[#8c8e90] hover:text-[#3e4143]'
              }`}
            >
              PRINTS
              {activeTab === 'prints' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#18191b]" />
              )}
            </button>

            <button
              id="modal-tab-contact"
              onClick={() => {
                setActiveTab('contact');
                setSelectedArticle(null);
              }}
              className={`font-serif-luxury text-base sm:text-lg tracking-wider uppercase transition-colors relative pb-1 ${
                activeTab === 'contact'
                  ? 'text-[#18191b] font-semibold'
                  : 'text-[#8c8e90] hover:text-[#3e4143]'
              }`}
            >
              CONTACT
              {activeTab === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#18191b]" />
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8c8e90] hover:text-[#18191b] transition-colors ml-4"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Panels */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10">
          {/* TAB 1: ABOUT */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center py-2">
              {/* Artist Portrait Card */}
              <div className="md:col-span-5 relative aspect-[4/5] rounded-[28px] overflow-hidden bg-[#18191b] border border-[#caccca] shadow-xl">
                <Image
                  src="/taslimah_portrait.jpg"
                  alt="Woli Taslimah — Documentary & Editorial Photographer"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center filter contrast-105"
                />
              </div>

              {/* Bio & Details */}
              <div className="md:col-span-7 space-y-6">
                <h3 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light uppercase text-[#18191b] leading-[1.08]">
                  <span className="block whitespace-nowrap tracking-[0.24em]">WOLI</span>
                  <span className="block mt-1 whitespace-nowrap tracking-[0.16em]">TASLIMAH</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-[13px] font-sans-clean leading-relaxed text-[#3e4143]">
                  {(artistInfo.bioParagraphs || []).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Selected Highlights */}
                <div className="pt-3 border-t border-[#caccca] space-y-2 text-xs font-sans-clean">
                  <div className="text-[10px] tracking-[0.24em] uppercase text-[#8c8e90] font-medium">
                    SELECTED FEATURES & COMMISSIONS
                  </div>
                  <div className="text-[11px] text-[#3e4143] space-y-1">
                    <p><span className="font-medium text-[#18191b]">Commissions & Features:</span> ART X Lagos, Tell That Story, Uncover Naija</p>
                    <p><span className="font-medium text-[#18191b]">Exhibitions:</span> Women Street Photographers (Italy), Uncover Naija</p>
                    <p><span className="font-medium text-[#18191b]">Studio Review:</span> Amanda Iheme (Alliance Française Lagos)</p>
                    <p><span className="font-medium text-[#18191b]">Residencies & Grants:</span> Open Arts (Kaduna), Rongo Art Foundation (Benin City)</p>
                  </div>
                </div>

                {/* Direct Contact Details */}
                <div className="pt-4 border-t border-[#caccca] space-y-3 text-xs font-sans-clean">
                  <div className="text-[10px] tracking-[0.24em] uppercase text-[#8c8e90] font-medium">
                    DIRECT CONTACT
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <a
                      href={`tel:${artistInfo.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-[#18191b] hover:text-[#3e4143] font-medium tracking-wide flex items-center gap-2 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#18191b] text-[#eeefef] flex items-center justify-center text-[10px]">
                        📞
                      </span>
                      <span>{artistInfo.phone}</span>
                    </a>
                    <a
                      href={`mailto:${artistInfo.email}`}
                      className="text-[#18191b] hover:text-[#3e4143] font-medium tracking-wide flex items-center gap-2 transition-colors lowercase"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#18191b] text-[#eeefef] flex items-center justify-center text-[10px]">
                        ✉️
                      </span>
                      <span>{artistInfo.email}</span>
                    </a>
                  </div>

                  {/* Social Circles in Modal */}
                  <div className="pt-2 flex items-center justify-between w-full">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-9 h-9 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] flex items-center justify-center transition-all duration-200"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-9 h-9 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] flex items-center justify-center transition-all duration-200"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-9 h-9 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] flex items-center justify-center transition-all duration-200"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/${artistInfo.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-9 h-9 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] flex items-center justify-center transition-all duration-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JOURNAL OR WRITING */}
          {activeTab === 'journal' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              {selectedArticle ? (
                <div className="space-y-6 animate-fade-in">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs font-sans-clean tracking-widest uppercase text-[#8c8e90] hover:text-[#18191b] flex items-center gap-2 mb-4"
                  >
                    <span>← Return to Journal Overview</span>
                  </button>

                  <div className="border-b border-[#caccca] pb-6">
                    <div className="flex items-center gap-3 text-[11px] font-sans-clean text-[#8c8e90] tracking-widest uppercase mb-2">
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.location}</span>
                      <span>•</span>
                      <span>{selectedArticle.readTime}</span>
                    </div>
                    <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18191b] font-light">
                      {selectedArticle.title}
                    </h2>
                    <p className="font-serif-luxury italic text-[#3e4143] text-base mt-2">
                      {selectedArticle.subtitle}
                    </p>
                  </div>

                  <div className="space-y-5 text-sm font-sans-clean text-[#3e4143] leading-relaxed">
                    {selectedArticle.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-sans-clean text-[#8c8e90]">
                      Reflections & Field Notes
                    </span>
                    <h3 className="font-serif-luxury text-3xl sm:text-4xl font-light tracking-wide text-[#18191b] mt-1">
                      Journals
                    </h3>
                    <p className="text-xs sm:text-[13px] font-sans-clean text-[#3e4143] mt-2 leading-relaxed">
                      Essays, field notes, and working thoughts on architectural memory, material archives, and the documentary gaze.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {JOURNAL_ARTICLES.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="p-6 bg-[#f7f8f8] border border-[#caccca] hover:border-[#18191b] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[10px] font-sans-clean text-[#8c8e90] tracking-widest uppercase mb-2">
                          <span>{article.date} · {article.location}</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h4 className="font-serif-luxury text-2xl text-[#18191b] font-light transition-colors">
                          {article.title}
                        </h4>
                        <p className="font-serif-luxury italic text-xs text-[#8c8e90] mt-0.5 mb-3">
                          {article.subtitle}
                        </p>
                        <p className="text-xs font-sans-clean text-[#3e4143] leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] tracking-[0.22em] font-sans-clean uppercase text-[#8c8e90] group-hover:text-[#18191b] transition-colors">
                          <span>Read Complete Essay</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRINTS */}
          {activeTab === 'prints' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans-clean text-[#8c8e90]">
                  Collector Editions
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl font-light tracking-wide text-[#18191b] mt-1">
                  Fine Art Prints
                </h3>
                <p className="text-xs sm:text-[13px] font-sans-clean text-[#3e4143] mt-2 leading-relaxed">
                  Museum-grade darkroom silver gelatin and carbon pigment prints produced on 100% cotton fiber baryta paper. Each print is numbered, signed in graphite, and accompanied by a studio certificate of authenticity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRINT_COLLECTION.map((print) => (
                  <div
                    key={print.id}
                    className="bg-[#f7f8f8] border border-[#caccca] flex flex-col justify-between overflow-hidden group hover:border-[#18191b] transition-all"
                  >
                    <div className="relative aspect-[4/5] w-full bg-[#18191b] overflow-hidden">
                      <Image
                        src={optimizeImageUrl(print.image, 700, 75)}
                        alt={print.title}
                        fill
                        placeholder="blur"
                        blurDataURL={DARK_BLUR_DATA_URL}
                        quality={75}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        referrerPolicy="no-referrer"
                        className="object-cover filter contrast-115 grayscale transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-[#eeefef]/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-sans-clean uppercase tracking-widest text-[#18191b] border border-[#caccca] shadow-xs">
                        {print.editionSize}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[9px] font-sans-clean tracking-widest text-[#8c8e90] uppercase block mb-1">
                          {print.series}
                        </span>
                        <h4 className="font-serif-luxury text-xl text-[#18191b] font-light leading-snug">
                          {print.title}
                        </h4>
                        <p className="text-[11px] font-sans-clean text-[#8c8e90] mt-1.5 line-clamp-2">
                          {print.paper}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#caccca] space-y-2">
                        <div className="space-y-1">
                          {print.sizes.map((s, idx) => (
                            <div key={idx} className="flex justify-between text-[11px] font-sans-clean text-[#3e4143]">
                              <span>{s.dimensions}</span>
                              <span className="text-[#18191b] font-semibold">{s.price}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleInquirePrint(print)}
                          className="w-full mt-3 py-2 border border-[#caccca] hover:border-[#18191b] bg-[#eeefef] hover:bg-[#18191b] hover:text-[#eeefef] transition-all uppercase tracking-[0.2em] text-[10px] font-sans-clean font-semibold text-center block text-[#18191b]"
                        >
                          Inquire for Acquisition
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-[#f7f8f8] border border-[#caccca] text-center text-xs font-sans-clean text-[#3e4143]">
                Each print is produced in limited editions on archival cotton rag paper, inspected, signed, and numbered with a studio Certificate of Authenticity. Custom conservation framing and worldwide insured crating available upon inquiry.
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans-clean text-[#8c8e90]">
                  Direct Studio Reach
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl font-light tracking-wide text-[#18191b] mt-1">
                  Studio Inquiries
                </h3>
                <p className="text-xs sm:text-[13px] font-sans-clean text-[#3e4143] mt-2 max-w-md mx-auto leading-relaxed">
                  Woli Taslimah is based in Nigeria, and available for local &amp; international assignments, institutional commissions, and print acquisitions.
                </p>
              </div>

              {/* Direct Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-[#caccca] text-xs font-sans-clean text-center">
                <div className="p-3 bg-[#f7f8f8] border border-[#caccca]">
                  <Mail className="w-4 h-4 mx-auto mb-1.5 text-[#18191b]" />
                  <span className="text-[#8c8e90] text-[10px] uppercase block tracking-wider">
                    Studio Dispatch
                  </span>
                  <a
                    href={`mailto:${artistInfo.email}`}
                    className="text-[#18191b] hover:text-[#3e4143] transition-colors"
                  >
                    {artistInfo.email}
                  </a>
                </div>

                <div className="p-3 bg-[#f7f8f8] border border-[#caccca]">
                  <span className="text-[#8c8e90] text-[10px] uppercase block tracking-wider mt-1 mb-1.5 font-mono">
                    TEL
                  </span>
                  <span className="text-[#8c8e90] text-[10px] uppercase block tracking-wider">
                    Private Line
                  </span>
                  <span className="text-[#18191b]">{artistInfo.phone}</span>
                </div>

                <div className="p-3 bg-[#f7f8f8] border border-[#caccca]">
                  <MapPin className="w-4 h-4 mx-auto mb-1.5 text-[#18191b]" />
                  <span className="text-[#8c8e90] text-[10px] uppercase block tracking-wider">
                    Location & Base
                  </span>
                  <span className="text-[#18191b]">Nigeria · Global Availability</span>
                </div>
              </div>

              {/* Commission Form */}
              {formSubmitted ? (
                <div className="py-12 bg-[#f7f8f8] border border-[#caccca] text-center p-6 flex flex-col items-center">
                  <CheckCircle className="w-10 h-10 text-[#18191b] mb-3" />
                  <h4 className="font-serif-luxury text-2xl text-[#18191b]">Message Transmitted</h4>
                  <p className="text-xs text-[#3e4143] mt-1 max-w-sm">
                    Thank you. Taslimah Woli&apos;s studio will review your inquiry within 24–48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-clean">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] text-[#3e4143] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Elena Rossi"
                        className="w-full bg-[#f7f8f8] border border-[#caccca] px-3 py-2 text-[#18191b] placeholder:text-[#8c8e90] focus:border-[#18191b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] text-[#3e4143] mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@publication.com"
                        className="w-full bg-[#f7f8f8] border border-[#caccca] px-3 py-2 text-[#18191b] placeholder:text-[#8c8e90] focus:border-[#18191b] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-[#3e4143] mb-1">
                      Inquiry Nature
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-[#f7f8f8] border border-[#caccca] px-3 py-2 text-[#18191b] focus:border-[#18191b] focus:outline-none"
                    >
                      <option value="Editorial Commission">Editorial Commission</option>
                      <option value="Commercial Campaign">Commercial Campaign</option>
                      <option value="Fine Art Print Acquisition">Fine Art Print Acquisition</option>
                      <option value="Gallery Exhibition / Museum Loan">
                        Gallery Exhibition / Museum Loan
                      </option>
                      <option value="Interview / Press Request">Interview / Press Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-[#3e4143] mb-1">
                      Project Details & Timeline
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Brief overview of project scope, dates, and publication context..."
                      className="w-full bg-[#f7f8f8] border border-[#caccca] px-3 py-2 text-[#18191b] placeholder:text-[#8c8e90] focus:border-[#18191b] focus:outline-none"
                    />
                  </div>

                  <div className="text-right pt-2">
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-[#18191b] text-[#eeefef] hover:bg-[#3e4143] transition-colors uppercase tracking-[0.25em] text-[11px] font-semibold flex items-center gap-2 ml-auto"
                    >
                      <span>Transmit Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
