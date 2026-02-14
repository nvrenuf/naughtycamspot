import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Base styles define larger typography and global focus-visible states', async () => {
  const source = await readSource('src/styles/tailwind.css');
  assert.ok(source.includes('font-size: 17px;'), 'Expected larger base font size');
  assert.ok(source.includes('a:focus-visible'), 'Expected global keyboard focus style');
  assert.ok(source.includes('outline: 2px solid'), 'Expected visible focus outline');
});

test('Navigation semantics include explicit labels and resources controls', async () => {
  const source = await readSource('src/layouts/MainLayout.astro');
  assert.ok(source.includes('aria-label="Primary Navigation"'), 'Expected descriptive primary nav label');
  assert.ok(source.includes('aria-label="Resources menu"'), 'Expected resources menu aria label');
  assert.ok(source.includes('aria-label="Resources links"'), 'Expected mobile resources group label');
});

test('Navigation labels remain title/sentence case', async () => {
  const source = await readSource('src/data/nav.ts');
  ['Home', 'Recruiting', 'Promotion', 'StartRight', 'Proof'].forEach((label) => {
    assert.ok(source.includes(`label: '${label}'`), `Expected nav label ${label}`);
  });
});
