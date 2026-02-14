import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

const phaseOneFiles = [
  'src/content/blog/getting-started-cam-model-checklist.md',
  'src/content/blog/marketing-yourself-on-multiple-platforms.md',
  'src/content/blog/understanding-affiliate-programmes-benefits.md',
  'src/content/blog/equipment-essentials-on-a-budget.md',
  'src/content/blog/privacy-safety-and-wellbeing-online.md'
];

test('Five phase-1 blog posts exist with required frontmatter fields', async () => {
  for (const file of phaseOneFiles) {
    const source = await readSource(file);
    ['title:', 'description:', 'excerpt:', 'publishDate:', 'tags:', 'slug:', 'heroImageAlt:'].forEach((field) => {
      assert.ok(source.includes(field), `${file} should include ${field}`);
    });
  }
});

test('Phase-1 posts cross-link to relevant pages', async () => {
  for (const file of phaseOneFiles) {
    const source = await readSource(file);
    assert.ok(source.includes('](/'), `${file} should include internal page links`);
  }
});

test('Homepage recent posts section prioritizes phase-1 excerpts', async () => {
  const source = await readSource('src/partials/home/RecentPosts.astro');
  assert.ok(source.includes('phaseOneSlugs'), 'Recent posts should prioritize phase-1 slugs');
  assert.ok(source.includes('.slice(0, 5)'), 'Recent posts should feature five excerpts');
});
