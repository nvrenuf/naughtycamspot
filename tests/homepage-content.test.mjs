import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Homepage includes explicit free vs paid decision section', async () => {
  const source = await readSource('src/partials/home/WhyCam.astro');
  assert.ok(source.includes('Signup Help (Free)'), 'Expected free track label');
  assert.ok(source.includes('Promotion (Paid)'), 'Expected paid track label');
  assert.ok(source.includes('/platforms/'), 'Expected free CTA route');
  assert.ok(source.includes('/packages/'), 'Expected paid CTA route');
});

test('Homepage includes trust metrics and testimonials', async () => {
  const source = await readSource('src/partials/home/MiniTestimonials.astro');
  assert.ok(source.includes('Trust signals'), 'Expected trust signals section');
  assert.ok(source.includes('Anna, new model'), 'Expected testimonial content');
  assert.ok(source.includes('Maya, growth client'), 'Expected testimonial content');
});

test('Homepage route composes trust section', async () => {
  const source = await readSource('src/pages/index.astro');
  assert.ok(source.includes('import MiniTestimonials'), 'Homepage should import trust/testimonial partial');
  assert.ok(source.includes('<MiniTestimonials />'), 'Homepage should render trust/testimonial partial');
  assert.ok(source.includes('import LeadMagnet'), 'Homepage should import lead magnet partial');
  assert.ok(source.includes('<LeadMagnet />'), 'Homepage should render lead magnet partial');
});
