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
  await expect(page).toHaveURL(/q=MDN/);
});

test('links page restores filters from URL', async ({ page }) => {
  await page.goto('/#/links?q=playwright');
  await expect(page.getByLabel('Search links')).toHaveValue('playwright');
});

test('my browser shows public IP from external lookup', async ({ page }) => {
  await page.route('https://api.ipify.org?format=json', async (route) => {
    await route.fulfill({ json: { ip: '203.0.113.1' } });
  });

  await page.goto('/#/my-browser');
  await expect(page.getByRole('heading', { name: 'My Browser' })).toBeVisible();
  await expect(page.getByText('203.0.113.1')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Network information (external)' })).toBeVisible();
});
