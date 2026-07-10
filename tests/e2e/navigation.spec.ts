import { test, expect } from '@playwright/test';

test('loads overview and navigates to capabilities', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: 'WebProbe', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Capabilities' }).click();
  await expect(page.getByRole('heading', { name: 'Capabilities' })).toBeVisible();
});

test('keyboard navigation reaches main content', async ({ page }) => {
  await page.goto('/#/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
});

test('links page filters work', async ({ page }) => {
  await page.goto('/#/links');
  await expect(page.getByRole('heading', { name: 'Useful Links' })).toBeVisible();
  await page.getByLabel('Search links').fill('MDN');
  await expect(page.getByRole('link', { name: 'MDN Web Docs' })).toBeVisible();
});
