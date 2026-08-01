import { test, expect } from './fixtures';

test.describe('quizzer / 問題削除', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/deleteQuiz/');
  });

  test('問題を取得して削除できる', async ({ page }) => {
    // ページ内に「削除する(統合元)」「統合先」の2つの問題ファイルPullDownが存在するため、
    // 先に描画される削除元の方をfirst()で指定する
    await page.getByLabel('問題ファイル', { exact: true }).first().click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByLabel('問題番号').first().fill('1');
    await page.getByRole('button', { name: '問題取得' }).first().click();

    await expect(page.getByText('問題　　：JavaScriptで変数を宣言する際に使用するキーワードはどれか？')).toBeVisible();

    await page.getByRole('button', { name: '削除' }).click();

    await expect(page.getByText('削除に成功しました')).toBeVisible();
    // 削除成功後は表示内容がリセットされる
    await expect(page.getByText('問題　　：JavaScriptで変数を宣言する際に使用するキーワードはどれか？')).not.toBeVisible();
  });
});
