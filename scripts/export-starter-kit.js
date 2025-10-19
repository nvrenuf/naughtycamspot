import { mkdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const outputDir = join(projectRoot, 'exports');
const outputPath = join(outputDir, 'startright-kit.pdf');
const targetUrl = process.env.STARTER_KIT_URL ?? 'http://localhost:4321/starter-kit';

const log = (message) => process.stdout.write(`${message}\n`);

try {
  log(`⏳ Launching headless browser for ${targetUrl}`);
  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120_000);

    let loaded = false;
    let attempt = 0;
    let lastError;

    while (!loaded && attempt < 30) {
      attempt += 1;
      try {
        await page.goto(targetUrl, { waitUntil: 'networkidle0' });
        loaded = true;
      } catch (error) {
        lastError = error;
        log(`… Waiting for dev server (attempt ${attempt}/30)`);
        await delay(1_000);
      }
    }

    if (!loaded) {
      throw lastError ?? new Error('Could not reach StartRight kit page');
    }

    await mkdir(outputDir, { recursive: true });
    log(`🖨️  Rendering PDF to ${outputPath}`);
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    log('✅ StartRight kit exported');
  } finally {
    await browser.close();
  }
} catch (error) {
  console.error('Failed to export StartRight kit PDF');
  console.error(error);
  process.exitCode = 1;
}
