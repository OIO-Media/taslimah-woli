'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { Globe } from 'lucide-react';
import { usePublishedContent } from '@/lib/cms-store';

export default function ContactPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cms = usePublishedContent();

  // Fallback to default desks if CMS not yet loaded
  const offices = cms.contactDesks?.length
    ? cms.contactDesks.sort((a, b) => a.order - b.order)
    : [
        {
          id: 'desk-1',
          city: 'COMMISSIONS & EDITORIAL',
          role: 'Publications & Cultural Institutions',
          address: 'Direct commissioning desk for documentary, architectural, and editorial assignments.',
          postal: 'Local & International Coverage',
          tel: 'Direct inquiry via email',
          email: 'inquiries@taslimahwoli.com',
          order: 0,
        },
        {
          id: 'desk-2',
          city: 'STUDIO & ARCHIVE',
          role: 'Primary Practice & Field Research',
          address: 'Research-led documentary projects, long-term archives, and institutional collaborations.',
          postal: 'Nigeria · Operating Nationally & Across Africa',
          tel: 'Field bookings & consultations',
          email: 'studio@taslimahwoli.com',
          order: 1,
        },
        {
          id: 'desk-3',
          city: 'PRINT EDITIONS',
          role: 'Curators, Collectors & Private Acquisitions',
          address: 'Limited edition archival pigment prints on 100% cotton rag, signed and numbered with Certificate of Authenticity.',
          postal: 'Insured worldwide shipping & crating',
          tel: 'Framing & acquisition inquiries',
          email: 'prints@taslimahwoli.com',
          order: 2,
        },
      ];

  const availabilityBanner = cms.siteWide?.availabilityBanner ||
    'Woli Taslimah is based in Nigeria, and available for local & international assignments.';

  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col selection:bg-[#18191b] selection:text-[#eeefef]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {/* Availability Statement */}
        <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
          <p className="font-serif-luxury text-xl sm:text-2xl md:text-3xl text-[#18191b] font-light leading-relaxed">
            {availabilityBanner}
          </p>
        </div>

        {/* Studio Representation Desks */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 sm:mb-12">
          {offices.map((office, idx) => (
            <div key={idx} className="bg-[#f7f8f8] border border-[#caccca] p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif-luxury text-2xl uppercase tracking-wider text-[#18191b]">
                    {office.city}
                  </span>
                  <Globe className="w-4 h-4 text-[#8c8e90]" />
                </div>
                <span className="text-[11px] font-sans-clean uppercase tracking-widest text-[#8c8e90] block mb-6">
                  {office.role}
                </span>

                <div className="space-y-2 text-xs font-sans-clean text-[#3e4143] mb-6">
                  <p>{office.address}</p>
                  <p>{office.postal}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#caccca] space-y-2 text-xs font-sans-clean">
                <span className="block text-[#18191b] font-medium">
                  {office.tel}
                </span>
                <a href={`mailto:${office.email}`} className="block text-[#8c8e90] hover:text-[#18191b] transition-colors underline underline-offset-4">
                  {office.email}
                </a>
              </div>
            </div>
          ))}
        </section>

      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
