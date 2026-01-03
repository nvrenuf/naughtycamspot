export const VERSION_PREFIX = '/v2';

export const versionedPath = (path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/' || normalized.length === 0) {
    return VERSION_PREFIX;
  }
  return `${VERSION_PREFIX}${normalized}`;
};
