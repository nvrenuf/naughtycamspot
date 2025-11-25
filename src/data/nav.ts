export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/startright', label: 'StartRight' },
  { href: '/compare', label: 'Compare' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/gear-kits', label: 'Gear kits' },
  { href: '/blog', label: 'Blog' }
];

export const NAV_MORE: NavLink[] = [];
