export type PlatformStatus = 'open' | 'limited' | 'waitlist';

export type PlatformEntry = {
  slug: string;
  name: string;
  status: PlatformStatus;
  statusLabel: string;
  goPath: string;
  note: string;
};

export const PLATFORMS: PlatformEntry[] = [
  {
    slug: 'stripchat',
    name: 'Stripchat',
    status: 'waitlist',
    statusLabel: 'Waitlist',
    goPath: '/go/stripchat',
    note: 'Launch prep is still underway. Apply once and we will notify you when live signup opens.'
  },
  {
    slug: 'chaturbate',
    name: 'Chaturbate',
    status: 'open',
    statusLabel: 'Open',
    goPath: '/go/chaturbate',
    note: 'High traffic, long-tail tipping, and recurring fan rooms.'
  },
  {
    slug: 'camsoda',
    name: 'CamSoda',
    status: 'limited',
    statusLabel: 'Limited',
    goPath: '/go/camsoda',
    note: 'Quality-focused traffic with strong contests and promo placements.'
  },
  {
    slug: 'bongacams',
    name: 'BongaCams',
    status: 'open',
    statusLabel: 'Open',
    goPath: '/go/bongacams',
    note: 'Great geo diversification with steady discovery opportunities.'
  }
];
