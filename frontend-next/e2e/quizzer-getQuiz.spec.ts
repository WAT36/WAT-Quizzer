import { test, expect } from '@playwright/test';

// モックモードの固定データ（quizzer-lib の quizMockData）を前提にしたテスト。
// file_num=1（プログラミング基礎問題集）の quiz_num=1 は四択形式ではないため
// 選択肢の並び替えが発生せず、文面が完全に決定的になる。
const TARGET_FILE = 'プログラミング基礎問題集';
const TARGET_QUIZ_SENTENSE = 'JavaScriptで変数を宣言する際に使用するキーワードはどれか？';
const TARGET_ANSWER = 'let, const, var';

test.describe('quizzer / 問題出題', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/getQuiz/');
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: TARGET_FILE }).click();
  });

  test('問題番号を指定して出題→答え表示→正解登録の一連の流れ', async ({ page }) => {
    await page.getByLabel('問題番号').fill('1');
    await page.getByRole('button', { name: '出題', exact: true }).click();

    await expect(page.getByText(TARGET_QUIZ_SENTENSE)).toBeVisible();

    // 答えはまだ表示されていない
    await expect(page.getByText(TARGET_ANSWER)).not.toBeVisible();

    await page.getByRole('button', { name: '答え' }).click();
    await expect(page.getByText(TARGET_ANSWER)).toBeVisible();

    await page.getByRole('button', { name: '正解!!' }).click();

    // 正解登録に成功すると出題表示がリセットされる
    await expect(page.getByText(TARGET_QUIZ_SENTENSE)).not.toBeVisible();
  });

  test('存在しない問題番号を指定するとエラーメッセージが表示される', async ({ page }) => {
    await page.getByLabel('問題番号').fill('999');
    await page.getByRole('button', { name: '出題', exact: true }).click();

    await expect(page.getByText(/エラー/)).toBeVisible();
  });

  test('ランダム出題ボタンで選択中ファイルの問題が表示される', async ({ page }) => {
    await page.getByRole('button', { name: 'ランダム出題' }).click();

    // [1-N] 形式のプレフィックスが選択ファイル(file_num=1)の問題であることを保証する
    await expect(page.getByText(/^\[1-\d+\]/)).toBeVisible();
  });
});
