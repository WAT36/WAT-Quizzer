import { test, expect } from '@playwright/test';

test.describe('quizzer / 問題検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/searchQuiz/');
  });

  test('ファイルとキーワードを指定して検索すると該当する問題が表示される', async ({ page }) => {
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    await page.getByLabel('検索語句').fill('JavaScript');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    await expect(page.getByText('全1件中 1件表示')).toBeVisible();
    await expect(page.getByText('JavaScriptで変数を宣言する際に使用するキーワードはどれか？')).toBeVisible();
  });

  test('該当しないキーワードで検索すると0件になる', async ({ page }) => {
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    await page.getByLabel('検索語句').fill('絶対に存在しないはずのキーワードXYZ');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    await expect(page.getByText('全0件中 0件表示')).toBeVisible();
  });
});
