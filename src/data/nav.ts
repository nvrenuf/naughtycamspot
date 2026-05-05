export type NavLink = {
  href: string;
  label: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: '/apply/', label: 'Apply' },
  { href: '/name-check/', label: 'Name Check' },
  { href: '/launch-kit/', label: 'Launch Kit' },
  { href: '/platforms/', label: 'Platforms' },
  { href: '/how-it-works/', label: 'Trust' },
];

export const NAV_MORE: NavLink[] = [];
