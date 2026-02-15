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
  assert.ok(!source.includes('aria-label="Resources menu"'), 'Resources menu should be removed from header navigation');
  assert.ok(!source.includes('aria-label="Resources links"'), 'Mobile resources group should be removed from header navigation');
});

test('Navigation labels remain title/sentence case', async () => {
  const source = await readSource('src/data/nav.ts');
  ['Home', 'Packages', 'Platforms', 'Resources', 'Proof'].forEach((label) => {
    assert.ok(source.includes(`label: '${label}'`), `Expected nav label ${label}`);
  });
  assert.ok(!source.includes("label: 'Apply'"), 'Expected Apply to be removed from text navigation');
});
