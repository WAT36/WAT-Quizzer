import { test, expect } from './fixtures';

test.describe('quizzer / 問題追加', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/addQuiz/');
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
  });

  test('新しい問題を登録すると重複確認なしで即座に成功する', async ({ page }) => {
    await page.getByLabel('問題文').fill('E2Eテスト用の問題文');
    await page.getByLabel('答え').fill('E2Eテスト用の答え');

    await page.getByRole('button', { name: '問題登録' }).click();

    await expect(page.getByText('Added!!')).toBeVisible();
  });

  test('既存の答えと重複する場合は確認モーダルが表示され、それでも登録できる', async ({ page }) => {
    // quizMockData の file_num=1, quiz_num=1 の答え(let, const, var)と一致させ重複を発生させる
    await page.getByLabel('問題文').fill('重複確認テスト用の問題文');
    await page.getByLabel('答え').fill('let, const, var');

    await page.getByRole('button', { name: '問題登録' }).click();

    await expect(page.getByText('同じ答えの問題がすでに登録されています')).toBeVisible();

    await page.getByRole('button', { name: 'それでも登録する' }).click();

    await expect(page.getByText('Added!!')).toBeVisible();
  });
});
