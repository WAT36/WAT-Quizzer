import { test, expect } from '@playwright/test';

// モックモード(NEXT_PUBLIC_MOCK_MODE=true)で、ダッシュボード各ウィジェットが
// 「読み込み中」のまま止まらず、実際にモックデータで描画されることを確認する。

test.describe('quizzer / ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/');
  });

  test('ランダム問題カードはファイル未選択でも自動で問題を表示する', async ({ page }) => {
    // RandomQuizCard はページ側の selectedFileNum=-1 でも自前でファイルを選び出題する
    // チェック済み問題は先頭に✅が付くため、[file-quiz]パターンの位置は先頭とは限らない
    await expect(page.getByText(/\[\d+-\d+\]/)).toBeVisible();
  });

  test('ファイル選択後、各種グラフとおすすめカテゴリが表示される', async ({ page }) => {
    // グラフcanvasのaria-label("問題ファイル統計グラフ"等)も前方一致してしまうためexact指定
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    // 各グラフのcanvasにaria-labelが設定されており、描画完了を検証できる
    await expect(page.getByRole('img', { name: '問題ファイル統計グラフ' })).toBeVisible();
    await expect(page.getByRole('img', { name: '回答数推移グラフ' })).toBeVisible();
    await expect(page.getByRole('img', { name: '正解率ヒストグラム' })).toBeVisible();

    // おすすめカテゴリ（file_num指定後にのみ取得される）
    await expect(page.getByText('今日のおすすめカテゴリ')).toBeVisible();
    await expect(page.getByText('ネットワーク')).toBeVisible();
  });
});
