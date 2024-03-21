import { test, expect } from '@playwright/test';

test('Quizzer Init', async ({ page }) => {
  await page.goto(process.env.QUIZZER_FRONT_SERVER || '');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Quizzer/);
});
