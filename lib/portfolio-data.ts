export type PortfolioCategory =
  | 'Stories'
  | 'Assignments'
  | 'About'
  | 'Journals'
  | 'Prints'
  | 'Contact';

export interface PortfolioItem {
  id: string;
  number: string;
  title: string;
  layoutBTitle: string;
  tagline: string;
  category: PortfolioCategory;
  image: string;
  imageAlt: string;
  aspectRatio?: string;
  description: string;
  location?: string;
  year: string;
  gallery: {
    url: string;
    caption: string;
    exif?: string;
  }[];
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'people-and-places',
    number: '',
    title: 'People and Places',
    layoutBTitle: 'PEOPLE AND PLACES',
    tagline: 'INHABITED SPACES & DAILY LIFE',
    category: 'Stories',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=75',
    imageAlt: 'Documentary photograph by Taslimah Woli of person in relationship to architecture',
    description: 'Her most expansive body of work, observing people in relation to the spaces they inhabit. Rooted in architectural training, each composition considers how built forms, domestic thresholds, and streets frame daily human presence.',
    location: 'Nigeria',
    year: '2022 – Present',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=75',
        caption: 'Morning threshold, domestic courtyard, Lagos',
        exif: '50mm · f/2.0 · 1/250s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=75',
        caption: 'Figure in relation to concrete arcade and afternoon shadow',
        exif: '45mm · f/2.8 · 1/320s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=75',
        caption: 'Quiet pause along residential perimeter wall',
        exif: '85mm · f/2.0 · 1/400s · ISO 125',
      },
      {
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1400&q=75',
        caption: 'Market corridor threshold, early dawn ambient light',
        exif: '63mm · f/2.8 · 1/200s · ISO 200',
      },
    ],
  },
  {
    id: 'campus',
    number: '',
    title: 'Campus',
    layoutBTitle: 'CAMPUS',
    tagline: 'INSTITUTIONAL GROUNDS & STUDENT RHYTHMS',
    category: 'Stories',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=75',
    imageAlt: 'Architectural documentary study of campus buildings and student life by Taslimah Woli',
    description: 'An architectural and documentary inquiry into institutional grounds, modernist walkways, and student rhythms—reviewed and validated at the Photographer\'s Studio Visit with Amanda Iheme at Alliance Française Lagos.',
    location: 'Nigeria',
    year: '2023 – Present',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=75',
        caption: 'Faculty quadrangle, midday light through cantilever overhang',
        exif: '35mm · f/4.0 · 1/400s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=75',
        caption: 'Library ramp and solitary figure in transit',
        exif: '50mm · f/2.8 · 1/250s · ISO 125',
      },
      {
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=75',
        caption: 'Concrete brise-soleil casting linear patterns across walkway',
        exif: '28mm · f/5.6 · 1/500s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=75',
        caption: 'Gathering beneath lecture theater pilotis before afternoon rain',
        exif: '35mm · f/2.0 · 1/200s · ISO 200',
      },
    ],
  },
  {
    id: 'built-for-another-time',
    number: '',
    title: 'Built for Another Time',
    layoutBTitle: 'BUILT FOR ANOTHER TIME',
    tagline: 'IN DEVELOPMENT · ARCHITECTURAL INQUIRY',
    category: 'Stories',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=75',
    imageAlt: 'Documentary architectural photograph of historical Nigerian building by Taslimah Woli',
    description: 'An ongoing project in development, demonstrating the architectural rigor and spatial eye brought to editorial and commissioned documentary work.',
    location: 'Nigeria',
    year: 'In Development',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=75',
        caption: 'Civic registry facade, weathered plaster and mid-century lintel',
        exif: '35mm · f/5.6 · 1/160s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=75',
        caption: 'Timber louvres and high ceiling clerestory in postal building',
        exif: '45mm · f/4.0 · 1/125s · ISO 160',
      },
      {
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=75',
        caption: 'Railway residential quarter, brick foundation and encroaching garden',
        exif: '50mm · f/3.5 · 1/250s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=75',
        caption: 'Corridor perspective, commercial building circa 1968',
        exif: '28mm · f/5.6 · 1/200s · ISO 100',
      },
    ],
  },
  {
    id: 'wood-becoming',
    number: '',
    title: 'Wood, Becoming',
    layoutBTitle: 'WOOD, BECOMING',
    tagline: 'IN DEVELOPMENT · RESEARCH-LED DOCUMENTARY',
    category: 'Stories',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=75',
    imageAlt: 'Research-led documentary study on timber and woodwork in Nigeria by Taslimah Woli',
    description: 'A research-led documentary project supported by grants, investigating timber extraction, sawmill waterways, and woodworking traditions in Nigeria. This project marks the direction my personal practice is moving toward.',
    location: 'Nigeria',
    year: 'In Development',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=75',
        caption: 'Hardwood planks drying in vertical racks along riverbank sawmill',
        exif: '50mm · f/3.5 · 1/250s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=75',
        caption: 'Carpenter examining grain alignment for joinery commission',
        exif: '45mm · f/2.8 · 1/200s · ISO 160',
      },
      {
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=75',
        caption: 'Waterborne timber transport at confluence point, morning mist',
        exif: '35mm · f/4.0 · 1/400s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=75',
        caption: 'Hand planes and brass measuring gauge on cedar workbench',
        exif: '60mm macro · f/4.0 · 1/125s · ISO 200',
      },
    ],
  },
  {
    id: 'civic-architecture',
    number: '',
    title: 'Civic Architecture & Urban Fabric',
    layoutBTitle: 'CIVIC ARCHITECTURE',
    tagline: 'SPATIAL COMMISSIONS & MONOGRAPHS',
    category: 'Assignments',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=75',
    imageAlt: 'Commissioned architectural documentation of civic space in Nigeria by Taslimah Woli',
    description: 'Commissioned spatial studies documenting public structures, civic infrastructure, and contemporary architecture in dialogue with surrounding communities.',
    location: 'Lagos & Regional Nigeria',
    year: '2024 – 2026',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=75',
        caption: 'Public atrium and cantilevered clerestory, morning light orientation',
        exif: '35mm · f/5.6 · 1/160s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=75',
        caption: 'Natural ventilation louvres and shaded circulation spine',
        exif: '45mm · f/4.0 · 1/125s · ISO 125',
      },
    ],
  },
  {
    id: 'cultural-heritage',
    number: '',
    title: 'Cultural Heritage & Craft Archives',
    layoutBTitle: 'CULTURAL HERITAGE ARCHIVES',
    tagline: 'DOCUMENTARY RESEARCH COMMISSIONS',
    category: 'Assignments',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=75',
    imageAlt: 'Documentary fieldwork on traditional craftsmanship by Taslimah Woli',
    description: 'Long-form documentary documentation of traditional craftsmanship, cultural archives, and artisanal communities for institutional publications and heritage research.',
    location: 'Benin City & Kaduna, Nigeria',
    year: '2024 – 2025',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=75',
        caption: 'Traditional joinery workshop and hand-hewn structural timber',
        exif: '50mm · f/3.5 · 1/200s · ISO 100',
      },
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=75',
        caption: 'Master artisan inspecting brass foundry molds in afternoon light',
        exif: '45mm · f/2.8 · 1/160s · ISO 160',
      },
    ],
  },
];

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  location: string;
  excerpt: string;
  paragraphs: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'architecture-of-promises',
    title: 'The Architecture of Promises',
    subtitle: 'On Built Intentions, Inhabited Memory & Nigerian Space',
    date: 'Autumn 2025',
    readTime: '7 min read',
    location: 'Nigeria',
    excerpt: 'Architecture begins with a promise of permanence, yet its truest narrative emerges through the unscripted ways people inhabit its edges.',
    paragraphs: [
      'In architecture school, we are taught to draw buildings before they exist. We draw lines that assume compliance—clean elevations, perfect ninety-degree corners, and empty rooms awaiting ideal occupants. We design for a future that arrives only in blueprints.',
      'When I began bringing a camera into the streets and compounds of Nigerian towns, that architectural conditioning met reality. A building rarely remains what its architect intended. Concrete weathers; roofs are extended with timber and corrugated zinc; verandas become workshops; parapets become resting places for laundry and conversations.',
      'My background in architecture did not leave me when I picked up documentary cameras. Instead, it gave me a specific language for space: perspective, the rule of thirds, structural bays, and the distribution of daylight. I photograph people not as isolated figures against a blur, but as beings in deep conversation with their surroundings.',
    ],
  },
  {
    id: 'notes-from-kaduna',
    title: 'Field Notes: Kaduna & The Northern Horizon',
    subtitle: 'Reflections from the Open Arts Residency',
    date: 'Winter 2025',
    readTime: '5 min read',
    location: 'Kaduna, Nigeria',
    excerpt: 'During my residency at Open Arts in Kaduna, the morning light revealed a different geometry—wide, calm, and measuring the quiet intervals between vernacular earth and sky.',
    paragraphs: [
      'The quality of light in Kaduna in December is unmistakable. The harmattan dust filters the sun into a pale, even illumination that eliminates harsh glare and softens the edges of earth-rendered compounds.',
      'At the Open Arts residency, my work turned toward the cadence of northern residential quarters. The architecture here relies on earth, adobe masonry, and low-slung compounds that preserve cool interiors while presenting calm, sculptural exteriors to the street.',
      'Documentary fieldwork cannot be rushed. You do not arrive in a neighborhood with equipment and immediately begin photographing. You walk the perimeter. You return at the same hour three mornings in a row until your presence is no longer an event.',
    ],
  },
  {
    id: 'wood-becoming-field-log',
    title: 'Wood, Becoming: Material & Labor',
    subtitle: 'Research Journal from the Grant-Supported Documentary Project',
    date: 'Spring 2026',
    readTime: '6 min read',
    location: 'Nigeria',
    excerpt: 'Documenting timber means understanding time at two distinct speeds: the slow biological growth of hardwood and the immediate, sharp cadence of the saw.',
    paragraphs: [
      '\'Wood, Becoming\' is a documentary project supported by grants that explores the physical and economic life of timber in Nigeria. It tracks the material from its origin in regional forests through waterborne transport to municipal sawmills and domestic carpentry workshops.',
      'Standing in a sawmill at 7:00 AM, the air is thick with damp cedar dust and diesel exhaust. The work is physically demanding, coordinated through nonverbal gestures and rhythmic bodily knowledge developed over decades.',
      'My documentary practice is deliberately research-led. Before photographing a timber depot, I spend hours recording species names, transport routes, and price fluctuations with the traders. Understanding the supply chain gives the images contextual integrity.',
    ],
  },
];

