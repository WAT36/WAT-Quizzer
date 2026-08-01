import { test, expect } from './fixtures';

test.describe('quizzer / 問題編集', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/editQuiz/');
  });

  test('問題を取得して編集し、更新できる', async ({ page }) => {
    const updateButton = page.getByRole('button', { name: '更新' });

    // 問題取得前は更新ボタンが無効
    await expect(updateButton).toBeDisabled();

    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    // 「関連基礎問題番号(カンマ区切りで問題番号を指定)：」ラベルも"問題番号"を含むためexact指定
    await page.getByLabel('問題番号', { exact: true }).fill('1');
    await page.getByRole('button', { name: '問題取得' }).click();

    // 既存の問題文が読み込まれる
    await expect(page.getByLabel('問題文')).toHaveValue('JavaScriptで変数を宣言する際に使用するキーワードはどれか？');
    await expect(updateButton).toBeEnabled();

    await page.getByLabel('答え').fill('let, const, var (更新後)');
    await updateButton.click();

    await expect(page.getByText('編集に成功しました')).toBeVisible();
  });
});
