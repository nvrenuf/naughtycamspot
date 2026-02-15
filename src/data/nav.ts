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
  { href: '/platforms/', label: 'Platforms' },
  { href: '/resources/', label: 'Resources' },
  { href: '/proof/', label: 'Proof' }
];

// Secondary links are intentionally footer-only (mobile-first navigation).
export const NAV_MORE: NavLink[] = [];
