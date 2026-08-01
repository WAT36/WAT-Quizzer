import { test, expect } from './fixtures';

// モックモード(NEXT_PUBLIC_MOCK_MODE=true)で、ダッシュボード各ウィジェットが
// 「読み込み中」のまま止まらず、実際にモックデータで描画されることを確認する。

test.describe('englishBot / ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/englishBot/');
  });

  test('各種グラフとランダム単語が表示される', async ({ page }) => {
    // 各グラフのcanvasにaria-labelが設定されており、描画完了を検証できる
    await expect(page.getByRole('img', { name: '単熟語登録数グラフ' })).toBeVisible();
    await expect(page.getByRole('img', { name: '過去１週間の回答数グラフ' })).toBeVisible();
    await expect(page.getByRole('img', { name: '出典別正答率グラフ' })).toBeVisible();

    // ランダムに1語表示されるカード
    await expect(page.locator('#wordName')).not.toBeEmpty();
  });
});
