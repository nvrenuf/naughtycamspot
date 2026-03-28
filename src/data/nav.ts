export type NavLink = {
  href: string;
  label: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/growth/', label: 'Growth' },
  { href: '/how-it-works/', label: 'How It Works' },
  { href: '/proof/', label: 'Proof' },
  { href: '/apply/', label: 'Apply' }
];

export const NAV_MORE: NavLink[] = [];
