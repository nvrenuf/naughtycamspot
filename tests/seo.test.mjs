import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const rootUrl = new URL('..', import.meta.url);

const readProjectFile = async (relativePath) => {
  const fileUrl = new URL(relativePath, rootUrl);
  const contents = await readFile(fileURLToPath(fileUrl), 'utf8');
  return contents;
};

test('Pages build injects a noindex robots meta tag', async () => {
  const layoutSource = await readProjectFile('src/layouts/MainLayout.astro');
  assert.match(
    layoutSource,
    /<meta name="robots" content="noindex,nofollow" \/>/,
    'Expected Pages-only robots meta tag in MainLayout head'
  );
});

test('Homepage includes WebSite structured data JSON-LD', async () => {
  const homeSource = await readProjectFile('src/pages/index.astro');
  assert.ok(
    homeSource.includes("'@type': 'WebSite'"),
    'Expected WebSite JSON-LD on the homepage'
  );
});

test('Pages workflow copies the robots.txt placeholder', async () => {
  const workflowSource = await readProjectFile('.github/workflows/pages.yml');
  assert.match(
    workflowSource,
    /cp public\/robots\.pages\.txt public\/robots\.txt/,
    'Expected robots copy step in the Pages workflow'
  );
});
