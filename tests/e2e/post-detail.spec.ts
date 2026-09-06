import { test, expect } from '@playwright/test';

const slug = process.env.E2E_POST_SLUG?.trim();

test.describe('post detail', () => {
  test('shows post content when slug is valid', async ({ page }) => {
    test.skip(!slug, 'Set E2E_POST_SLUG to a real post slug to run this test');
    await page.goto(`/blog/${slug}`);
    await expect(page.getByText('No post found')).not.toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Back to blog' })
    ).toBeVisible();
  });
});
