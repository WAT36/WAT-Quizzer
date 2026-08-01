import { test, expect } from './fixtures';

test.describe('settings / TODO管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings/');
  });

  test('TODOを追加→削除→復元できる', async ({ page }) => {
    const todoText = `E2Eテスト用TODO-${Date.now()}`;

    await page.getByLabel('新規TODO').fill(todoText);
    await page.getByRole('button', { name: 'TODO登録' }).click();
    await expect(page.getByText(`新規Todo「${todoText}」を追加しました`)).toBeVisible();

    // 追加後のリストは自動更新されないため、「削除済みも表示」を切り替えて再取得させる
    await page.getByRole('checkbox', { name: '削除済みも表示' }).check();

    const row = page.getByRole('row', { name: new RegExp(todoText) });
    await expect(row).toBeVisible();

    // 削除成功後、一覧再取得の完了メッセージが「削除に成功しました」を即座に上書きするため、
    // トースト文言ではなく実際のボタンの変化（削除→復元）で結果を検証する
    await row.getByRole('button', { name: '削除' }).click();
    await expect(row.getByRole('button', { name: '復元' })).toBeVisible();

    await row.getByRole('button', { name: '復元' }).click();
    await expect(row.getByRole('button', { name: '削除' })).toBeVisible();
  });
});
