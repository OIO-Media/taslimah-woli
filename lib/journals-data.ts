export interface JournalInlineImage {
  url: string;
  caption: string;
  alt: string;
  aspectRatio?: string;
  exif?: string;
}

export interface JournalArticleSection {
  heading?: string;
  paragraphs: string[];
  callout?: string;
  inlineImage?: JournalInlineImage;
}

export interface JournalEntry {
  id: string;
  chapterNumber: number;
  chapterLabel: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  shortDate: string;
  readTime: string;
  lastUpdated?: string;
  accentColor: string;
  accentGlow: string;
  accentBg: string;
  coverImage: string;
  coverImageAlt: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  sections: JournalArticleSection[];
}

export const JOURNALS_DATA: JournalEntry[] = [
  {
    id: 'architecture-of-promises',
    chapterNumber: 1,
    chapterLabel: 'Essay 01',
    title: 'The Architecture of Promises',
    subtitle: 'On Built Intentions, Inhabited Memory & Nigerian Space',
    category: 'Published Essay',
    date: 'Autumn 2025',
    shortDate: 'Autumn 2025',
    readTime: '7 min read',
    lastUpdated: 'Recent',
    accentColor: '#3e4143',
    accentGlow: 'rgba(62, 65, 67, 0.45)',
    accentBg: 'rgba(62, 65, 67, 0.12)',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85',
    coverImageAlt: 'Interior architectural light and shadow across geometric concrete facade',
    excerpt: 'Architecture begins with a promise of permanence, yet its truest narrative emerges through the unscripted ways people inhabit its edges.',
    author: {
      name: 'Taslimah Woli',
      role: 'Documentary Photographer & Researcher',
      avatar: '/taslimah_portrait.jpg',
    },
    sections: [
      {
        paragraphs: [
          'In architecture school, we are taught to draw buildings before they exist. We draw lines that assume compliance—clean elevations, perfect ninety-degree corners, and empty rooms awaiting ideal occupants. We design for a future that arrives only in blueprints.',
          'When I began bringing a camera into the streets and compounds of Nigerian towns, that architectural conditioning met reality. A building rarely remains what its architect intended. Concrete weathers; roofs are extended with timber and corrugated zinc; verandas become workshops; parapets become resting places for laundry and conversations.',
        ],
        callout: 'A structure is not complete when the scaffolding falls; it begins when someone hangs their jacket on a window frame.',
      },
      {
        heading: 'Geometry and Distance',
        paragraphs: [
          'My background in architecture did not leave me when I picked up documentary cameras. Instead, it gave me a specific language for space: perspective, the rule of thirds, structural bays, and the distribution of daylight. I photograph people not as isolated figures against a blur, but as beings in deep conversation with their surroundings.',
          'There is a quietness that comes from keeping distance. When you step back and allow the building, the doorway, and the pavement into the frame, the human subject is neither commodified nor romanticized. They are situated. They belong to a place that has texture, history, and weight.',
        ],
        inlineImage: {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Study in vernacular light and threshold geometry. 35mm · f/4.0 · 1/200s',
          alt: 'Architectural geometry and morning daylight',
        },
      },
      {
        heading: 'Living in the Interval',
        paragraphs: [
          'Across Nigeria, we live among unfinished edifices, colonial legacies, and ambitious mid-century modern structures that carry the dreams of earlier generations. To document these spaces is to document resilience without turning it into spectacle.',
          'Photography, for me, is research. It is asking what this wall was built for, who walks past it at sunrise, and why the afternoon shadow falls across this particular bench. The answers are rarely spoken; they are written in the quiet habits of daily life.',
        ],
      },
    ],
  },
  {
    id: 'notes-from-kaduna',
    chapterNumber: 2,
    chapterLabel: 'Field Notes 02',
    title: 'Field Notes: Kaduna & The Northern Horizon',
    subtitle: 'Reflections from the Open Arts Residency',
    category: 'Residency Notes',
    date: 'Winter 2025',
    shortDate: 'Winter 2025',
    readTime: '5 min read',
    lastUpdated: 'Recent',
    accentColor: '#8c8e90',
    accentGlow: 'rgba(140, 142, 144, 0.45)',
    accentBg: 'rgba(140, 142, 144, 0.12)',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=85',
    coverImageAlt: 'Northern landscape horizon and geometric compound wall',
    excerpt: 'During my residency at Open Arts in Kaduna, the morning light revealed a different geometry—wide, calm, and measuring the quiet intervals between vernacular earth and sky.',
    author: {
      name: 'Taslimah Woli',
      role: 'Documentary Photographer & Researcher',
      avatar: '/taslimah_portrait.jpg',
    },
    sections: [
      {
        paragraphs: [
          'The quality of light in Kaduna in December is unmistakable. The harmattan dust filters the sun into a pale, even illumination that eliminates harsh glare and softens the edges of earth-rendered compounds.',
          'At the Open Arts residency, my work turned toward the cadence of northern residential quarters. The architecture here relies on earth, adobe masonry, and low-slung compounds that preserve cool interiors while presenting calm, sculptural exteriors to the street.',
        ],
        callout: 'Here, silence is spatial. The wide streets and low compound walls give the horizon room to breathe.',
      },
      {
        heading: 'Patience as Method',
        paragraphs: [
          'Documentary fieldwork cannot be rushed. You do not arrive in a neighborhood with equipment and immediately begin photographing. You walk the perimeter. You return at the same hour three mornings in a row until your presence is no longer an event.',
          'Once the camera is accepted as part of the environment, the real work begins: observing the posture of an elder seated by a doorway, the geometry of children crossing an unpaved lane, and the delicate line where dried clay meets morning blue.',
        ],
        inlineImage: {
          url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Morning threshold along compound perimeter, Kaduna. 50mm · f/2.8 · 1/320s',
          alt: 'Portrait of resident in morning light against compound wall',
        },
      },
    ],
  },
  {
    id: 'wood-becoming-field-log',
    chapterNumber: 3,
    chapterLabel: 'Research Log 03',
    title: 'Wood, Becoming: Material & Labor',
    subtitle: 'Research Journal from the Grant-Supported Documentary Project',
    category: 'Project Notes',
    date: 'Spring 2026',
    shortDate: 'Spring 2026',
    readTime: '6 min read',
    lastUpdated: 'Ongoing',
    accentColor: '#6e5a47',
    accentGlow: 'rgba(110, 90, 71, 0.45)',
    accentBg: 'rgba(110, 90, 71, 0.12)',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85',
    coverImageAlt: 'Timber stacks drying in sawmill yard beside riverbank',
    excerpt: 'Documenting timber means understanding time at two distinct speeds: the slow biological growth of hardwood and the immediate, sharp cadence of the saw.',
    author: {
      name: 'Taslimah Woli',
      role: 'Documentary Photographer & Researcher',
      avatar: '/taslimah_portrait.jpg',
    },
    sections: [
      {
        paragraphs: [
          '\'Wood, Becoming\' is a documentary project supported by grants that explores the physical and economic life of timber in Nigeria. It tracks the material from its origin in regional forests through waterborne transport to municipal sawmills and domestic carpentry workshops.',
          'Standing in a sawmill at 7:00 AM, the air is thick with damp cedar dust and diesel exhaust. The work is physically demanding, coordinated through nonverbal gestures and rhythmic bodily knowledge developed over decades.',
        ],
        callout: 'Every timber plank carries two histories: the forest that grew it, and the hands that squared its edges.',
      },
      {
        heading: 'Research-Led Documentation',
        paragraphs: [
          'My documentary practice is deliberately research-led. Before photographing a timber depot, I spend hours recording species names, transport routes, and price fluctuations with the traders. Understanding the supply chain gives the images contextual integrity.',
          'The camera documents the physical dialogue between wood and steel: the serrated teeth of circular blades, the hand planes lined up on workbench edges, and the sawdust clinging to working forearms. These are not nostalgic pictures; they are visual records of essential material labor.',
        ],
        inlineImage: {
          url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
          caption: 'Hand planes and joinery gauges on master workbench. 60mm macro · f/4.0 · 1/125s',
          alt: 'Woodworking tools on workbench',
        },
      },
    ],
  },
];
