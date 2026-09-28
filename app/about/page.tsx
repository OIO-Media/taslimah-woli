'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { Mail, Instagram, Facebook, Linkedin, MessageCircle, ExternalLink } from 'lucide-react';
import { usePublishedContent } from '@/lib/cms-store';

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cms = usePublishedContent();
  const about = cms.about;

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: about?.socials?.instagram || 'https://instagram.com',
      aria: 'Visit Taslimah Woli on Instagram',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: about?.socials?.facebook || 'https://facebook.com',
      aria: 'Visit Taslimah Woli on Facebook',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: about?.socials?.linkedin || 'https://linkedin.com',
      aria: 'Connect with Taslimah Woli on LinkedIn',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: about?.socials?.whatsapp || 'https://wa.me/2348000000000',
      aria: 'Message studio via WhatsApp',
    },
  ];

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col justify-between selection:bg-[#18191b] selection:text-[#eeefef]">
      {/* Top Navigation */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-24 flex flex-col justify-center">
        {/* Two-Column Editorial Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-stretch w-full">
          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end h-full">
            <div className="relative w-full max-w-[480px] h-[480px] sm:h-[560px] lg:h-full min-h-[460px] lg:min-h-0 rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#18191b] shadow-[0_20px_45px_rgba(24,25,27,0.14)] border border-[#caccca]">
              <Image
                src={about?.portraitImage || '/taslimah_portrait.jpg'}
                alt={about?.portraitAlt || 'Taslimah Woli — Documentary Photographer & Spatial Researcher'}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center filter contrast-[1.04]"
                unoptimized={about?.portraitImage?.startsWith('data:')}
              />
            </div>
          </div>

          {/* Right Column: Title, Narrative, Credibility, and Direct Contact */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Title: WOLI TASLIMAH */}
              <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#18191b] leading-[1.08] uppercase mb-6 sm:mb-8 select-none">
                <span className="block whitespace-nowrap tracking-[0.24em] sm:tracking-[0.28em]">
                  WOLI
                </span>
                <span className="block mt-1 sm:mt-2 whitespace-nowrap tracking-[0.14em] sm:tracking-[0.18em]">
                  TASLIMAH
                </span>
              </h1>

              {/* Narrative Paragraphs */}
              <div className="space-y-5 text-[#3e4143] font-sans-clean text-sm sm:text-[15px] leading-[1.8] font-normal max-w-xl">
                {about?.bioParagraphs && about.bioParagraphs.length > 0 ? (
                  about.bioParagraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Taslimah Woli is a documentary photographer based in Nigeria, working across Africa and internationally. Her practice is centered on people, architecture, and the relationship between people and the spaces they inhabit. Alongside personal documentary projects, she undertakes editorial, architectural, and institutional commissions, and is beginning to explore film.
                    </p>
                    <p>
                      Her background in architecture directly shapes her visual instinct. She works with strong perspective, geometry, and the rule of thirds, positioning people in relation to buildings and inhabited space rather than in isolation. Her images carry a characteristic distance and quietness—favoring research, spatial sensitivity, and sustained observation over spectacle.
                    </p>
                    <p>
                      She works for magazines, publications, cultural organisations, institutions, and selected brands. Her practice unites photographic rigor with architectural understanding and investigative writing, researching the context of what she documents rather than focusing solely on aesthetics.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Selected Credibility: Curated Exhibitions, Residencies, Grants & Commissions */}
            <div className="mt-8 pt-6 border-t border-[#caccca] max-w-xl w-full">
              <div className="text-[10px] tracking-[0.26em] uppercase text-[#8c8e90] font-sans-clean font-medium mb-3">
                SELECTED COMMISSIONS, EXHIBITIONS &amp; RESEARCH
              </div>

              <div className="space-y-2.5 text-xs font-sans-clean text-[#3e4143] mb-6">
                {about?.credibilityItems && about.credibilityItems.length > 0 ? (
                  about.credibilityItems.map((item, idx) => (
                    <div key={item.id || idx}>
                      <span className="text-[#8c8e90] uppercase tracking-wider text-[10px] block">
                        {item.category}
                      </span>
                      {item.url ? (
                        <a
                          href={item.url}
                          target={item.url.startsWith('http') ? '_blank' : undefined}
                          rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="font-medium text-[#18191b] hover:text-[#8c8e90] inline-flex items-center gap-1.5 transition-colors underline decoration-[#caccca] underline-offset-4"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                        </a>
                      ) : (
                        <span className="font-medium text-[#18191b]">{item.title}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div>
                    <span className="text-[#8c8e90] uppercase tracking-wider text-[10px] block">Commissions &amp; Features</span>
                    <span className="font-medium text-[#18191b]">ART X Lagos · Tell That Story · Uncover Naija</span>
                  </div>
                )}
              </div>

              {/* Direct Inquiries & Social Links */}
              <div className="pt-4 border-t border-[#caccca]/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  {about?.location && (
                    <span className="text-[11px] font-sans-clean text-[#8c8e90] tracking-wide">
                      {about.location}
                    </span>
                  )}
                  <a
                    href={`mailto:${about?.email || 'inquiries@taslimahwoli.com'}`}
                    className="text-xs font-sans-clean font-medium text-[#18191b] hover:text-[#3e4143] underline underline-offset-4 tracking-wide"
                  >
                    {about?.email || 'inquiries@taslimahwoli.com'}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.aria}
                        className="w-8 h-8 rounded-full bg-[#18191b] hover:bg-[#3e4143] text-[#eeefef] flex items-center justify-center transition-all duration-200"
                      >
                        <Icon className="w-3.5 h-3.5 stroke-[1.8]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
