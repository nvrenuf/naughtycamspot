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
    status: 'open',
    statusLabel: 'Open',
    goPath: '/go/stripchat',
    note: 'Fast approvals, strong discovery tools, and easy schedule control.'
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
    slug: 'bonga',
    name: 'Bonga',
    status: 'waitlist',
    statusLabel: 'Waitlist',
    goPath: '/go/bonga',
    note: 'Great geo diversification; we add new slots weekly.'
  }
];

