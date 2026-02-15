import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4321/';
const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const isHidden = async (page, selector) => {
  return page.$eval(selector, (el) => {
    const style = getComputedStyle(el);
    return el.classList.contains('hidden') || style.display === 'none' || style.visibility === 'hidden';
  });
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  page.on('console', (msg) => console.log('[browser]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', String(err)));
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  await page.waitForSelector('[data-nav-desktop-more-trigger]', { visible: true });
  const exists = await page.evaluate(() => ({
    navRoot: !!document.querySelector('[data-site-nav]'),
    trigger: !!document.querySelector('[data-nav-desktop-more-trigger]'),
    panel: !!document.querySelector('[data-nav-desktop-more-panel]'),
    panelById: !!document.getElementById('desktop-resources-menu'),
  }));
  console.log('exists:', exists);
  // Try a real user click, then a programmatic click, to see whether handlers are attached.
  await page.click('[data-nav-desktop-more-trigger]');
  const afterUserClick = await page.evaluate(() => ({
    expanded: document.querySelector('[data-nav-desktop-more-trigger]')?.getAttribute('aria-expanded'),
    menuHidden: document.getElementById('desktop-resources-menu')?.classList.contains('hidden'),
  }));
  console.log('after user click:', afterUserClick);
  if (afterUserClick.menuHidden) {
    const afterProgrammatic = await page.evaluate(() => {
      const btn = document.querySelector('[data-nav-desktop-more-trigger]');
      btn?.click();
      return {
        expanded: btn?.getAttribute('aria-expanded'),
        menuHidden: document.getElementById('desktop-resources-menu')?.classList.contains('hidden'),
      };
    });
    console.log('after programmatic click:', afterProgrammatic);
  }
  const expanded = await page.$eval('[data-nav-desktop-more-trigger]', (el) => el.getAttribute('aria-expanded'));
  const menuClass = await page.$eval('#desktop-resources-menu', (el) => el.className);
  console.log('aria-expanded after click:', expanded);
  console.log('menu class after click:', menuClass);
  assert(!(await isHidden(page, '#desktop-resources-menu')), 'Menu should be visible after trigger click');

  // Outside click closes.
  await page.mouse.click(20, 20);
  assert(await isHidden(page, '#desktop-resources-menu'), 'Menu should close after outside click');

  // Escape closes.
  await page.click('[data-nav-desktop-more-trigger]');
  assert(!(await isHidden(page, '#desktop-resources-menu')), 'Menu should be visible after trigger click (2)');
  await page.keyboard.press('Escape');
  assert(await isHidden(page, '#desktop-resources-menu'), 'Menu should close on Escape');

  // Link navigates.
  await page.click('[data-nav-desktop-more-trigger]');
  const link = await page.$("#desktop-resources-menu a[href*='/startright/']");
  assert(link, 'Expected /startright link in menu');
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), link.click()]);
  assert(page.url().includes('/startright'), `Expected navigation to /startright, got ${page.url()}`);

  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
