export interface StoryPhoto {
  id: string;
  url: string;
  caption: string;
  exif?: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface StoryProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  photoCount: number;
  location: string;
  camera: string;
  coverImage: string;
  rating?: string;
  formatBadge?: string;
  leadParagraph: string;
  narrative: string[];
  photos: StoryPhoto[];
}

export const STORIES_DATA: StoryProject[] = [
  {
    id: 'people-and-places',
    number: '01',
    title: 'People and Places',
    subtitle: 'Documentary Series · Inhabited Environments',
    year: '2022 – Present',
    photoCount: 6,
    location: 'Nigeria',
    camera: 'Medium Format & 35mm Systems',
    formatBadge: 'CORE BODY',
    coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'My most expansive body of work, observing people in relation to the spaces they inhabit. Rooted in architectural training, each composition considers how built forms, domestic thresholds, and streets frame daily human presence.',
    narrative: [
      'Trained in architecture, my visual eye relies on geometry, perspective, and the rule of thirds. A building is never just an inert backdrop; it establishes the scale, lines of sight, and spatial rhythms through which daily life unfolds.',
      'These photographs maintain a deliberate distance and quietness. Rather than demanding attention or manufacturing drama, the frame allows human gestures, posture, and pauses to sit naturally within residential facades, market verandas, and civic courtyards.',
      'Documented across communities in Nigeria, the work traces how residents claim space, modify thresholds, and negotiate the built forms that surround them.',
    ],
    photos: [
      {
        id: 'pp-1',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=80',
        caption: 'Morning threshold, domestic courtyard, Lagos',
        exif: '50mm · f/2.0 · 1/250s · ISO 100',
        aspect: 'portrait',
      },
      {
        id: 'pp-2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
        caption: 'Figure in relation to concrete arcade and afternoon shadow',
        exif: '45mm · f/2.8 · 1/320s · ISO 100',
        aspect: 'portrait',
      },
      {
        id: 'pp-3',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=80',
        caption: 'Quiet pause along residential perimeter wall',
        exif: '85mm · f/2.0 · 1/400s · ISO 125',
        aspect: 'portrait',
      },
      {
        id: 'pp-4',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1400&q=80',
        caption: 'Market corridor threshold, early dawn ambient light',
        exif: '63mm · f/2.8 · 1/200s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'pp-5',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80',
        caption: 'Subject positioned along structural grid, Benin City',
        exif: '35mm · f/2.8 · 1/160s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'pp-6',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80',
        caption: 'Balcony geometry and street conversation below',
        exif: '50mm · f/2.0 · 1/500s · ISO 100',
        aspect: 'portrait',
      },
    ],
  },
  {
    id: 'campus',
    number: '02',
    title: 'Campus',
    subtitle: 'Spatial Study · Institutional Grounds',
    year: '2023 – Present',
    photoCount: 6,
    location: 'Nigeria',
    camera: '35mm Rangefinder & Field Systems',
    formatBadge: 'STUDIO VISIT',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'An architectural and documentary inquiry into institutional grounds, modernist walkways, and student rhythms—reviewed and validated at the Photographer\'s Studio Visit with Amanda Iheme at Alliance Française Lagos.',
    narrative: [
      'University campuses operate as self-contained architectural territories. Mid-century concrete lecture halls, shaded breezeways, and open lawns shape the social cadence of everyday study and transition.',
      'The series observes the intervals between lectures—the solitary walk along a covered colonnade, the convergence of shadows on a lecture hall ramp, and the quiet posture of students inhabiting institutional spaces on their own terms.',
      'The spatial geometry is intentional: long sightlines, repeating structural bays, and balanced negative space invite the viewer to sense the psychological atmosphere of the grounds.',
    ],
    photos: [
      {
        id: 'cp-1',
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80',
        caption: 'Faculty quadrangle, midday light through cantilever overhang',
        exif: '35mm · f/4.0 · 1/400s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'cp-2',
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=80',
        caption: 'Library ramp and solitary figure in transit',
        exif: '50mm · f/2.8 · 1/250s · ISO 125',
        aspect: 'portrait',
      },
      {
        id: 'cp-3',
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
        caption: 'Concrete brise-soleil casting linear patterns across walkway',
        exif: '28mm · f/5.6 · 1/500s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'cp-4',
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80',
        caption: 'Gathering beneath lecture theater pilotis before afternoon rain',
        exif: '35mm · f/2.0 · 1/200s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'cp-5',
        url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80',
        caption: 'Administrative atrium and diagonal daylight projection',
        exif: '50mm · f/2.8 · 1/320s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'cp-6',
        url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80',
        caption: 'Quiet perimeter path bordering sports field',
        exif: '45mm · f/3.5 · 1/640s · ISO 100',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'built-for-another-time',
    number: '03',
    title: 'Built for Another Time',
    subtitle: 'In Development · Architectural Documentary',
    year: 'In Development',
    photoCount: 6,
    location: 'Nigeria',
    camera: 'Architectural Perspective Systems',
    formatBadge: 'IN DEVELOPMENT',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'An ongoing project in development, demonstrating the architectural rigor and spatial eye brought to editorial and commissioned documentary work.',
    narrative: [
      'Throughout Nigerian towns and cities, structures originally erected for colonial administrations, mid-century civic ambitions, and early commercial eras remain standing, quietly absorbed into contemporary routine.',
      'This project documents these architectural relics not through nostalgia, but through clear-eyed spatial documentation: measuring proportions, observing weathering, and noting how modern inhabitants repurpose rooms designed for a different world.',
      'It reflects the analytical eye that shapes my commissioned work for publications and cultural institutions—combining architectural understanding with sensitive observation of context.',
    ],
    photos: [
      {
        id: 'bfat-1',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
        caption: 'Civic registry facade, weathered plaster and mid-century lintel',
        exif: '35mm · f/5.6 · 1/160s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'bfat-2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        caption: 'Timber louvres and high ceiling clerestory in postal building',
        exif: '45mm · f/4.0 · 1/125s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'bfat-3',
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80',
        caption: 'Railway residential quarter, brick foundation and encroaching garden',
        exif: '50mm · f/3.5 · 1/250s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'bfat-4',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
        caption: 'Corridor perspective, commercial building circa 1968',
        exif: '28mm · f/5.6 · 1/200s · ISO 100',
        aspect: 'portrait',
      },
      {
        id: 'bfat-5',
        url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1400&q=80',
        caption: 'Stairwell geometry and natural ventilation chimney',
        exif: '35mm · f/4.0 · 1/100s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'bfat-6',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
        caption: 'Perimeter ironwork against modern glass office addition',
        exif: '50mm · f/4.5 · 1/320s · ISO 100',
        aspect: 'landscape',
      },
    ],
  },
  {
    id: 'wood-becoming',
    number: '04',
    title: 'Wood, Becoming',
    subtitle: 'In Development · Research-Led Documentary',
    year: 'In Development',
    photoCount: 6,
    location: 'Nigeria',
    camera: 'Medium Format Field System',
    formatBadge: 'GRANT SUPPORTED',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    leadParagraph:
      'A research-led documentary project supported by grants, investigating timber extraction, sawmill waterways, and woodworking traditions in Nigeria. This project marks the direction my personal practice is moving toward.',
    narrative: [
      '\'Wood, Becoming\' follows the journey of timber from regional forest routes to sawmill riverbanks and local joinery benches. It is an exploration of material transformation, ecology, and the dignity of manual trade.',
      'Supported by independent grants, the work integrates photographic fieldwork with material research, oral histories, and archival investigation. It avoids superficial documentation, spending extended time alongside sawyers, timber pullers, and master carpenters.',
      'The photographs pay close attention to physical texture: the grain of wet felled logs, the geometry of timber drying racks, and the relationship between working bodies and heavy organic matter.',
    ],
    photos: [
      {
        id: 'wb-1',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
        caption: 'Hardwood planks drying in vertical racks along riverbank sawmill',
        exif: '50mm · f/3.5 · 1/250s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'wb-2',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80',
        caption: 'Carpenter examining grain alignment for joinery commission',
        exif: '45mm · f/2.8 · 1/200s · ISO 160',
        aspect: 'portrait',
      },
      {
        id: 'wb-3',
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80',
        caption: 'Waterborne timber transport at confluence point, morning mist',
        exif: '35mm · f/4.0 · 1/400s · ISO 100',
        aspect: 'landscape',
      },
      {
        id: 'wb-4',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
        caption: 'Hand planes and brass measuring gauge on cedar workbench',
        exif: '60mm macro · f/4.0 · 1/125s · ISO 200',
        aspect: 'portrait',
      },
      {
        id: 'wb-5',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80',
        caption: 'Forest boundary road, logging haul route at dusk',
        exif: '50mm · f/2.0 · 1/160s · ISO 400',
        aspect: 'landscape',
      },
      {
        id: 'wb-6',
        url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80',
        caption: 'Cross-section growth rings of salvaged iroko slab',
        exif: '45mm · f/5.6 · 1/200s · ISO 100',
        aspect: 'portrait',
      },
    ],
  },
];
