import { afterAll, describe, expect, it } from 'vitest';
import { cleanupBuilds, readOutputFile } from './utils/build.js';

const BUILD_TIMEOUT = 20000;
const readHome = (mode: 'pages' | 'prod') => readOutputFile(mode, ['index.html']);
const readPostsIndex = (mode: 'pages' | 'prod') => readOutputFile(mode, ['posts', 'index.html']);
const readBlogIndex = (mode: 'pages' | 'prod') => readOutputFile(mode, ['blog', 'index.html']);

describe('Homepage routing', () => {
  it('builds the homepage at the root without v2 prefixes', async () => {
    const { html } = await readHome('prod');
    expect(html).toContain('NaughtyCamSpot | Platform signup help + Promotion for Cam Models');
    expect(html).not.toContain('/v2/');
  }, BUILD_TIMEOUT);

  it('exposes the posts index at /posts in the production build', async () => {
    const { html } = await readPostsIndex('prod');
    expect(html).toContain('Insights &amp; Stories');
    expect(html).toMatch(/href=\"\/posts\/[a-z0-9-]+\"/i);
  });

  it('prefixes base paths for posts in the Pages build', async () => {
    const { html } = await readPostsIndex('pages');
    expect(html).toMatch(/\/(?:naughtycamspot\/)?posts\/[a-z0-9-]+/i);
    expect(html).not.toContain('/v2/');
  }, BUILD_TIMEOUT);

  it('exposes the blog index at /blog with at least one post link', async () => {
    const { html } = await readBlogIndex('prod');
    expect(html).toContain('Signup help and promotion field notes.');
    expect(html).toMatch(/href=\"\/posts\/[a-z0-9-]+\"/i);
  }, BUILD_TIMEOUT);
});

afterAll(async () => {
  await cleanupBuilds();
});
