import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Primary CTA routes to Apply in all environments', async () => {
  const copySource = await readSource('src/data/copy.ts');
  assert.ok(copySource.includes("pagesHref: '/apply'"), 'Pages href should point to /apply');
  assert.ok(copySource.includes("prodHref: '/apply'"), 'Production href should point to /apply');
});

test('Hero partial renders signup help + promotion CTAs', async () => {
  const heroSource = await readSource('src/partials/home/Hero.astro');
  assert.ok(heroSource.includes("home.hero.cta.signup"), 'Hero partial should reference the signup help CTA translation key');
  assert.ok(heroSource.includes('/recruiting/'), 'Hero partial should link to /recruiting/');
  assert.ok(heroSource.includes("home.hero.cta.promo"), 'Hero partial should reference the promotion CTA translation key');
  assert.ok(heroSource.includes('/promotion/'), 'Hero partial should link to /promotion/');
});

test('Hero partial avoids tracked /go/ links', async () => {
  const heroSource = await readSource('src/partials/home/Hero.astro');
  assert.ok(!heroSource.includes('/go/'), 'Hero partial should not contain /go/ links');
});
