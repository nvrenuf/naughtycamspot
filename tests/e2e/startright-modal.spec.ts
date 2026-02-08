import { test, expect } from '@playwright/test';

test('StartRight preclick modal opens and skip launches outbound', async ({ page }) => {
  await page.goto('/startright/', { waitUntil: 'domcontentloaded' });

  const trigger = page.locator('[data-preclick=\"1\"]').first();
  await expect(trigger).toBeVisible();

  const modal = page.locator('#preclick-capture-modal');
  await trigger.click();
  await expect(modal).toBeVisible();

  const goLinksAttr = await page.locator('[data-preclick-go-links]').getAttribute('data-preclick-go-links');
  expect(goLinksAttr || '').toContain('/go/');

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Skip' }).click()
  ]);

  await popup.waitForLoadState('domcontentloaded');
  expect(popup.url()).toContain('http');
  await popup.close();
});
