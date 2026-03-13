import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Platform source data aligns with required signup /go endpoints', async () => {
  const platformsSource = await readSource('src/data/platforms.ts');
  assert.ok(platformsSource.includes("slug: 'chaturbate'"), 'Platforms data should include chaturbate');
  assert.ok(platformsSource.includes("goPath: '/go/chaturbate'"), 'Platforms data should use /go/chaturbate');
  assert.ok(platformsSource.includes("slug: 'camsoda'"), 'Platforms data should include camsoda');
  assert.ok(platformsSource.includes("goPath: '/go/camsoda'"), 'Platforms data should use /go/camsoda');
  assert.ok(platformsSource.includes("slug: 'bongacams'"), 'Platforms data should include bongacams');
  assert.ok(platformsSource.includes("goPath: '/go/bongacams'"), 'Platforms data should use /go/bongacams');
});

test('Signup /go endpoint files use affiliate redirect helpers instead of placeholders', async () => {
  const endpoints = [
    ['public/go/chaturbate.php', "'chaturbate'"],
    ['public/go/camsoda.php', "'camsoda'"],
    ['public/go/bongacams.php', "'bonga'"]
  ];

  for (const [file, programKey] of endpoints) {
    const source = await readSource(file);
    assert.ok(source.includes("require_once __DIR__ . '/affiliates.php';"), `${file} should load affiliate helpers`);
    assert.ok(source.includes(`go_build_model_program_url(${programKey}`), `${file} should build affiliate redirect with ${programKey}`);
    assert.ok(!source.includes('https://example.com/'), `${file} should not use placeholder destinations`);
  }
});
