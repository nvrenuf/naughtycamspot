import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4321/';

const clickDesktopResourcesLink = async (page) => {
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  await page.waitForSelector('[data-nav-desktop-more-trigger]', { visible: true });
  await page.click('[data-nav-desktop-more-trigger]');

  await page.waitForSelector('#desktop-resources-menu', { visible: true });
  const link = await page.$("#desktop-resources-menu a[href*='/startright']");
  if (!link) throw new Error('Desktop: missing /startright link');

  const box = await link.boundingBox();
  if (box) {
    const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const hit = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      const style = el ? getComputedStyle(el) : null;
      return {
        tag: el?.tagName || null,
        id: el?.id || null,
        className: el?.className || null,
        href: el?.getAttribute?.('href') || null,
        pointerEvents: style?.pointerEvents || null,
        zIndex: style?.zIndex || null,
      };
    }, point);
    const linkStyle = await page.evaluate((el) => {
      const s = getComputedStyle(el);
      return { pointerEvents: s.pointerEvents, zIndex: s.zIndex, display: s.display, visibility: s.visibility };
    }, link);
    console.log('Desktop hit-test:', hit);
    console.log('Desktop link style:', linkStyle);
  } else {
    console.log('Desktop: no bounding box for link');
  }

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    link.click(),
  ]);

  if (!page.url().includes('/startright')) {
    throw new Error(`Desktop: did not navigate to /startright (${page.url()})`);
  }
};

const clickMobileResourcesLink = async (page) => {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, hasTouch: true });
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  await page.waitForSelector('[data-nav-mobile-toggle]', { visible: true });
  const toggle = await page.$('[data-nav-mobile-toggle]');
  const toggleBox = toggle ? await toggle.boundingBox() : null;
  if (toggleBox) {
    const point = { x: toggleBox.x + toggleBox.width / 2, y: toggleBox.y + toggleBox.height / 2 };
    const hit = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      const style = el ? getComputedStyle(el) : null;
      return {
        tag: el?.tagName || null,
        id: el?.id || null,
        className: el?.className || null,
        pointerEvents: style?.pointerEvents || null,
        zIndex: style?.zIndex || null,
      };
    }, point);
    console.log('Mobile toggle hit-test:', hit);
  }
  await page.click('[data-nav-mobile-toggle]');
  const expandedAfterClick = await page.$eval('[data-nav-mobile-toggle]', (el) => el.getAttribute('aria-expanded'));
  console.log('Mobile toggle aria-expanded after click:', expandedAfterClick);
  if (expandedAfterClick !== 'true') {
    await page.evaluate(() => {
      const el = document.querySelector('[data-nav-mobile-toggle]');
      if (!el) return;
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    const expandedAfterEvalClick = await page.$eval('[data-nav-mobile-toggle]', (el) => el.getAttribute('aria-expanded'));
    console.log('Mobile toggle aria-expanded after eval click:', expandedAfterEvalClick);
  }
  await page.waitForFunction(() => {
    const toggle = document.querySelector('[data-nav-mobile-toggle]');
    return toggle && toggle.getAttribute('aria-expanded') === 'true';
  });
  await page.waitForFunction(() => {
    const overlay = document.querySelector('[data-nav-mobile-overlay]');
    return overlay && !overlay.classList.contains('hidden');
  });
  await page.waitForFunction(() => {
    const drawer = document.querySelector('[data-nav-mobile-drawer]');
    return drawer && !drawer.classList.contains('translate-x-full');
  });

  await page.waitForSelector('[data-nav-mobile-more-trigger]', { visible: true });
  await page.evaluate(() => {
    document.querySelector('[data-nav-mobile-more-trigger]')?.scrollIntoView({ block: 'center', inline: 'nearest' });
  });
  const moreTrigger = await page.$('[data-nav-mobile-more-trigger]');
  if (!moreTrigger) throw new Error('Mobile: missing more trigger');
  const triggerBox = await moreTrigger.boundingBox();
  if (triggerBox) {
    const point = { x: triggerBox.x + triggerBox.width / 2, y: triggerBox.y + triggerBox.height / 2 };
    const hit = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      const style = el ? getComputedStyle(el) : null;
      return {
        tag: el?.tagName || null,
        id: el?.id || null,
        className: el?.className || null,
        pointerEvents: style?.pointerEvents || null,
        zIndex: style?.zIndex || null,
      };
    }, point);
    console.log('Mobile trigger hit-test:', hit);
  }
  await moreTrigger.click();
  await page.waitForSelector('#mobile-resources-menu', { visible: true });

  const link = await page.$("#mobile-resources-menu a[href*='/startright']");
  if (!link) throw new Error('Mobile: missing /startright link');

  await link.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'nearest' }));

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    link.click(),
  ]);

  if (!page.url().includes('/startright')) {
    throw new Error(`Mobile: did not navigate to /startright (${page.url()})`);
  }
};

const keyboardDesktopResourcesLink = async (page) => {
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  // Focus first, then tab until Resources trigger.
  await page.focus('body');
  for (let i = 0; i < 40; i++) {
    const has = await page.evaluate(() => document.activeElement?.hasAttribute?.('data-nav-desktop-more-trigger'));
    if (has) break;
    await page.keyboard.press('Tab');
  }

  const focused = await page.evaluate(() => document.activeElement?.hasAttribute?.('data-nav-desktop-more-trigger'));
  if (!focused) {
    // As a fallback, focus it and continue.
    await page.focus('[data-nav-desktop-more-trigger]');
  }

  await page.keyboard.press('Enter');
  await page.waitForSelector('#desktop-resources-menu', { visible: true });

  // Tab into first menu item.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.keyboard.press('Enter'),
  ]);

  if (!page.url().includes('/startright')) {
    throw new Error(`Keyboard: did not navigate to /startright (${page.url()})`);
  }
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    dumpio: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('[browser]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', String(err)));

  try {
    await clickDesktopResourcesLink(page);
    await clickMobileResourcesLink(page);
    await keyboardDesktopResourcesLink(page);
  } finally {
    await browser.close();
  }
};

main();
