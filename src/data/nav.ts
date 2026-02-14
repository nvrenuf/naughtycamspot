export type NavLink = {
  href: string;
  label: string;
  section?: 'Getting Started' | 'Guides' | 'Community' | 'Insights';
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/packages/', label: 'Packages' },
  { href: '/how-it-works/', label: 'How It Works' },
  { href: '/apply/', label: 'Apply' },
  { href: '/platforms/', label: 'Platforms' }
];

export const NAV_MORE: NavLink[] = [
  { href: '/startright/', label: 'StartRight', section: 'Getting Started' },
  { href: '/recruiting/', label: 'Recruiting', section: 'Getting Started' },
  { href: '/promotion/', label: 'Promotion', section: 'Getting Started' },
  { href: '/resources/platforms/', label: 'Platform Guides', section: 'Guides' },
  { href: '/gear-kits/', label: 'Gear Kits', section: 'Guides' },
  { href: '/community/', label: 'Community', section: 'Community' },
  { href: '/events/', label: 'Events', section: 'Community' },
  { href: '/proof/', label: 'Proof', section: 'Insights' },
  { href: '/earnings/', label: 'Earnings', section: 'Insights' },
  { href: '/blog/', label: 'Blog', section: 'Insights' }
];
