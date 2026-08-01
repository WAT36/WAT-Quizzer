import { test, expect } from './fixtures';

test.describe('englishBot / 例文追加', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/englishBot/addExample/');
  });

  test('必須項目が未入力だとエラーメッセージが表示される', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: '登録' }).first();

    await registerButton.click();
    await expect(page.getByText('エラー:例文(英文)が入力されていません')).toBeVisible();

    await page.getByLabel('例文(英語)').fill('This is a test sentence.');
    await registerButton.click();
    await expect(page.getByText('エラー:例文(和文)が入力されていません')).toBeVisible();
  });

  test('英文・和訳を入力すると登録に成功し、入力欄がリセットされる', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: '登録' }).first();

    await page.getByLabel('例文(英語)').fill('This is a test sentence.');
    await page.getByLabel('例文(和訳)').fill('これはテスト用の例文です。');

    await registerButton.click();

    await expect(page.getByText('例文を追加しました')).toBeVisible();
    await expect(page.getByLabel('例文(英語)')).toHaveValue('');
    await expect(page.getByLabel('例文(和訳)')).toHaveValue('');
  });
});