export interface PrintItem {
  id: string;
  title: string;
  series: string;
  medium: string;
  paper: string;
  editionSize: string;
  sizes: { label: string; dimensions: string; price: string }[];
  image: string;
  description: string;
}

export const PRINT_COLLECTION: PrintItem[] = [
  {
    id: 'print-01',
    title: 'Domestic Threshold, Morning Light',
    series: 'People and Places',
    medium: 'Archival Pigment Print on Cotton Rag',
    paper: 'Hahnemühle Photo Rag 308gsm (100% Cotton)',
    editionSize: 'Edition of 15 + 2 Artist Proofs',
    sizes: [
      { label: 'Studio Edition', dimensions: '16 × 20 in (40 × 50 cm)', price: '$650' },
      { label: 'Gallery Edition', dimensions: '24 × 36 in (60 × 90 cm)', price: '$1,250' },
      { label: 'Exhibition Edition', dimensions: '30 × 45 in (75 × 115 cm)', price: '$2,200' },
    ],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=75',
    description: 'From the People and Places series. Hand-signed and numbered in graphite on recto, accompanied by stamped certificate of authenticity.',
  },
  {
    id: 'print-02',
    title: 'Faculty Quadrangle & Brise-Soleil',
    series: 'Campus',
    medium: 'Archival Carbon Pigment Print',
    paper: 'Canson Infinity Platine Fibre Rag 310gsm',
    editionSize: 'Edition of 12 + 2 Artist Proofs',
    sizes: [
      { label: 'Studio Edition', dimensions: '16 × 20 in (40 × 50 cm)', price: '$700' },
      { label: 'Gallery Edition', dimensions: '24 × 36 in (60 × 90 cm)', price: '$1,400' },
      { label: 'Exhibition Edition', dimensions: '30 × 45 in (75 × 115 cm)', price: '$2,400' },
    ],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=75',
    description: 'From the Campus series. Spatial study of modernist institutional concrete under clear equatorial daylight.',
  },
  {
    id: 'print-03',
    title: 'Civic Registry Facade at Dawn',
    series: 'Built for Another Time',
    medium: 'Archival Silver Gelatin Print',
    paper: 'Ilford Multigrade FB Classic 255gsm',
    editionSize: 'Edition of 10 + 2 Artist Proofs',
    sizes: [
      { label: 'Studio Edition', dimensions: '16 × 20 in (40 × 50 cm)', price: '$750' },
      { label: 'Gallery Edition', dimensions: '24 × 36 in (60 × 90 cm)', price: '$1,500' },
    ],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=75',
    description: 'From Built for Another Time. Weathered architectural facade and geometric shadows, printed with deep tonal range.',
  },
  {
    id: 'print-04',
    title: 'Hardwood Planks in Vertical Drying Racks',
    series: 'Wood, Becoming',
    medium: 'Archival Pigment Print on Cotton Rag',
    paper: 'Hahnemühle Photo Rag Baryta 315gsm',
    editionSize: 'Edition of 10 + 2 Artist Proofs',
    sizes: [
      { label: 'Studio Edition', dimensions: '16 × 20 in (40 × 50 cm)', price: '$800' },
      { label: 'Gallery Edition', dimensions: '24 × 36 in (60 × 90 cm)', price: '$1,600' },
    ],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=75',
    description: 'From the grant-supported research project Wood, Becoming. Timber texture and riverbank geometry, printed on archival baryta.',
  },
  {
    id: 'print-05',
    title: 'Arcade Shadow and Balcony Line',
    series: 'People and Places',
    medium: 'Archival Pigment Print',
    paper: 'Canson Infinity Platine Fibre Rag 310gsm',
    editionSize: 'Edition of 15 + 2 Artist Proofs',
    sizes: [
      { label: 'Studio Edition', dimensions: '16 × 20 in (40 × 50 cm)', price: '$650' },
      { label: 'Gallery Edition', dimensions: '24 × 36 in (60 × 90 cm)', price: '$1,300' },
    ],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=75',
    description: 'From People and Places. Architectural figure study balancing deep natural shadows against geometric residential facades.',
  },
];

