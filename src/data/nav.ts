export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/startright', label: 'StartRight' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/blog', label: 'Blog' }
];

export const NAV_MORE: NavLink[] = [];
