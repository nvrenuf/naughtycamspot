export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/compare', label: 'Compare' },
  { href: '/startright', label: 'StartRight' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/blog', label: 'Blog' }
];

export const NAV_MORE: NavLink[] = [
  { href: '/contests', label: 'Contests' },
  { href: '/models', label: 'Models' },
  { href: '/starter-kit', label: 'Starter Kit' },
  { href: '/startright', label: 'Join Models', prodHref: '/join-models' },
  { href: '/claim', label: 'Claim' }
];
