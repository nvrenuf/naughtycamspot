import type { APIRoute } from 'astro';

const FORWARD_KEYS = ['src', 'camp', 'date'] as const;

const buildTarget = (url: URL) => {
  const params = new URLSearchParams();

  for (const key of FORWARD_KEYS) {
    const value = url.searchParams.get(key);
    if (typeof value === 'string' && value.trim().length > 0) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/startright?${query}` : '/startright';
};

export const GET: APIRoute = ({ url, redirect }) => {
  const target = buildTarget(url);
  return redirect(target, 301);
};

export const prerender = true;
