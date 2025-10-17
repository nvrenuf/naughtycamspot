const BASE_URL = import.meta.env.BASE_URL || '/';
const IS_PAGES_BUILD = BASE_URL !== '/';

const formatDateStamp = () => {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const isPagesBuild = () => IS_PAGES_BUILD;

export const withBase = (path = ''): string => {
  const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
  if (!cleanedPath) {
    return BASE_URL;
  }

  return `${BASE_URL}${cleanedPath}`;
};

export const buildTrackedLink = ({
  path,
  slot,
  camp,
  placeholder
}: {
  path: string;
  slot: string;
  camp: string;
  placeholder: string;
}): string => {
  if (IS_PAGES_BUILD) {
    return placeholder;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const queryGlue = normalizedPath.includes('?') ? '&' : '?';
  const tracking = `src=${encodeURIComponent(slot)}&camp=${encodeURIComponent(camp)}&date=${formatDateStamp()}`;

  return `${normalizedPath}${queryGlue}${tracking}`;
};
