export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/apply', label: 'Apply' },
  { href: '/packages', label: 'Packages' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/platforms', label: 'Platforms' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/posts', label: 'Posts' }
];

export const NAV_MORE: NavLink[] = [];
