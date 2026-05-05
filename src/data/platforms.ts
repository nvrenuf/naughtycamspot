export type PlatformEntry = {
  id: string;
  name: string;
  status: 'live' | 'coming_soon';
  goPath: string;
  description: string;
  signupUrlPlaceholder?: string;
  notes?: string;
};

export const PLATFORMS: PlatformEntry[] = [
  {
    id: 'chaturbate',
    name: 'Chaturbate',
    status: 'live',
    goPath: '/go/chaturbate.php',
    description: 'High live traffic and deep tip-menu support for models building consistent rooms.',
    signupUrlPlaceholder: 'https://example.com/chaturbate-signup', // Placeholder until final verified signup URL is confirmed.
  },
  {
    id: 'camsoda',
    name: 'CamSoda',
    status: 'live',
    goPath: '/go/camsoda.php',
    description: 'Strong event windows and room features for premium stream positioning.',
    signupUrlPlaceholder: 'https://example.com/camsoda-signup', // Placeholder until final verified signup URL is confirmed.
  },
  {
    id: 'bongacams',
    name: 'BongaCams',
    status: 'live',
    goPath: '/go/bongacams.php',
    description: 'Useful geo diversification and stable discovery opportunities for live creators.',
    signupUrlPlaceholder: 'https://example.com/bongacams-signup', // Placeholder until final verified signup URL is confirmed.
  },
  {
    id: 'fansly',
    name: 'Fansly',
    status: 'live',
    goPath: '/go/fansly.php',
    description: 'Subscription and feed support to extend fan monetization beyond live sessions.',
    signupUrlPlaceholder: 'https://example.com/fansly-signup', // Placeholder until final verified signup URL is confirmed.
  },
];

export const PLATFORM_IDS = PLATFORMS.map((platform) => platform.id);
