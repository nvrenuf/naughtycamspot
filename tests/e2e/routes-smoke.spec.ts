import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', heading: 'Get started fast with Signup Help (Free) or Promotion (Paid).' },
  { path: '/join-models/', heading: 'Apply for concierge support' },
  { path: '/apply/', heading: 'Get matched to Signup Help (Free) or Promotion (Paid).' },
  { path: '/startright/', heading: 'Start Smart. Cam Confidently.' },
  { path: '/packages/', heading: 'Choose the level of support you want.' },
  { path: '/proof/', heading: 'Examples + templates you can deploy right away.' }
];

for (const route of routes) {
  test(`Route loads: ${route.path}`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText(route.heading);
  });
}
