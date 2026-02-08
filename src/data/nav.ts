export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/apply/', label: 'Start Here' },
  { href: '/startright/', label: 'StartRight' },
  { href: '/packages/', label: 'Packages' },
  { href: '/proof/', label: 'Proof' }
];

export const NAV_MORE: NavLink[] = [
  { href: '/vip-kit/', label: 'VIP Kit' },
  { href: '/platforms/', label: 'Platforms' },
  { href: '/earnings/', label: 'Earnings' },
  { href: '/posts/', label: 'Posts' },
  { href: '/disclosure/', label: 'Disclosure' },
  { href: '/terms/', label: 'Terms' },
  { href: '/privacy/', label: 'Privacy' }
];
