import { FullCMSData } from './cms-types';
import { PORTFOLIO_ITEMS, HERO_CONFIG, PRINT_COLLECTION, ARTIST_INFO } from './portfolio-data';
import { STORIES_DATA } from './stories-data';
import { ASSIGNMENTS_DATA } from './assignments-data';
import { JOURNALS_DATA } from './journals-data';

export const INITIAL_CMS_DATA: FullCMSData = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  homeHero: {
    image: HERO_CONFIG.image || '/hero-architecture.jpg',
    imageAlt: HERO_CONFIG.imageAlt || 'Quiet architectural study of figure in relation to light and space by Taslimah Woli',
    tagline: HERO_CONFIG.tagline || 'DOCUMENTARY PHOTOGRAPHY & SPATIAL RESEARCH',
    titleLine1: HERO_CONFIG.titleLine1 || 'TASLIMAH',
    titleLine2: HERO_CONFIG.titleLine2 || 'WOLI',
    subtitle: HERO_CONFIG.subtitle || 'PEOPLE, ARCHITECTURE & INHABITED SPACE',
    scrollPrompt: HERO_CONFIG.scrollPrompt || 'EXPLORE BODIES OF WORK',
  },
  bodiesOfWork: PORTFOLIO_ITEMS.map((item, index) => ({
    id: item.id,
    title: item.title,
    layoutBTitle: item.layoutBTitle || item.title.toUpperCase(),
    tagline: item.tagline || '',
    category: (item.category === 'Assignments' ? 'Assignments' : 'Stories'),
    image: item.image,
    imageAlt: item.imageAlt || `${item.title} photography by Taslimah Woli`,
    description: item.description,
    location: item.location || 'Nigeria',
    year: item.year || '2023 – Present',
    order: index,
    status: 'published',
    projectStatement: item.description,
    gallery: (item.gallery || []).map((p, pIdx) => ({
      id: `img-${item.id}-${pIdx}`,
      url: p.url,
      caption: p.caption,
      exif: p.exif,
      order: pIdx,
    })),
  })),
  stories: STORIES_DATA.map((story, index) => ({
    id: story.id,
    title: story.title,
    subtitle: story.subtitle,
    leadParagraph: story.leadParagraph,
    year: story.year,
    location: story.location,
    coverImage: story.coverImage,
    projectStatement: story.leadParagraph,
    order: index,
    status: 'published',
    photos: story.photos.map((p, pIdx) => ({
      id: `photo-${story.id}-${pIdx}`,
      url: p.url,
      caption: p.caption,
      exif: p.exif,
      order: pIdx,
    })),
  })),
  assignments: ASSIGNMENTS_DATA.map((assignment, index) => ({
    id: assignment.id,
    title: assignment.title,
    client: assignment.client,
    subtitle: assignment.subtitle || assignment.commissionType,
    commissionType: assignment.commissionType,
    year: assignment.year,
    location: assignment.location,
    leadParagraph: assignment.leadParagraph,
    coverImage: assignment.coverImage,
    order: index,
    status: 'published',
    photos: assignment.photos.map((p, pIdx) => ({
      id: `assignment-photo-${assignment.id}-${pIdx}`,
      url: p.url,
      caption: p.caption,
      exif: p.exif,
      order: pIdx,
    })),
  })),
  about: {
    portraitImage: '/taslimah_portrait.jpg',
    portraitAlt: 'Taslimah Woli — Documentary Photographer & Spatial Researcher',
    bioParagraphs: [
      'Taslimah Woli is a documentary photographer based in Nigeria, working across Africa and internationally. Her practice is centered on people, architecture, and the relationship between people and the spaces they inhabit. Alongside personal documentary projects, she undertakes editorial, architectural, and institutional commissions, and is beginning to explore film.',
      'Her background in architecture directly shapes her visual instinct. She works with strong perspective, geometry, and the rule of thirds, positioning people in relation to buildings and inhabited space rather than in isolation. Her images carry a characteristic distance and quietness—favoring research, spatial sensitivity, and sustained observation over spectacle.',
      'She works for magazines, publications, cultural organisations, institutions, and selected brands. Her practice unites photographic rigor with architectural understanding and investigative writing, researching the context of what she documents rather than focusing solely on aesthetics.',
    ],
    credibilityItems: [
      {
        id: 'cred-1',
        category: 'Commissions & Features',
        title: 'ART X Lagos · Tell That Story · Uncover Naija',
        order: 0,
      },
      {
        id: 'cred-2',
        category: 'Exhibitions',
        title: '“Women Street Photographers” (Italy) · Uncover Naija Exhibition',
        order: 1,
      },
      {
        id: 'cred-3',
        category: 'Critiques & Masterclasses',
        title: "The Photographer's Studio Visit with Amanda Iheme (Alliance Française Lagos)",
        order: 2,
      },
      {
        id: 'cred-4',
        category: 'Artist Residencies',
        title: 'Open Arts (Kaduna) · Rongo Art Foundation (Benin City)',
        order: 3,
      },
      {
        id: 'cred-5',
        category: 'Published Essay & Grants',
        title: 'Essay “The Architecture of Promises” · Grant-supported project “Wood, Becoming”',
        url: '/journals?journal=architecture-of-promises',
        order: 4,
      },
    ],
    email: 'hello@taslimahwoli.com',
    phone: 'Available on request',
    location: 'Nigeria · Operating Nationally & Across Africa',
    socials: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      whatsapp: 'https://wa.me/2348000000000',
    },
  },
  journals: JOURNALS_DATA.map((journal, index) => {
    // Build full rich HTML including pullquote, section headings, callouts, and inline images
    const htmlParts: string[] = [];

    if (journal.excerpt) {
      htmlParts.push(
        `<blockquote data-pullquote="true" style="margin:2.5rem 0;padding:1.5rem 1.75rem;background:rgba(255,255,255,0.6);border-left:4px solid #18191b;border-radius:0.75rem;font-style:italic;font-size:1.15rem;line-height:1.7;color:#18191b;box-shadow:0 1px 4px rgba(0,0,0,0.04);">&ldquo;${journal.excerpt}&rdquo;</blockquote>`
      );
    }

    const allParagraphs: string[] = [];

    for (const section of journal.sections || []) {
      if (section.heading) {
        htmlParts.push(`<h2>${section.heading}</h2>`);
      }

      for (const p of section.paragraphs || []) {
        htmlParts.push(`<p>${p}</p>`);
        allParagraphs.push(p);
      }

      if (section.callout) {
        htmlParts.push(
          `<div data-callout="true" style="margin:2rem 0;padding:1.25rem 1.5rem;background:#fdf8f2;border:1px solid #c9966a;border-radius:0.75rem;"><span style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#18191b;display:block;margin-bottom:0.35rem;">Field Observation</span><span style="font-style:italic;font-size:1.05rem;color:#3e4143;font-family:inherit;">${section.callout}</span></div>`
        );
      }

      if (section.inlineImage) {
        htmlParts.push(
          `<figure data-journal-image="true" contenteditable="false" style="margin:2.5rem 0;padding:1rem;background:rgba(255,255,255,0.85);border:1px solid #caccca;border-radius:1rem;box-shadow:0 1px 6px rgba(0,0,0,0.06);"><img src="${section.inlineImage.url}" alt="${section.inlineImage.alt || ''}" style="width:100%;border-radius:0.5rem;display:block;aspect-ratio:16/10;object-fit:cover;" />${
            section.inlineImage.caption
              ? `<figcaption contenteditable="true" style="margin-top:0.75rem;text-align:center;font-size:0.7rem;color:#8c8e90;letter-spacing:0.12em;text-transform:uppercase;font-family:inherit;">${section.inlineImage.caption}</figcaption>`
              : ''
          }</figure>`
        );
      }
    }

    const bodyHtml = htmlParts.join('\n');

    return {
      id: journal.id,
      chapter: journal.chapterLabel || `Chapter 0${index + 1}`,
      title: journal.title,
      subtitle: journal.subtitle,
      date: journal.date,
      readTime: journal.readTime,
      location: 'Nigeria',
      coverImage: journal.coverImage,
      excerpt: journal.excerpt,
      paragraphs: allParagraphs,
      bodyHtml,
      order: index,
      status: 'published' as const,
    };
  }),
  prints: PRINT_COLLECTION.map((print, index) => ({
    id: print.id,
    title: print.title,
    series: print.series,
    medium: print.medium,
    paper: print.paper,
    editionSize: print.editionSize,
    image: print.image,
    description: print.description,
    order: index,
    status: 'published',
    sizes: print.sizes.map((s, sIdx) => ({
      id: `size-${print.id}-${sIdx}`,
      label: s.label,
      dimensions: s.dimensions,
      price: s.price,
      inStock: true,
    })),
  })),
  contactDesks: [
    {
      id: 'desk-1',
      city: 'COMMISSIONS & EDITORIAL',
      role: 'Publications & Cultural Institutions',
      address: 'Direct commissioning desk for documentary, architectural, and editorial assignments.',
      postal: 'Local & International Coverage',
      tel: 'Direct inquiry via email',
      email: 'hello@taslimahwoli.com',
      order: 0,
    },
    {
      id: 'desk-2',
      city: 'STUDIO & ARCHIVE',
      role: 'Primary Practice & Field Research',
      address: 'Research-led documentary projects, long-term archives, and institutional collaborations.',
      postal: 'Nigeria · Operating Nationally & Across Africa',
      tel: 'Field bookings & consultations',
      email: 'hello@taslimahwoli.com',
      order: 1,
    },
    {
      id: 'desk-3',
      city: 'PRINT EDITIONS',
      role: 'Curators, Collectors & Private Acquisitions',
      address: 'Limited edition archival pigment prints on 100% cotton rag, signed and numbered with Certificate of Authenticity.',
      postal: 'Insured worldwide shipping & crating',
      tel: 'Framing & acquisition inquiries',
      email: 'hello@taslimahwoli.com',
      order: 2,
    },
  ],
  siteWide: {
    brandName: 'TASLIMAH WOLI',
    brandSubtitle: 'Documentary Photographer & Spatial Researcher',
    availabilityBanner: 'Woli Taslimah is based in Nigeria, and available for local & international assignments.',
    footerText: '© 2026 Taslimah Woli. All rights reserved. Archival documentary photography and spatial research.',
    navLabels: {
      home: 'HOME',
      stories: 'STORIES',
      assignments: 'ASSIGNMENTS',
      about: 'ABOUT',
      journals: 'JOURNALS',
      prints: 'PRINTS',
      contact: 'CONTACT',
    },
    seo: {
      home: {
        title: 'Taslimah Woli — Documentary Photography & Spatial Research',
        description: 'Documentary photographer based in Nigeria. Quiet, research-led visual observation exploring people, architecture, and inhabited spaces.',
      },
      stories: {
        title: 'Stories & Bodies of Work — Taslimah Woli',
        description: 'Long-term personal documentary projects observing human presence in relationship to built spaces and cultural heritage.',
      },
      assignments: {
        title: 'Assignments & Commissions — Taslimah Woli',
        description: 'Editorial and institutional documentary commissions across Africa and internationally.',
      },
      about: {
        title: 'About Taslimah Woli — Biography & Practice',
        description: 'Architectural background, documentary methodology, curated exhibitions, and artist residencies.',
      },
      journals: {
        title: 'Journals & Field Notes — Taslimah Woli',
        description: 'Field notes, research journals, and writings on light, architecture, labor, and spatial observation.',
      },
      prints: {
        title: 'Limited Edition Archival Prints — Taslimah Woli',
        description: 'Museum-grade archival pigment prints on 100% cotton rag. Signed and numbered with Certificate of Authenticity.',
      },
      contact: {
        title: 'Contact & Representation — Taslimah Woli',
        description: 'Direct inquiries for editorial commissions, institutional research, print acquisitions, and studio bookings.',
      },
    },
  },
};
