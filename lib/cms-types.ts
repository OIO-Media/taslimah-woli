export type ContentStatus = 'published' | 'draft';

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  exif?: string;
  order: number;
}

export interface HomeHeroConfig {
  image: string;
  imageAlt: string;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  scrollPrompt: string;
}

export interface BodyOfWorkItem {
  id: string;
  title: string;
  layoutBTitle: string;
  tagline: string;
  category: 'Stories' | 'Assignments';
  image: string;
  imageAlt: string;
  description: string;
  location: string;
  year: string; // e.g. "2023 – Present" or "In development"
  order: number;
  status: ContentStatus;
  gallery: GalleryPhoto[];
  projectStatement?: string;
}

export interface StoryProjectCMS {
  id: string;
  title: string;
  subtitle: string;
  leadParagraph: string;
  year: string;
  location: string;
  coverImage: string;
  projectStatement?: string;
  order: number;
  status: ContentStatus;
  photos: GalleryPhoto[];
}

export interface AssignmentProjectCMS {
  id: string;
  title: string;
  client: string;
  subtitle: string;
  commissionType: string;
  year: string;
  location: string;
  leadParagraph: string;
  coverImage: string;
  order: number;
  status: ContentStatus;
  photos: GalleryPhoto[];
}

export interface CredibilityItem {
  id: string;
  category: 'Commissions & Features' | 'Exhibitions' | 'Critiques & Masterclasses' | 'Artist Residencies' | 'Published Essay & Grants' | string;
  title: string;
  details?: string;
  year?: string;
  url?: string;
  order: number;
}

export interface AboutContentCMS {
  portraitImage: string;
  portraitAlt: string;
  bioParagraphs: string[];
  credibilityItems: CredibilityItem[];
  email: string;
  phone: string;
  location: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface JournalEntryCMS {
  id: string;
  chapter: string; // e.g. "Chapter 01"
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  location: string;
  coverImage: string;
  excerpt: string;
  bodyHtml?: string;
  paragraphs: string[];
  order: number;
  status: ContentStatus;
}

export interface PrintSizeTier {
  id: string;
  label: string;
  dimensions: string;
  price: string;
  inStock?: boolean;
}

export interface PrintItemCMS {
  id: string;
  title: string;
  series: string;
  medium: string;
  paper: string;
  editionSize: string;
  image: string;
  description: string;
  sizes: PrintSizeTier[];
  order: number;
  status: ContentStatus;
}

export interface ContactDeskCMS {
  id: string;
  city: string; // e.g. "COMMISSIONS & EDITORIAL"
  role: string; // e.g. "Publications & Cultural Institutions"
  address: string;
  postal: string;
  tel: string;
  email: string;
  order: number;
}

export interface PageSEO {
  title: string;
  description: string;
}

export interface SiteWideCMS {
  brandName: string;
  brandSubtitle: string;
  availabilityBanner: string;
  footerText: string;
  navLabels: {
    home: string;
    stories: string;
    assignments: string;
    about: string;
    journals: string;
    prints: string;
    contact: string;
  };
  seo: {
    home: PageSEO;
    stories: PageSEO;
    assignments: PageSEO;
    about: PageSEO;
    journals: PageSEO;
    prints: PageSEO;
    contact: PageSEO;
  };
}

export interface FullCMSData {
  version: number;
  lastUpdated: string;
  homeHero: HomeHeroConfig;
  bodiesOfWork: BodyOfWorkItem[];
  stories: StoryProjectCMS[];
  assignments: AssignmentProjectCMS[];
  about: AboutContentCMS;
  journals: JournalEntryCMS[];
  prints: PrintItemCMS[];
  contactDesks: ContactDeskCMS[];
  siteWide: SiteWideCMS;
}

export interface CMSState {
  published: FullCMSData;
  draft: FullCMSData;
  hasUnpublishedChanges: boolean;
  lastPublishedAt?: string;
  lastSavedAt?: string;
}

export type CMSUserRole = 'owner' | 'developer';

export interface CMSUserSession {
  user: {
    id: string;
    username: string;
    email: string;
    role: CMSUserRole;
    name: string;
  };
  token: string;
  expiresAt: number;
}
