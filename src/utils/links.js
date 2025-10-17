const runtimeBaseUrl =
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
    ? import.meta.env.BASE_URL
    : undefined;

const envBaseUrl =
  typeof process !== 'undefined' && process.env
    ? process.env.ASTRO_BASE_URL ?? process.env.BASE_URL
    : undefined;

const BASE_URL = runtimeBaseUrl ?? envBaseUrl ?? '/';
const IS_PAGES_BUILD = BASE_URL !== '/';

const formatDateStamp = () => {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const isPagesBuild = () => IS_PAGES_BUILD;

export const withBase = (path = '') => {
  const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
  if (!cleanedPath) {
    return BASE_URL;
  }

  return `${BASE_URL}${cleanedPath}`;
};

export const buildTrackedLink = ({ path, slot, camp, placeholder }) => {
  if (IS_PAGES_BUILD) {
    return placeholder;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const queryGlue = normalizedPath.includes('?') ? '&' : '?';
  const tracking = `src=${encodeURIComponent(slot)}&camp=${encodeURIComponent(camp)}&date=${formatDateStamp()}`;

  return `${normalizedPath}${queryGlue}${tracking}`;
};

export const __test = { formatDateStamp };
