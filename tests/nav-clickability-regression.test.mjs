import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

test('Header is stacked above page content so dropdown links can receive clicks', async () => {
  const source = await fs.readFile(resolveFixturePath('src/layouts/MainLayout.astro'), 'utf8');
  const headerMatch = source.match(/<header[^>]*data-site-nav[^>]*>/);
  assert.ok(headerMatch, 'Expected MainLayout header with data-site-nav');
  assert.ok(
    /\bz-\d+\b/.test(headerMatch[0]),
    'Expected header to have an explicit z-index class to avoid content intercepting nav clicks'
  );
});

test('Homepage hero glow is decorative and must not intercept navigation clicks', async () => {
  const source = await fs.readFile(resolveFixturePath('src/partials/home/Hero.astro'), 'utf8');
  assert.ok(
    source.includes('pointer-events-none absolute inset-x-0 top-0 -z-10'),
    'Expected hero background glow wrapper to disable pointer events'
  );
});
