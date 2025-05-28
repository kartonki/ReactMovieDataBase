import { test, expect } from '@playwright/test';

test('homepage loads and shows header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /popular movies|search result/i })).toBeVisible();
});

test('can search for a movie', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Search').fill('batman');
  // Wait for results to load
  // Use locator with exact: true to avoid ambiguity
  const heading = page.getByRole('heading', { name: /batman/i, exact: true });
  await expect(heading).toBeVisible();
});

test('can navigate to a movie page', async ({ page }) => {
  await page.goto('/');
  // Click the first movie thumb
  const firstMovie = page.locator('.rmdb-grid-element a').first();
  await firstMovie.click();
  // Should show movie info
  await expect(page.locator('.rmdb-movie')).toBeVisible();
});
