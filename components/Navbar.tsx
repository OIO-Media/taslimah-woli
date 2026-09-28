'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { usePublishedContent } from '@/lib/cms-store';

interface NavbarProps {
  onOpenSearch: () => void;
  onSelectCategory?: (id: string) => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenJournal?: () => void;
  onOpenPrints?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const cms = usePublishedContent();
  const sw = cms.siteWide;

  const brandName = sw?.brandName || 'TASLIMAH WOLI';

  const navLinks = [
    { label: sw?.navLabels?.home || 'HOME', id: 'home', href: '/' },
    { label: sw?.navLabels?.stories || 'STORIES', id: 'stories', href: '/stories' },
    { label: sw?.navLabels?.assignments || 'ASSIGNMENTS', id: 'assignments', href: '/assignments' },
    { label: sw?.navLabels?.about || 'ABOUT', id: 'about', href: '/about' },
    { label: sw?.navLabels?.journals || 'JOURNALS', id: 'journals', href: '/journals' },
    { label: sw?.navLabels?.prints || 'PRINTS', id: 'prints', href: '/prints' },
    { label: sw?.navLabels?.contact || 'CONTACT', id: 'contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        id="main-navigation"
        className="fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 bg-[#eeefef]/95 backdrop-blur-md border-b border-[#caccca] text-[#18191b] shadow-xs"
      >
        <div className="w-full px-6 md:px-10 py-4 md:py-4.5 flex items-center justify-between">
          {/* Wordmark Brand left */}
          <div className="flex items-center gap-3">
            <Link
              id="brand-logo-btn"
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center text-left focus:outline-none"
            >
              <span className="font-serif-luxury tracking-[0.22em] sm:tracking-[0.26em] text-sm md:text-base font-light uppercase text-[#18191b] group-hover:text-[#3e4143] transition-colors select-none">
                {brandName}
              </span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <nav
            id="desktop-nav-links"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] lg:text-xs tracking-[0.22em] font-sans-clean uppercase"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  className={`relative py-1 transition-colors duration-200 focus:outline-none ${
                    active ? 'text-[#18191b] font-semibold' : 'text-[#3e4143] hover:text-[#18191b]'
                  }`}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#18191b] transition-all" />
                  ) : (
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#18191b] transition-all duration-300 hover:w-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Search & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Button */}
            <button
              id="nav-search-button"
              onClick={onOpenSearch}
              aria-label="Search portfolio"
              className="p-2 text-[#3e4143] hover:text-[#18191b] hover:bg-[#caccca]/40 rounded-full transition-all focus:outline-none"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#18191b] hover:text-[#3e4143] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-dropdown-menu"
            className="md:hidden bg-[#eeefef]/98 backdrop-blur-xl border-b border-[#caccca] px-6 py-6 shadow-lg transition-all"
          >
            <div className="flex flex-col gap-3 text-xs tracking-[0.25em] uppercase font-sans-clean">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2.5 border-b border-[#caccca]/50 transition-colors flex items-center justify-between ${
                      active ? 'text-[#18191b] font-bold' : 'text-[#3e4143] hover:text-[#18191b]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#18191b]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
