import { versionedPath } from '../data/versioning.js';

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

const CLAIM_FORM_EXTERNAL_URL = 'https://tally.so/r/claim-startright-kit';
const CLAIM_FORM_INTERNAL_PATH = versionedPath('/startright');

const sanitizePlaceholder = (placeholder) => {
  if (!placeholder) {
    return '';
  }

  const trimmed = String(placeholder).trim();
  if (!trimmed) {
    return '';
  }

  const withoutHash = trimmed.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];

  return withoutQuery;
};

export const formatDateStamp = () => {
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

const PAGES_FALLBACK_PATH = versionedPath('/startright');

export const buildTrackedLink = ({ path, slot, camp, placeholder }) => {
  if (IS_PAGES_BUILD) {
    const sanitizedPlaceholder = sanitizePlaceholder(placeholder);

    if (sanitizedPlaceholder && sanitizedPlaceholder.startsWith('/')) {
      return withBase(sanitizedPlaceholder);
    }

    return withBase(PAGES_FALLBACK_PATH);
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const queryGlue = normalizedPath.includes('?') ? '&' : '?';
  const tracking = `src=${encodeURIComponent(slot)}&camp=${encodeURIComponent(camp)}&date=${formatDateStamp()}`;

  return `${normalizedPath}${queryGlue}${tracking}`;
};

export const getClaimUrl = () => (IS_PAGES_BUILD ? CLAIM_FORM_EXTERNAL_URL : CLAIM_FORM_INTERNAL_PATH);
