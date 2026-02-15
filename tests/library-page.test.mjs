import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupBuilds, readOutputFile } from './utils/build.js';

const readLibrary = (mode) => readOutputFile(mode, ['library', 'index.html']);
const readHome = (mode) => readOutputFile(mode, ['index.html']);

test('Library page builds in production and includes required sections + CTA', async () => {
  const { html } = await readLibrary('prod');

  assert.ok(html.includes('Paid Library'), 'Library page should render headline copy');
  assert.ok(html.includes('What You Get'), 'Library page should include What You Get section');
  assert.ok(html.includes("Who It's For"), "Library page should include Who It's For section");
  assert.ok(html.includes("What's Included"), "Library page should include What's Included section");
  assert.ok(html.includes('Trust Policy'), 'Library page should include Trust policy block');
  assert.ok(html.includes('Buy Library Access'), 'Library page should include Buy Library Access CTA');
});

test('Footer links include /library/', async () => {
  const { html } = await readHome('prod');
  assert.ok(html.includes('href="/library/"'), 'Footer should link to /library/');
});

after(cleanupBuilds);

