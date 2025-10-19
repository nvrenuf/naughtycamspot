import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const buildCache = new Map();
const cleanupDirs = new Set();

const buildJoinModelsPage = async (mode) => {
  if (buildCache.has(mode)) {
    return buildCache.get(mode);
  }

  const outDirName = mode === 'pages' ? 'dist-test-join-pages' : 'dist-test-join-prod';
  const outDir = path.join(projectRoot, outDirName);
  await rm(outDir, { recursive: true, force: true });

  const command =
    mode === 'pages'
      ? `npx astro build --config astro.config.pages.mjs --outDir ${outDirName}`
      : `npx astro build --outDir ${outDirName}`;

  execSync(command, { cwd: projectRoot, stdio: 'pipe' });

  cleanupDirs.add(outDir);

  const htmlPath = path.join(outDir, 'join-models', 'index.html');
  const html = await readFile(htmlPath, 'utf8');

  const result = { html, outDir };
  buildCache.set(mode, result);
  return result;
};

const extractCtaHref = (html) => {
  const match = html.match(/<a[^>]+data-cta="join-models"[^>]*href="([^"]+)"/i);
  return match ? match[1] : undefined;
};

test('Pages build routes Join Models CTA to StartRight', async () => {
  const { html } = await buildJoinModelsPage('pages');
  const href = extractCtaHref(html);

  assert.ok(href, 'CTA href should be present');
  assert.ok(!href.startsWith('/go/'), 'Pages CTA must not start with /go/');
  assert.equal(href, '/naughtycamspot/startright', 'Pages CTA should point to StartRight');
});

test('Production build uses tracked /go/ link for Join Models CTA', async () => {
  const { html } = await buildJoinModelsPage('prod');
  const href = extractCtaHref(html);

  assert.ok(href, 'CTA href should be present');
  assert.ok(href.startsWith('/go/model-join.php'), 'Prod CTA should use /go/model-join.php');
  assert.ok(href.includes('src=join_models'), 'Prod CTA should include src=join_models');
  assert.ok(href.includes('camp=landing'), 'Prod CTA should include camp=landing');
  assert.ok(href.includes('date='), 'Prod CTA should include date stamp');
});

after(async () => {
  for (const dir of cleanupDirs) {
    await rm(dir, { recursive: true, force: true });
  }
});
