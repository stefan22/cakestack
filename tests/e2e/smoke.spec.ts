import { test, expect } from '@playwright/test';

test.describe('smoke navigation', () => {
  test('home shows the brand and hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'CakeStack' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Ideas on lorem, and building' })
    ).toBeVisible();
  });

  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(
      page.getByRole('heading', { name: 'Blog Posts', exact: true })
    ).toBeVisible();
  });

  test('navbar reaches blog from home', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-link-blog').click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(
      page.getByRole('heading', { name: 'Blog Posts', exact: true })
    ).toBeVisible();
  });

  test('sign-in page loads', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(
      page.getByRole('heading', { name: 'Welcome back!', exact: true })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
