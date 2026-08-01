import { test, expect } from '@playwright/test';

// モックモードのAPIはランダムな単語/例文を返す仕様のため、内容そのものではなく
// 「出題→答え表示→正解登録」の一連の状態遷移が機能することを確認する。

test.describe('englishBot / 単語テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/englishBot/testWord/');
  });

  test('単語テスト（単語名モード）: 出題→答え表示→正解登録の一連の流れ', async ({ page }) => {
    const answerButton = page.getByRole('button', { name: '答え' });

    // 出題前は displayTestData.testType が未設定のため、答えボタン自体が描画されない
    await expect(answerButton).not.toBeVisible();

    await page.getByRole('button', { name: 'Random Word' }).click();

    // 出題されると答えボタンが表示・有効になる
    await expect(answerButton).toBeEnabled();

    await answerButton.click();
    // 意味の一覧（[品詞]意味 形式）が表示される。SideBarのナビゲーションも<li>を使うため
    // 先頭が"["で始まるテキストで絞り込む
    await expect(page.getByText(/^\[.+\]/).first()).toBeVisible();

    await page.getByRole('button', { name: '正解!!' }).click();

    // 正解登録に成功すると出題内容がリセットされ、答えボタンが再び非表示になる
    await expect(answerButton).not.toBeVisible();
  });

  test('例文テストへの切り替え: 出題→答え表示→正解登録の一連の流れ', async ({ page }) => {
    await page.getByRole('radio', { name: 'Example' }).click();

    const answerButton = page.getByRole('button', { name: '答え' });
    await expect(answerButton).toBeDisabled();

    await page.getByRole('button', { name: 'Random Example' }).click();
    await expect(answerButton).toBeEnabled();

    await answerButton.click();
    await page.getByRole('button', { name: '正解!!' }).click();

    await expect(answerButton).toBeDisabled();
  });
});
