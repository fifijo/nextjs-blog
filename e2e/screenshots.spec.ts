import { test } from '@playwright/test';

test.describe('UI Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the initial data fetch
    await page.waitForLoadState('networkidle');
    // Wait for main content
    await page.waitForSelector('main', { state: 'visible' });
  });

  test('capture homepage', async ({ page }) => {
    // Wait for articles to load
    await page.waitForSelector('article', { state: 'visible' });
    // Take full page screenshot
    await page.screenshot({
      path: './public/screenshots/homepage.png',
      fullPage: true
    });
  });

  test('capture article details page', async ({ page }) => {
    // Wait for articles and click first one
    await page.waitForSelector('article', { state: 'visible' });
    await page.locator('article').first().click();

    // Wait for article content to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { state: 'visible' });

    // Take full page screenshot
    await page.screenshot({
      path: './public/screenshots/article-details.png',
      fullPage: true
    });
  });

  test('capture filtered articles by category', async ({ page }) => {
    // Wait for category buttons
    await page.waitForSelector('[data-testid="category-button"]', { state: 'visible' });

    // Click Technology category
    await page.getByRole('button', { name: 'Technology' }).click();
    await page.waitForLoadState('networkidle');

    // Take screenshot of filtered results
    await page.screenshot({
      path: './public/screenshots/filtered-articles.png',
      fullPage: true
    });
  });

  test('capture sorted articles', async ({ page }) => {
    // Wait for sort dropdown
    await page.waitForSelector('#sort-select', { state: 'visible' });

    // Sort by title
    await page.locator('#sort-select').selectOption('title');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for sort animation

    // Take screenshot of sorted results
    await page.screenshot({
      path: './public/screenshots/sorted-articles.png',
      fullPage: true
    });
  });
});
