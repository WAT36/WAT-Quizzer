import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(process.env.QUIZZER_FRONT_SERVER || '');
  });

  test('Quizzer Init', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Quizzer/);
    // 格言で取得中。。から変わるか確認
    await expect(page.locator('#saying')).not.toHaveText(/取得中.../);
    // DBヘルスチェックで取得中。。から変わるか確認
    await expect(page.locator('#db-health')).not.toHaveText(/取得中.../);
  });
});
