import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupBuilds, readOutputFile } from './utils/build.js';

const readResources = (mode) => readOutputFile(mode, ['resources', 'index.html']);
const readHome = (mode) => readOutputFile(mode, ['index.html']);

test('Resources hub builds in production and links to key pages', async () => {
  const { html } = await readResources('prod');
  assert.ok(html.includes('Resources'), 'Resources hub should render title');
  ['href="/blog/"', 'href="/platforms/"', 'href="/packages/"', 'href="/trust-safety/"', 'href="/how-it-works/"'].forEach(
    (needle) => assert.ok(html.includes(needle), `Resources hub should include link: ${needle}`)
  );
  assert.ok(html.includes('href="/seo/onlyfans-setup-checklist/"'), 'Resources hub should link to SEO checklists');
});

test('Footer links include /resources/ and /blog/', async () => {
  const { html } = await readHome('prod');
  assert.ok(html.includes('href="/resources/"'), 'Footer should link to /resources/');
  assert.ok(html.includes('href="/blog/"'), 'Footer should link to /blog/');
});

after(cleanupBuilds);

