import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { cleanupBuilds, readOutputFile } from './utils/build.js';

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const seoPages = [
  {
    route: '/seo/onlyfans-setup-checklist/',
    file: path.join(projectRoot, 'src', 'pages', 'seo', 'onlyfans-setup-checklist.astro')
  },
  {
    route: '/seo/manyvids-store-setup-checklist/',
    file: path.join(projectRoot, 'src', 'pages', 'seo', 'manyvids-store-setup-checklist.astro')
  },
  {
    route: '/seo/cam-model-first-week-checklist/',
    file: path.join(projectRoot, 'src', 'pages', 'seo', 'cam-model-first-week-checklist.astro')
  },
  {
    route: '/seo/payouts-and-payment-basics/',
    file: path.join(projectRoot, 'src', 'pages', 'seo', 'payouts-and-payment-basics.astro')
  },
  {
    route: '/seo/online-safety-privacy-basics/',
    file: path.join(projectRoot, 'src', 'pages', 'seo', 'online-safety-privacy-basics.astro')
  },
  {
    route: '/seo/promotion-basics-for-beginners/',
    file: path.join(projectRoot, 'src', 'pages', 'seo', 'promotion-basics-for-beginners.astro')
  }
];

const countApproxWords = (source) => {
  // Remove frontmatter + tags; approximate human-readable word count.
  const stripped = source
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const matches = stripped.match(/[A-Za-z0-9']+/g) || [];
  return matches.length;
};

test('SEO landing pages exist and have substantial content (approx 400-900 words)', async () => {
  for (const page of seoPages) {
    const source = await fs.readFile(page.file, 'utf8');
    const words = countApproxWords(source);
    assert.ok(words >= 400, `${page.file} should have at least 400 words (got ${words})`);
    assert.ok(words <= 900, `${page.file} should have at most 900 words (got ${words})`);
  }
});

test('SEO landing pages appear in sitemap', async () => {
  const { html: sitemapIndex } = await readOutputFile('prod', ['sitemap-index.xml']);
  const sitemapFiles = Array.from(new Set((sitemapIndex.match(/sitemap-\d+\.xml/g) || [])));
  assert.ok(sitemapFiles.length > 0, 'Expected sitemap-*.xml entries in sitemap-index.xml');

  const xmlParts = [];
  for (const fileName of sitemapFiles) {
    const { html } = await readOutputFile('prod', [fileName]);
    xmlParts.push(html);
  }
  const combined = xmlParts.join('\n');

  for (const page of seoPages) {
    assert.ok(combined.includes(page.route), `Expected sitemap to include route: ${page.route}`);
  }
});

after(cleanupBuilds);
