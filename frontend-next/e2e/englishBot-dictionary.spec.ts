import { test, expect } from './fixtures';

test.describe('englishBot / Dictionary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/englishBot/dictionary/');
  });

  test('単語を検索すると結果が一覧表示される', async ({ page }) => {
    await page.getByLabel('単語名検索').fill('algorithm');
    await page.getByRole('button', { name: '検索' }).click();

    await expect(page.getByText('algorithm')).toBeVisible();
  });
});
