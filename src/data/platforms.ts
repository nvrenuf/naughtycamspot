export type PlatformEntry = {
  slug: string;
  name: string;
  goPath: string;
  summary: string;
};

export const PLATFORMS: PlatformEntry[] = [
  {
    slug: 'chaturbate',
    name: 'Chaturbate',
    goPath: '/go/chaturbate.php',
    summary: 'High live traffic and deep tip menu support for consistent rooms.'
  },
  {
    slug: 'camsoda',
    name: 'CamSoda',
    goPath: '/go/camsoda.php',
    summary: 'Strong event windows and premium room experience options.'
  },
  {
    slug: 'bongacams',
    name: 'BongaCams',
    goPath: '/go/bongacams.php',
    summary: 'Useful geo diversification and stable discovery opportunities.'
  },
  {
    slug: 'fansly',
    name: 'Fansly',
    goPath: '/go/fansly.php',
    summary: 'Subscription + feed support to extend livestream revenue.'
  }
];
