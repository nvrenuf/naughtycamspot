import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupBuilds, readOutputFile } from './utils/build.js';

const readHome = (mode) => readOutputFile(mode, ['index.html']);
const readApply = (mode) => readOutputFile(mode, ['apply', 'index.html']);

const extractModalOpenTag = (html) => {
  const match = html.match(/<div[^>]+id="preclick-capture-modal"[^>]*>/i);
  return match ? match[0] : '';
};

test('Preclick modal is hidden by default on initial render (home + apply)', async () => {
  const [{ html: homeHtml }, { html: applyHtml }] = await Promise.all([readHome('prod'), readApply('prod')]);

  const homeTag = extractModalOpenTag(homeHtml);
  assert.ok(homeTag, 'Home should include the preclick modal container');
  assert.ok(/\bhidden\b/.test(homeTag), 'Home preclick modal should be hidden by default');

  const applyTag = extractModalOpenTag(applyHtml);
  assert.ok(applyTag, 'Apply should include the preclick modal container');
  assert.ok(/\bhidden\b/.test(applyTag), 'Apply preclick modal should be hidden by default');
});

after(cleanupBuilds);

