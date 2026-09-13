import { test, expect } from './fixtures';

// モックモードの固定データ（quizzer-lib の quizMockData）を前提にしたテスト。
// file_num=1（プログラミング基礎問題集）は3問(quiz_num=1〜3)で構成されている。
// 出題数に全問数を指定することで、出題順（モックではランダム）に依存せず全問の出題を保証できる。
const TARGET_FILE = 'プログラミング基礎問題集';
const TARGET_FILE_QUIZ_COUNT = 3;
const TARGET_QUIZ_SENTENSE = 'JavaScriptで変数を宣言する際に使用するキーワードはどれか？';
const TARGET_ANSWER = 'let, const, var';

test.describe('quizzer / 問題出題', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/getQuiz/');
    await page.getByRole('button', { name: '出題設定を開く' }).click();
  });

  test('出題設定から出題を開始すると問題が1問ずつ表示される', async ({ page }) => {
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: TARGET_FILE }).click();
    await page.getByLabel('出題数').fill(String(TARGET_FILE_QUIZ_COUNT));
    await page.getByRole('button', { name: '出題スタート' }).click();

    await expect(page.getByText(`${TARGET_FILE_QUIZ_COUNT}問中1問目`)).toBeVisible();
  });

  test('回答すると次の問題に進み、全問終了すると結果が表示され出題設定に戻れる', async ({ page }) => {
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: TARGET_FILE }).click();
    await page.getByLabel('出題数').fill(String(TARGET_FILE_QUIZ_COUNT));
    await page.getByRole('button', { name: '出題スタート' }).click();

    // モックではランダムに並ぶため、全問を回答する過程で対象の問題が出てくることを確認する
    let sawTargetQuiz = false;
    for (let i = 0; i < TARGET_FILE_QUIZ_COUNT; i++) {
      await page.getByRole('button', { name: '答え' }).click();
      if (await page.getByText(TARGET_ANSWER).isVisible()) {
        sawTargetQuiz = true;
        await expect(page.getByText(TARGET_QUIZ_SENTENSE)).toBeVisible();
      }
      await page.getByRole('button', { name: '正解!!' }).click();
    }
    expect(sawTargetQuiz).toBe(true);

    await expect(page.getByText(`${TARGET_FILE_QUIZ_COUNT}問中${TARGET_FILE_QUIZ_COUNT}問正解でした`)).toBeVisible();

    await page.getByRole('button', { name: '出題設定に戻る' }).click();
    await expect(page.getByText('出題設定から条件を設定して出題してください。')).toBeVisible();
  });

  test('問題ファイルを選択しないと出題スタートできない', async ({ page }) => {
    await expect(page.getByRole('button', { name: '出題スタート' })).toBeDisabled();
  });
});
