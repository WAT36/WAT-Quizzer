import { test, expect } from './fixtures';

// このページには複数のPullDown（ファイル選択用）があり、ラベル未指定のものは
// フォールバックで全て同じ"ファイル選択"というアクセシブルネームになる。
// そのため本specでは、単一の入力欄で完結する section に絞ってテストする。

test.describe('quizzer / 設定', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/settings/');
  });

  test('新規ファイルを追加できる', async ({ page }) => {
    await page.getByLabel('新規ファイル名').fill('E2Eテスト用ファイル');
    await page.getByRole('button', { name: '追加', exact: true }).first().click();

    await expect(page.getByText('新規ファイル「E2Eテスト用ファイル」を追加しました')).toBeVisible();
  });

  test('空カテゴリ整理を実行できる', async ({ page }) => {
    await page.getByRole('button', { name: '空カテゴリ整理' }).click();

    await expect(page.getByText('削除対象のカテゴリはありませんでした。')).toBeVisible();
  });
});
