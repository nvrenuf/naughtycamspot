import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('/blog index includes categories and tags', async () => {
  const source = await readSource('src/pages/blog.astro');
  assert.ok(source.includes('Categories'), 'Blog index should include category summary');
  assert.ok(source.includes('Tags'), 'Blog index should include topic tags');
});

test('Homepage includes recent blog posts section', async () => {
  const source = await readSource('src/pages/index.astro');
  assert.ok(source.includes('import RecentPosts'), 'Homepage should import recent posts partial');
  assert.ok(source.includes('<RecentPosts />'), 'Homepage should render recent posts section');
});

test('Signup help and promotion pages link to relevant posts', async () => {
  const recruitingSource = await readSource('src/pages/recruiting.astro');
  const promotionSource = await readSource('src/pages/promotion.astro');
  assert.ok(recruitingSource.includes('/posts/camsoda-vs-chaturbate-for-beginners'), 'Signup help should link to relevant posts');
  assert.ok(promotionSource.includes('/posts/earnings-levers-that-matter'), 'Promotion should link to relevant posts');
  assert.ok(recruitingSource.includes('/blog/'), 'Signup help should link to blog index');
  assert.ok(promotionSource.includes('/blog/'), 'Promotion should link to blog index');
});

test('/proof page includes promo templates and trust language', async () => {
  const source = await readSource('src/pages/proof.astro');
  assert.ok(source.includes('Sample Promo Packet'), 'Proof page should include promo packet examples');
  assert.ok(source.includes('Sample Weekly Report'), 'Proof page should include weekly report layout');
  assert.ok(source.includes('No earnings guarantees'), 'Proof page should include no-guarantee language');
});
