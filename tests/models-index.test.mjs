import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readOutputFile, cleanupBuilds } from './utils/build.js';

const readIndex = (mode) => readOutputFile(mode, ['models', 'index.html']);

const extractHref = (html, slug) => {
  const pattern = new RegExp(`<a[^>]+data-model="${slug}"[^>]+href="([^"]+)"`, 'i');
  const match = html.match(pattern);
  return match ? match[1] : undefined;
};

test('Models index lists featured and library entries', async () => {
  const { html } = await readIndex('pages');

  assert.ok(html.includes('Example model walkthroughs'), 'should render hero copy');
  assert.ok(html.includes('Anna Prince'), 'should include featured model');
  assert.ok(html.includes('Ivy Hart'), 'should include supporting model');
  assert.ok(
    html.includes('Consent pending listing'),
    'should highlight consent pending status for supporting models'
  );
});

test('Models index respects deployment base for anchors', async () => {
  const { html: pagesHtml } = await readIndex('pages');
  assert.equal(
    extractHref(pagesHtml, 'anna-prince'),
    '/naughtycamspot/models/anna-prince',
    'Pages build should prefix base path for Anna'
  );
  assert.equal(
    extractHref(pagesHtml, 'ivy-hart'),
    '/naughtycamspot/models/ivy-hart',
    'Pages build should prefix base path for Ivy'
  );

  const { html: prodHtml } = await readIndex('prod');
  assert.equal(
    extractHref(prodHtml, 'anna-prince'),
    '/models/anna-prince',
    'Prod build should use root-relative path for Anna'
  );
  assert.equal(
    extractHref(prodHtml, 'ivy-hart'),
    '/models/ivy-hart',
    'Prod build should use root-relative path for Ivy'
  );
});

after(cleanupBuilds);
