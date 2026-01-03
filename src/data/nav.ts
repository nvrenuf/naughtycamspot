export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/posts', label: 'Posts' }
];

export const NAV_MORE: NavLink[] = [];
