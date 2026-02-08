import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('StartRight contains /go/ platform links for production routing', async () => {
  const source = await readSource('src/pages/startright.astro');
  ['/go/bonga', '/go/camsoda', '/go/chaturbate'].forEach((href) => {
    assert.ok(source.includes(href), `Expected StartRight to include ${href}`);
  });
});
