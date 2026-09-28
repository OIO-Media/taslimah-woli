export interface AssignmentPhoto {
  id: string;
  url: string;
  caption: string;
  exif?: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface AssignmentProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  client: string;
  commissionType: string;
  artDirector?: string;
  publishedIn?: string;
  year: string;
  photoCount: number;
  location: string;
  camera: string;
  coverImage: string;
  rating?: string;
  formatBadge?: string;
  leadParagraph: string;
  narrative: string[];
  photos: AssignmentPhoto[];
}

export const ASSIGNMENTS_DATA: AssignmentProject[] = [
  {
    id: 'civic-architecture-nigeria',
    number: '01',
    title: 'Civic Architecture & Urban Fabric',
    subtitle: 'Spatial Studies for Architectural Monographs & Publications',
    client: 'Architectural Publications & Cultural Foundations',
    commissionType: 'Architectural & Spatial Commission',
    artDirector: 'Editorial Direction',
    publishedIn: 'Selected Architectural Publications & Monograph Features',
    year: '2024 – 2026',
    photoCount: 6,
    location: 'Lagos & Regional Nigeria',
    camera: 'Architectural Perspective Systems',
    formatBadge: 'SPATIAL',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'Commissioned spatial studies documenting public structures, civic infrastructure, and contemporary Nigerian architecture in dialogue with surrounding communities.',
    narrative: [
      'Every architectural assignment begins with site research: examining layout, daylight orientation, pedestrian circulation, and historical context before bringing a camera into the space.',
      'Rather than producing sterile, decontextualized renders of buildings, my approach demonstrates how architecture is actually used, weathered, and inhabited by people. Perspective lines and proportions remain geometrically true, while natural light conveys the real atmosphere of the site.',
      'Delivered as complete visual packages for architectural monographs, institutional archives, and design journals, supported by detailed site notes and architectural captions.',
    ],
    photos: [
      {
        id: 'ca-1',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
        caption: 'Public atrium and cantilevered clerestory, morning light orientation',
        exif: '35mm · f/5.6 · 1/160s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ca-2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        caption: 'Natural ventilation louvres and shaded circulation spine',
        exif: '45mm · f/4.0 · 1/125s · ISO 125',
        aspect: 'portrait',
      },
      {
        id: 'ca-3',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
        caption: 'Exterior facade perspective showing street interaction and public steps',
        exif: '28mm · f/5.6 · 1/320s · ISO 100',
        aspect: 'portrait',
      },
      {
        id: 'ca-4',
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80',
        caption: 'Material study: cast concrete and regional timber formwork',
        exif: '50mm · f/3.5 · 1/200s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ca-5',
        url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1400&q=80',
        caption: 'Central stair core and vertical lightwell shaft',
        exif: '35mm · f/4.0 · 1/100s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'ca-6',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
        caption: 'Civic plaza interface at dusk with pedestrian flow',
        exif: '45mm · f/4.0 · 1/250s · ISO 160',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'cultural-heritage-archives',
    number: '02',
    title: 'Cultural Heritage & Craft Archives',
    subtitle: 'Fieldwork for Cultural Foundations & Independent Presses',
    client: 'Cultural Foundations & Tell That Story',
    commissionType: 'Documentary Research Commission',
    artDirector: 'Institutional Curation',
    publishedIn: 'Heritage Dossiers & Research Publications',
    year: '2024 – 2025',
    photoCount: 6,
    location: 'Benin City & Kaduna, Nigeria',
    camera: 'Medium Format Field System',
    formatBadge: 'RESEARCH',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'Long-form documentary documentation of traditional craftsmanship, cultural archives, and artisanal communities for institutional publications and heritage research.',
    narrative: [
      'Documenting cultural heritage requires sustained listening and deep respect for the people who hold knowledge. Working with cultural organisations and independent publishers, each assignment is built upon community trust, patience, and ethical documentary practice.',
      'The photographic work is accompanied by thorough contextual research, ensuring that traditional practices—from brass working to vernacular masonry—are represented with precision and dignity.',
      'The resulting photographic dossiers have supported institutional exhibitions, academic publications, and independent monographs across West Africa.',
    ],
    photos: [
      {
        id: 'ch-1',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
        caption: 'Traditional joinery workshop and hand-hewn structural timber',
        exif: '50mm · f/3.5 · 1/200s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ch-2',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80',
        caption: 'Master artisan inspecting brass foundry molds in afternoon light',
        exif: '45mm · f/2.8 · 1/160s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'ch-3',
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80',
        caption: 'Historic courtyard threshold, clay-rendered compound walls',
        exif: '35mm · f/4.0 · 1/250s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ch-4',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
        caption: 'Archival tools preserved across three generations of craftsmen',
        exif: '60mm macro · f/4.0 · 1/125s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'ch-5',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80',
        caption: 'Perimeter trail leading to historic dye pits, Kaduna',
        exif: '50mm · f/2.8 · 1/320s · ISO 125',
        aspect: 'landscape',
      },
      {
        id: 'ch-6',
        url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80',
        caption: 'Textile drying racks under harmattan haze, open field',
        exif: '45mm · f/5.6 · 1/400s · ISO 100',
        aspect: 'portrait',
      },
    ],
  },
  {
    id: 'editorial-environmental-portraits',
    number: '03',
    title: 'Editorial Profiles & Workspace Studies',
    subtitle: 'Environmental Inquiries for Magazines & Cultural Publications',
    client: 'Editorial Magazines & Cultural Journals',
    commissionType: 'Editorial Assignment',
    artDirector: 'Photo Editor',
    publishedIn: 'Selected Editorial Features & Monograph Profiles',
    year: '2025 – 2026',
    photoCount: 6,
    location: 'Nigeria · Available Internationally',
    camera: '35mm Field Rangefinder',
    formatBadge: 'EDITORIAL',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'Environmental portraiture and workspace studies situating practitioners, artists, and researchers in relation to the physical spaces they shape.',
    narrative: [
      'Refusing artificial studio setups, these editorial assignments position subjects within the environments where their thinking and work take place: archives, studios, workshops, and landscape field sites.',
      'The approach privileges quiet, unhurried observation over performative posing. By giving subjects breathing room and paying close attention to natural room light, the resulting portraits carry presence, intelligence, and spatial depth.',
      'Trusted by editors for reliability under publication deadlines, clear communication, and nuanced understanding of assignment briefs.',
    ],
    photos: [
      {
        id: 'ep-1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
        caption: 'Architect in archive studio, natural northern window exposure',
        exif: '50mm · f/2.0 · 1/250s · ISO 100',
        aspect: 'portrait',
      },
      {
        id: 'ep-2',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=80',
        caption: 'Researcher examining rare botanical folio at study desk',
        exif: '45mm · f/2.8 · 1/160s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'ep-3',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=80',
        caption: 'Sculptor in foundry yard, dusk ambient light',
        exif: '85mm · f/2.0 · 1/200s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'ep-4',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1400&q=80',
        caption: 'Urban planner reviewing civic transport maps, field office',
        exif: '35mm · f/2.8 · 1/125s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'ep-5',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80',
        caption: 'Writer at veranda table, early morning study session',
        exif: '50mm · f/1.8 · 1/320s · ISO 100',
        aspect: 'portrait',
      },
      {
        id: 'ep-6',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80',
        caption: 'Printmaker examining test proof against studio daylight',
        exif: '45mm · f/2.8 · 1/180s · ISO 160',
        aspect: 'portrait',
      },
    ],
  },
  {
    id: 'institutional-community-initiatives',
    number: '04',
    title: 'Institutional Documentation & Civic Programs',
    subtitle: 'Visual Reporting for Organisations & Selected Brands',
    client: 'Organisations, Institutions & Selected Brands',
    commissionType: 'Institutional Documentation',
    artDirector: 'Program Director',
    publishedIn: 'Annual Reports, Program Monographs & Digital Archives',
    year: '2025 – 2026',
    photoCount: 6,
    location: 'Nigeria & West Africa',
    camera: 'Documentary Field System',
    formatBadge: 'COMMISSION',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'Comprehensive documentation of social initiatives, civic programs, and educational institutions across Nigeria for institutional publications and program monographs.',
    narrative: [
      'Commissioned by organisations, cultural institutions, and forward-thinking brands, these assignments document the tangible reality of community programs with dignity and nuance.',
      'Rather than relying on visual clichés often found in institutional reporting, the imagery prioritizes agency, human connection, and authentic spatial relationships.',
      'Delivered with rigorous file handling, metadata tagging, and editorial curation ready for high-resolution print monographs, annual reviews, and digital archives.',
    ],
    photos: [
      {
        id: 'ic-1',
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80',
        caption: 'Vocational training campus and workshop gathering, Kaduna',
        exif: '35mm · f/4.0 · 1/250s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ic-2',
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=80',
        caption: 'Community library reading room and afternoon study circle',
        exif: '50mm · f/2.8 · 1/160s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'ic-3',
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
        caption: 'Solar micro-grid installation in rural cooperative center',
        exif: '28mm · f/5.6 · 1/400s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ic-4',
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80',
        caption: 'Primary healthcare center veranda and maternal support group',
        exif: '35mm · f/2.8 · 1/200s · ISO 125',
        aspect: 'portrait',
      },
      {
        id: 'ic-5',
        url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80',
        caption: 'Community meeting convened in shaded town hall courtyard',
        exif: '50mm · f/3.5 · 1/250s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'ic-6',
        url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80',
        caption: 'Youth civic leadership forum in public amphitheater',
        exif: '45mm · f/4.0 · 1/320s · ISO 100',
        aspect: 'landscape',
      },
    ],
  },
];
