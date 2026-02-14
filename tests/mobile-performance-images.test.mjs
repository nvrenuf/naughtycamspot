import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Posts index cards include width/height to reduce CLS', async () => {
  const source = await readSource('src/pages/posts/index.astro');
  assert.ok(source.includes('width="1280"'), 'Expected posts index images to declare width');
  assert.ok(source.includes('height="720"'), 'Expected posts index images to declare height');
  assert.ok(source.includes('decoding="async"'), 'Expected posts index images to decode async');
});

test('Post detail hero image is eager and has width/height', async () => {
  const source = await readSource('src/pages/posts/[slug].astro');
  assert.ok(source.includes('loading="eager"'), 'Expected post hero image to be eager for LCP');
  assert.ok(source.includes('fetchpriority="high"'), 'Expected post hero image to set fetch priority');
  assert.ok(source.includes('width="1600"'), 'Expected post hero image to declare width');
  assert.ok(source.includes('height="900"'), 'Expected post hero image to declare height');
});

test('Models index images include width/height', async () => {
  const source = await readSource('src/pages/models/index.astro');
  assert.ok(source.includes('width="1280"'), 'Expected model cards to declare width');
  assert.ok(source.includes('height="720"'), 'Expected model cards to declare height');
});

