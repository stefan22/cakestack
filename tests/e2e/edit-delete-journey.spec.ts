import path from 'node:path';
import { test, expect } from '@playwright/test';

//const fixturePng = path.join(process.cwd(), 'tests/e2e/fixtures', 'tiny.png');

const describeJourney =
  process.env.E2E_SKIP_CREATE_JOURNEY ? test.describe.skip : test.describe;

describeJourney('sign up, edit, and delete a post', () => {
  test('author can edit their post and then delete it', async ({ page }) => {
    test.setTimeout(150_000);

    const suffix = Date.now();
    const email = `e2e-edit-${suffix}@example.com`;
    const title = `E2E Edit Title ${suffix}`;
    const updatedTitle = `${title} (updated)`;
    const content = 'This is long enough body content for validation rules.';

    await page.goto('/auth/sign-up');
    await page.getByPlaceholder('Enter name').fill('E2E Editor');
    await page.getByPlaceholder('Enter email').fill(email);
    await page.getByPlaceholder('Enter password').fill('secretpass');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await page.getByTestId('nav-link-create').waitFor({
      state: 'visible',
      timeout: 30_000,
    });

    await page.goto('/create');
    await page.getByPlaceholder('enter post title ...').fill(title);
    await page.getByPlaceholder(/write your post in/i).fill(content);
    //await page.locator('input[type="file"]').setInputFiles(fixturePng);
    await page.getByRole('button', { name: 'Create Post' }).click();

    // createBlogAction redirects straight to the new post's detail page.
    await page.waitForURL(/\/blog\/.+$/, { timeout: 60_000 });
    await expect(
      page.getByRole('heading', { name: title, level: 1 }),
    ).toBeVisible({ timeout: 30_000 });

    // Edit: only the post's own author sees these actions.
    await page.getByRole('link', { name: 'Edit post' }).click();
    await page.waitForURL(/\/edit$/);
    await page.getByPlaceholder('enter post title ...').fill(updatedTitle);
    await page.getByRole('button', { name: 'Save changes' }).click();

    await page.waitForURL(/\/blog\/.+$/, { timeout: 30_000 });
    await expect(
      page.getByRole('heading', { name: updatedTitle, level: 1 }),
    ).toBeVisible({ timeout: 30_000 });

    // Delete: confirm() must be accepted for the action to run.
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).click();

    await page.waitForURL(/\/blog$/, { timeout: 30_000 });
    await expect(
      page.getByRole('link', { name: updatedTitle }),
    ).toHaveCount(0);
  });
});
