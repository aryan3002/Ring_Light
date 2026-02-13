export type FeatureIconKey =
  | 'monitor'
  | 'thermometer'
  | 'layers'
  | 'share2'
  | 'keyboard'
  | 'wifi';

export type StatIconKey = 'users' | 'globe' | 'zap';

export interface LandingFeature {
  icon: FeatureIconKey;
  title: string;
  description: string;
  accent: string;
  badge: string;
}

export interface LandingStat {
  icon: StatIconKey;
  value: string;
  label: string;
}

export const LANDING_CONTENT = {
  brandName: 'Glow Up Studio',
  hero: {
    eyebrow: 'Camera-ready lighting',
    titlePrimary: 'Look clear on camera',
    titleAccent: 'in every meeting, stream, and recording.',
    description:
      'Turn your screen into a soft key light in seconds. Match your room, save presets, and stay consistent across every session.',
    primaryCta: 'Open Studio',
    secondaryCta: 'Browse Presets',
    trustPoints: ['No account required', 'Works offline', 'Keyboard-first controls'],
  },
  demo: {
    eyebrow: 'Live preview',
    titlePrimary: 'Adjust once.',
    titleAccent: 'Use everywhere.',
    description:
      'Preview your exact output before you go live, then reuse your setup for calls, tutorials, and streams.',
    controlsHeading: 'Lighting controls',
    outputLabel: 'Current output',
    cta: 'Try the full studio',
  },
  cta: {
    titlePrimary: 'Start better lighting',
    titleAccent: 'in 10 seconds.',
    description:
      'Built for creators and remote teams who need fast, reliable camera lighting without extra hardware.',
    primaryCta: 'Launch Studio',
    secondaryCta: 'Explore Presets',
    supportCopy: ['No account required', 'Offline ready', 'Free to start'],
    socialProofLabel: 'Trusted by creators and distributed teams',
  },
  footer: {
    tagline: 'Camera-ready lighting for creators and teams.',
  },
} as const;

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: 'monitor',
    title: 'Turn Your Screen Into a Key Light',
    description:
      'Use your full display as a soft, even light source so you look clear and flattering on every camera.',
    accent: '#FF006E',
    badge: 'Studio quality',
  },
  {
    icon: 'thermometer',
    title: 'Dial In Accurate Color Temperature',
    description:
      'Match room lighting in seconds with precise Kelvin controls from warm 2700K to cool 9000K.',
    accent: '#FFBE0B',
    badge: '2700K to 9000K',
  },
  {
    icon: 'layers',
    title: 'Save Lighting Presets',
    description:
      'Create reusable setups for meetings, streaming, tutorials, and late-night sessions.',
    accent: '#39FF14',
    badge: 'One-click recall',
  },
  {
    icon: 'share2',
    title: 'Share Setups Instantly',
    description:
      'Generate links and short codes so teammates and collaborators can import your exact lighting profile.',
    accent: '#00F0FF',
    badge: 'Links + codes',
  },
  {
    icon: 'keyboard',
    title: 'Keyboard-First Workflow',
    description:
      'Adjust brightness and temperature without breaking your recording flow using fast, configurable shortcuts.',
    accent: '#FF006E',
    badge: 'No mouse required',
  },
  {
    icon: 'wifi',
    title: 'Offline Ready as a PWA',
    description:
      'Install once and keep your lighting controls available even when your internet connection drops.',
    accent: '#FFBE0B',
    badge: 'Works anywhere',
  },
];

export const LANDING_STATS: LandingStat[] = [
  { icon: 'users', value: '50K+', label: 'Active users' },
  { icon: 'globe', value: '120+', label: 'Countries' },
  { icon: 'zap', value: '1M+', label: 'Sessions' },
];