export const ARTIST_INFO = {
  name: 'Taslimah Woli',
  subtitle: 'Documentary Photographer & Spatial Researcher',
  bio: 'Taslimah Woli is a documentary photographer based in Nigeria, working across Africa and internationally. Her practice explores people, architecture, and the relationship between people and the spaces they inhabit. Her background in architecture shapes a visual eye rooted in perspective, geometry, the rule of thirds, and quiet spatial distance. She undertakes editorial, institutional, and research commissions alongside personal documentary projects.',
  bioParagraphs: [
    'Taslimah Woli is a documentary photographer based in Nigeria, working across Africa and internationally. Her practice is centered on people, architecture, and the relationship between people and the spaces they inhabit. Alongside personal documentary projects, she undertakes editorial, architectural, and institutional commissions, and is beginning to explore film.',
    'Her background in architecture directly shapes her visual instinct. She works with strong perspective, geometry, and the rule of thirds, positioning people in relation to buildings and inhabited space rather than in isolation. Her images carry a characteristic distance and quietness—favoring research, spatial sensitivity, and sustained observation over spectacle.',
    'She works for magazines, publications, cultural organisations, institutions, and selected brands. Her practice unites photographic rigor with architectural understanding and investigative writing, researching the context of what she documents rather than focusing solely on aesthetics.',
  ],
  awards: [
    'Commissions & Features — ART X Lagos, Tell That Story, Uncover Naija',
    'Exhibition — "Women Street Photographers" (Italy)',
    'Exhibition & Feature — Uncover Naija Exhibition',
    'Critique & Portfolio Review — The Photographer\'s Studio Visit with Amanda Iheme (Alliance Française Lagos)',
    'Artist Residency — Open Arts Residency (Kaduna)',
    'Artist Residency — Rongo Art Foundation Residency (Benin City)',
    'Published Essay — "The Architecture of Promises"',
    'Grant Recipient — Ongoing research-led project "Wood, Becoming"',
  ],
  clients: [
    'Cultural Foundations & Non-Profits',
    'Editorial Magazines & Independent Journals',
    'Architectural Ateliers & Cultural Institutions',
    'Selected Brands & Publishing Houses',
  ],
  email: 'hello@taslimahwoli.com',
  phone: 'Available on request',
  location: 'Nigeria · Available for local & international assignments',
};

export const HERO_CONFIG = {
  image: '/hero-architecture.jpg',
  imageAlt: 'Quiet architectural study of figure in relation to light and space by Taslimah Woli',
  tagline: 'DOCUMENTARY PHOTOGRAPHY & SPATIAL RESEARCH',
  titleLine1: 'TASLIMAH',
  titleLine2: 'WOLI',
  subtitle: 'PEOPLE, ARCHITECTURE & INHABITED SPACE',
  scrollPrompt: 'EXPLORE BODIES OF WORK',
};
