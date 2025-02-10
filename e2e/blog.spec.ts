import { test, expect } from '@playwright/test';

test.describe('Blog Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the initial data fetch
    await page.waitForLoadState('networkidle');
  });

  test('should load home page with articles and layout', async ({ page }) => {
    // Wait for main content to be ready
    await page.waitForSelector('main', { state: 'visible' });

    // Check main layout elements
    await expect(page.getByRole('banner')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();

    // Check article grid is present
    const articleCount = await page.locator('article').count();
    expect(articleCount).toBeGreaterThan(0);
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('should navigate to article details page', async ({ page }) => {
    // Wait for articles to be loaded
    await page.waitForSelector('article', { state: 'visible' });

    // Click first article
    await page.locator('article').first().waitFor({ state: 'visible' });
    await page.locator('article').first().click();

    // Check article page content
    await expect(page).toHaveURL(/\/articles\/\d+/);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter articles by category', async ({ page }) => {
    // Wait for category buttons to be ready
    await page.waitForSelector('[data-testid="category-button"]', { state: 'visible' });

    // Click the Technology category button
    await page.getByRole('button', { name: 'Technology' }).click();
    await page.waitForLoadState('networkidle');

    // Wait for category filtering to take effect and verify results
    await expect(page.locator('article').first()).toContainText('Technology', { timeout: 10000 });
    const articleCount = await page.locator('article').count();
    expect(articleCount).toBeGreaterThan(0);
  });

  test('should sort articles', async ({ page }) => {
    // Wait for sort dropdown to be ready
    await page.waitForSelector('#sort-select', { state: 'visible' });

    // Select sort option
    await page.locator('#sort-select').selectOption('title');
    await page.waitForLoadState('networkidle');

    // Wait for sorting to take effect
    await page.waitForTimeout(1000); // Small delay for sorting animation

    // Verify articles are sorted
    const articleTitles = await page.locator('article h2').allTextContents();
    const sortedTitles = [...articleTitles].sort();
    expect(articleTitles).toEqual(sortedTitles);
  });

});
