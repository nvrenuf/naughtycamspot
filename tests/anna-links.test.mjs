import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readOutputFile, cleanupBuilds } from './utils/build.js';

const readModelPage = (mode) => readOutputFile(mode, ['models', 'anna-prince', 'index.html']);

const extractHref = (html, platform) => {
  const pattern = new RegExp(`<a[^>]+data-platform="${platform}"[^>]+href="([^"]+)"`, 'i');
  const match = html.match(pattern);
  return match ? match[1] : undefined;
};

const collectPlatformOrder = (html) => {
  const matches = [...html.matchAll(/data-platform="([^"]+)"/g)];
  return matches.map(([, slug]) => slug);
};

test('Pages build routes Anna Prince CTAs to StartRight', async () => {
  const { html } = await readModelPage('pages');

  const expectedHref = '/naughtycamspot/startright';

  for (const platform of ['manyvids', 'beacons', 'stripchat', 'chaturbate', 'camsoda', 'pornhub', 'onlyfans']) {
    const value = extractHref(html, platform);
    assert.ok(value, `expected ${platform} button to exist`);
    assert.equal(value, expectedHref, `expected ${platform} href to point to StartRight`);
    assert.ok(!value.startsWith('/go/'), `${platform} href should not start with /go/ in Pages mode`);
  }

  const order = collectPlatformOrder(html);
  assert.deepEqual(order, ['manyvids', 'beacons', 'stripchat', 'chaturbate', 'camsoda', 'pornhub', 'onlyfans', 'myclub']);
});

test('Production build uses tracked /go/ links for Anna Prince', async () => {
  const { html } = await readModelPage('prod');

  const expectedPaths = {
    manyvids: '/go/mv-anna',
    beacons: '/go/beacons-anna',
    stripchat: '/go/stripchat-anna',
    chaturbate: '/go/chaturbate-anna',
    camsoda: '/go/camsoda-anna',
    pornhub: '/go/ph-anna',
    onlyfans: '/go/of-anna'
  };

  for (const [platform, pathPrefix] of Object.entries(expectedPaths)) {
    const href = extractHref(html, platform);
    assert.ok(href, `expected ${platform} button to exist`);
    assert.ok(href.startsWith(pathPrefix), `${platform} href should start with ${pathPrefix}`);
    assert.ok(href.includes('date='), `${platform} href should include date param`);

    if (platform === 'beacons') {
      assert.ok(href.includes('src=model_page'), 'beacons href should include src=model_page');
      assert.ok(href.includes('camp=anna-prince'), 'beacons href should include camp=anna-prince');
    } else {
      assert.ok(href.includes('src='), `${platform} href should include src param`);
      assert.ok(href.includes('camp=anna_profile'), `${platform} href should include camp param`);
    }
  }
});

test('My.club button renders inactive state', async () => {
  const { html } = await readModelPage('pages');
  const inactiveMatch = html.match(/data-platform="myclub"[^>]*>([^<]+)/i);
  assert.ok(inactiveMatch, 'expected My.club element to exist');
  const text = inactiveMatch[1].trim();
  assert.ok(/Inactive$/i.test(text), 'My.club label should indicate inactive state');
  assert.ok(!extractHref(html, 'myclub'), 'My.club should not render an href when inactive');
});

after(cleanupBuilds);
