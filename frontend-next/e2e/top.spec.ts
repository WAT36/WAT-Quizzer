import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

// MUIのButtonはhref付きだと<a>、onClickのみだと<button>になるため、どちらにもマッチさせる
const navButton = (page: Page, label: string) => page.locator(`a:has-text("${label}"), button:has-text("${label}")`);

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test (baseURL は playwright.config.ts で設定)
    await page.goto('/');
  });

  test('格言の表示', async ({ page }) => {
    // 格言が初期表示の"(取得中...)"から変わるか確認（モックAPIからの取得完了を確認）
    await expect(page.locator('#saying')).not.toHaveText(/取得中/);
  });

  test('ヘッダーのロゴ表示', async ({ page }) => {
    // ヘッダーに"WAT Quizzer"が表示されているか
    await expect(page.locator('header')).toContainText('WAT Quizzer');
  });

  test('主要ボタンの存在', async ({ page }) => {
    // Quizzer, English Quiz Bot, 設定ボタンが存在するか
    await expect(navButton(page, 'Quizzer')).toBeVisible();
    await expect(navButton(page, 'English Quiz Bot')).toBeVisible();
    await expect(navButton(page, '設定')).toBeVisible();
  });

  test('主要ボタンの遷移', async ({ page }) => {
    // Quizzerボタンをクリックして遷移するか
    await navButton(page, 'Quizzer').click();
    await expect(page).toHaveURL(/\/quizzer/);
    await page.goBack();
    // English Quiz Botボタンをクリックして遷移するか
    await navButton(page, 'English Quiz Bot').click();
    await expect(page).toHaveURL(/\/englishBot/);
    await page.goBack();
    // 設定ボタンをクリックして遷移するか
    await navButton(page, '設定').click();
    await expect(page).toHaveURL(/\/settings/);
    await page.goBack();
  });

  test('フッターの表示', async ({ page }) => {
    // フッターのトップ・ログアウトボタン、コピーライトが表示されているか
    await expect(page.locator('footer').locator('a:has-text("トップ"), button:has-text("トップ")')).toBeVisible();
    await expect(page.locator('footer').locator('a:has-text("ログアウト"), button:has-text("ログアウト")')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Tatsuroh Wakasugi');
  });
});
