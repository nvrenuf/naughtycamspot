import assert from 'node:assert/strict';
import { test } from 'node:test';

const placeholder = 'https://linktr.ee/naughtycamspot';
const importLinksWithBase = async (baseUrl) => {
  const previousBase = process.env.ASTRO_BASE_URL;
  process.env.ASTRO_BASE_URL = baseUrl;
  const module = await import(`../src/utils/links.js?base=${baseUrl}`);
  process.env.ASTRO_BASE_URL = previousBase;
  return module;
};

test('Pages build routes CTA to StartRight', async () => {
  const { buildTrackedLink } = await importLinksWithBase('/docs/');
  const href = buildTrackedLink({
    path: '/go/model-join.php',
    slot: 'home_hero',
    camp: 'home',
    placeholder
  });

  const anchorSnapshot = `<a href="${href}"></a>`;
  assert.equal(anchorSnapshot, '<a href="/docs/startright"></a>');
});

test('Production build outputs tracked /go link', async () => {
  const { buildTrackedLink, __test } = await importLinksWithBase('/');
  const href = buildTrackedLink({
    path: '/go/model-join.php',
    slot: 'home_hero',
    camp: 'home',
    placeholder
  });

  const dateStamp = __test.formatDateStamp();
  assert.equal(dateStamp.length, 8);
  assert.equal(/^\d{8}$/.test(dateStamp), true);

  const anchorSnapshot = `<a href="${href}"></a>`;
  assert.equal(
    anchorSnapshot,
    `<a href="/go/model-join.php?src=home_hero&camp=home&date=${dateStamp}"></a>`
  );
});

test('sanitizePlaceholder removes query and hash fragments', async () => {
  const { __test } = await importLinksWithBase('/docs/');
  const cleaned = __test.sanitizePlaceholder('https://example.com/join?foo=bar#cta');
  assert.equal(cleaned, 'https://example.com/join');
});
