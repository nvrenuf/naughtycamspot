import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

const outDirName = 'dist-test-seo';
const projectRoot = path.resolve(process.cwd());
const outDir = path.join(projectRoot, outDirName);

const corePages = [
  { label: 'home', file: ['index.html'] },
  { label: 'recruiting', file: ['recruiting', 'index.html'] },
  { label: 'packages', file: ['packages', 'index.html'] },
  { label: 'apply', file: ['apply', 'index.html'] },
  { label: 'platforms', file: ['platforms', 'index.html'] },
  { label: 'blog', file: ['blog', 'index.html'] }
];

const readOut = async (segments) => fs.readFile(path.join(outDir, ...segments), 'utf8');

test('SEO: production build ships title + meta description + OG/Twitter tags on core pages', async () => {
  await fs.rm(outDir, { recursive: true, force: true });
  execSync(`npx astro build --outDir ${outDirName}`, { cwd: projectRoot, stdio: 'pipe' });

  for (const page of corePages) {
    const html = await readOut(page.file);
    assert.match(html, /<title>[^<]+<\/title>/i, `${page.label} should include <title>`);
    assert.match(
      html,
      /<meta[^>]+name="description"[^>]+content="[^"]+"/i,
      `${page.label} should include meta description`
    );
  }

  const home = await readOut(['index.html']);
  ['property="og:title"', 'property="og:description"', 'property="og:image"'].forEach((needle) => {
    assert.ok(home.includes(needle), `Homepage should include ${needle}`);
  });
  ['name="twitter:card"', 'name="twitter:title"', 'name="twitter:description"', 'name="twitter:image"'].forEach(
    (needle) => {
      assert.ok(home.includes(needle), `Homepage should include ${needle}`);
    }
  );
});

test('SEO: production build outputs sitemap and robots', async () => {
  // Build dir is produced by the previous test in this file.
  const robots = await readOut(['robots.txt']);
  assert.ok(robots.includes('User-agent:'), 'robots.txt should contain directives');
  const sitemapIndex = await readOut(['sitemap-index.xml']);
  assert.ok(sitemapIndex.includes('sitemap'), 'sitemap-index.xml should exist and contain sitemap entries');
});

test('SEO: cleanup build artifacts', async () => {
  await fs.rm(outDir, { recursive: true, force: true });
});

