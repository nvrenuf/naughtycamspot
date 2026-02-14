export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/recruiting/', label: 'Recruiting' },
  { href: '/promotion/', label: 'Promotion' },
  { href: '/startright/', label: 'StartRight' },
  { href: '/proof/', label: 'Proof' }
];

export const NAV_MORE: NavLink[] = [
  { href: '/how-it-works/', label: 'How It Works' },
  { href: '/platforms/', label: 'Platforms' },
  { href: '/earnings/', label: 'Earnings' },
  { href: '/vip-kit/', label: 'VIP Kit' },
  { href: '/posts/', label: 'Posts' },
  { href: '/apply/', label: 'Apply' }
];
