import { test, expect } from './fixtures';
import path from 'path';

test.describe('quizzer / 画像アップロード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/imageUpload/');
  });

  test('画像ファイルを選択するとアップロードが完了する', async ({ page }) => {
    const fileInput = page.getByLabel('画像ファイルを選択');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.png'));

    await expect(page.getByText('1件のアップロードが完了しました')).toBeVisible();
  });
});
