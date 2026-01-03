export const versionedPath = (path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized || '/';
};
