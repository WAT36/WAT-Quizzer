import { test, expect } from './fixtures';

test.describe('englishBot / 単語追加', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/englishBot/addWord/');
  });

  test('単語名と意味を入力して登録できる', async ({ page }) => {
    await page.getByLabel('New Word').fill('testword');

    // 意味の行を追加してから入力する（初期状態では行が0件）
    await page.getByRole('button', { name: '行追加' }).click();
    await page.getByLabel('意味').fill('テスト単語の意味');

    await page.getByRole('button', { name: '登録' }).click();

    await expect(page.getByText('単語を追加しました')).toBeVisible();
    // 登録成功後は入力内容がリセットされる
    await expect(page.getByLabel('New Word')).toHaveValue('');
  });
});
