import { versionedPath } from './versioning';

export type NavLink = {
  href: string;
  label: string;
  pagesHref?: string;
  prodHref?: string;
};

export const NAV_PRIMARY: NavLink[] = [
  { href: versionedPath('/'), label: 'Home' },
  { href: versionedPath('/earnings'), label: 'Earnings' },
  { href: versionedPath('/blog'), label: 'Blog' }
];

export const NAV_MORE: NavLink[] = [];
