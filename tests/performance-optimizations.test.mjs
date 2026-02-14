import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Main layout preloads font stylesheet and defers non-essential beacon setup', async () => {
  const source = await readSource('src/layouts/MainLayout.astro');
  assert.ok(source.includes('rel="preload" as="style"'), 'Expected font preload link');
  assert.ok(source.includes("requestIdleCallback(run)"), 'Expected deferred click beacon setup');
});

test('Hero image uses responsive srcset and high-priority loading', async () => {
  const source = await readSource('src/partials/home/Hero.astro');
  assert.ok(source.includes('srcset='), 'Expected responsive image srcset');
  assert.ok(source.includes('loading="eager"'), 'Expected eager hero image loading for LCP');
  assert.ok(source.includes('fetchpriority="high"'), 'Expected high fetch priority for hero image');
});

test('Performance cache headers exist for static assets', async () => {
  const htaccess = await readSource('public/.htaccess');
  const vercel = await readSource('vercel.json');
  assert.ok(htaccess.includes('Cache-Control "public, max-age=31536000, immutable"'), 'Expected long-lived image cache header');
  assert.ok(vercel.includes('"Cache-Control"'), 'Expected cache headers in Vercel config');
});

test('Tailwind content scanning excludes archive pages', async () => {
  const source = await readSource('tailwind.config.cjs');
  assert.ok(source.includes("'!./src/_archive/**/*'"), 'Expected archive exclusion in Tailwind content list');
});

test('Responsive hero image variants are present', async () => {
  const files = await Promise.all([
    fs.stat(resolveFixturePath('public/images/home-hero-768.jpg')),
    fs.stat(resolveFixturePath('public/images/home-hero-1280.jpg'))
  ]);
  files.forEach((file) => {
    assert.ok(file.size > 0, 'Expected generated responsive image file');
  });
});
