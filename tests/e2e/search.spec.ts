import { test, expect } from '@playwright/test';

test.describe('navbar search', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('search shows dropdown or empty state after typing', async ({ page }) => {
    await page.goto('/');
    const search = page.getByPlaceholder('Search posts...');
    await expect(search).toBeVisible();
    await search.fill('ab');

    const dropdown = page.locator('div.absolute.top-full.mt-2.rounded-md.border');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    await expect(
      page
        .getByText('No results found!')
        .or(page.locator('a[href^="/blog/"]').first())
    ).toBeVisible({ timeout: 25_000 });
  });
});
