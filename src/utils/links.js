const runtimeBaseUrl =
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
    ? import.meta.env.BASE_URL
    : undefined;

const envBaseUrl =
  typeof process !== 'undefined' && process.env
    ? process.env.ASTRO_BASE_URL ?? process.env.BASE_URL
    : undefined;

const BASE_URL = runtimeBaseUrl ?? envBaseUrl ?? '/';

export const withBase = (path = '') => {
  const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
  if (!cleanedPath) {
    return BASE_URL;
  }

  return `${BASE_URL}${cleanedPath}`;
};
