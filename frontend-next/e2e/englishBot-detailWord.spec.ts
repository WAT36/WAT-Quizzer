import { test, expect } from './fixtures';

// モックモードでは getStaticPaths で id=1〜5 の静的ページのみが生成され、
// englishDataMock.words の該当idの単語名がビルド時に埋め込まれる。

test.describe('englishBot / 単語詳細', () => {
  test('id=1の単語詳細ページで単語名が表示される', async ({ page }) => {
    // ページ内には Title コンポーネント由来のh1("WAT Quizzer - englishBot")も存在するため、
    // 単語名を含む方をnameで直接指定する
    await page.goto('/englishBot/detailWord/1/');
    await expect(page.getByRole('heading', { level: 1, name: /algorithm/ })).toBeVisible();
  });

  test('id=2の単語詳細ページでは別の単語名が表示される', async ({ page }) => {
    await page.goto('/englishBot/detailWord/2/');
    await expect(page.getByRole('heading', { level: 1, name: /framework/ })).toBeVisible();
  });

  test('モック環境ではチェック反転ボタンが無効化されている', async ({ page }) => {
    await page.goto('/englishBot/detailWord/1/');
    await expect(page.getByRole('button', { name: 'チェック反転' })).toBeDisabled();
  });
});
