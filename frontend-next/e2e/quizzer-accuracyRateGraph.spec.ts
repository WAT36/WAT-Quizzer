import { test, expect } from '@playwright/test';

test.describe('quizzer / カテゴリ別正解率表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/accuracyRateGraph/');
  });

  test('ファイルを選択して表示すると正答率グラフとカテゴリ別問題数が表示される', async ({ page }) => {
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    await page.getByRole('button', { name: '表示' }).click();

    // デフォルトは棒グラフ(Bar)
    await expect(page.getByRole('img', { name: 'カテゴリ別正答率グラフ' })).toBeVisible();

    // カテゴリ別問題数ツリーマップ（PullDown/カウントのモックデータに基づく固定カテゴリ）
    await expect(page.getByText('カテゴリ別問題数')).toBeVisible();
    await expect(page.getByText('AWS')).toBeVisible();
  });

  test('グラフの種類をRadarに切り替えられる', async ({ page }) => {
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByRole('button', { name: '表示' }).click();

    await page.getByRole('button', { name: 'Radar' }).click();

    await expect(page.getByRole('img', { name: 'カテゴリ別正答率レーダーチャート' })).toBeVisible();
  });
});
