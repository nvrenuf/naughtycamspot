import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getRequestLang, normalizeLang, t } from '../src/i18n/core.mjs';

test('i18n normalizes lang and falls back to en', async () => {
  assert.equal(normalizeLang('es'), 'es');
  assert.equal(normalizeLang('pt'), 'pt');
  assert.equal(normalizeLang('ru'), 'ru');
  assert.equal(normalizeLang('ua'), 'ua');
  assert.equal(normalizeLang('unknown'), 'en');
  assert.equal(normalizeLang(null), 'en');
});

test('i18n reads request lang from URL and falls back', async () => {
  assert.equal(getRequestLang(new URL('https://example.com/apply?lang=es')), 'es');
  assert.equal(getRequestLang(new URL('https://example.com/apply')), 'en');
});

test('i18n translation falls back to en and then key', async () => {
  assert.equal(t('es', 'home.hero.cta.signup').length > 0, true);
  assert.equal(t('ru', 'nonexistent.key'), 'nonexistent.key');
});
