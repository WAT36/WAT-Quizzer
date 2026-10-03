import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData, quizzes } from '../support/data';

test.describe('quizzer / 問題出題', () => {
  test.beforeEach(async ({ page, api }) => {
    mockQuizzerMasterData(api);
    api.on('GET', '/quiz/random', { json: { total: quizzes.length, quizzes } });
    api.on('POST', '/quiz/clear', { status: 201, json: {} });
    api.on('POST', '/quiz/fail', { status: 201, json: {} });

    await page.goto('/quizzer/getQuiz/');
  });

  test('出題設定で条件を指定して出題を始め、全問回答すると結果が表示される', async ({ page, api }) => {
    await page.getByRole('button', { name: '出題設定を開く' }).click();
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByLabel('出題数').fill('2');
    await page.getByRole('button', { name: '出題スタート' }).click();

    // 指定した条件で問題を取得している
    expect(api.requests('GET', '/quiz/random')[0].query).toMatchObject({ file_num: '1', count: '2' });

    // 1問目: 答えを表示して正解
    await expect(page.getByText('2問中1問目')).toBeVisible();
    await expect(page.getByText(quizzes[0].quiz_sentense)).toBeVisible();
    await page.getByRole('button', { name: '答え' }).click();
    await expect(page.getByText(quizzes[0].answer, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '正解!!' }).click();

    // 2問目: 不正解
    await expect(page.getByText('2問中2問目')).toBeVisible();
    await expect(page.getByText(quizzes[1].quiz_sentense)).toBeVisible();
    await page.getByRole('button', { name: '答え' }).click();
    await page.getByRole('button', { name: '不正解...' }).click();

    // 回答した問題ごとに、正解・不正解が登録されている
    expect(api.requests('POST', '/quiz/clear').map((r) => r.body)).toEqual([
      expect.objectContaining({ quiz_id: quizzes[0].id })
    ]);
    expect(api.requests('POST', '/quiz/fail').map((r) => r.body)).toEqual([
      expect.objectContaining({ quiz_id: quizzes[1].id })
    ]);

    await expect(page.getByText('2問中1問正解でした')).toBeVisible();

    await page.getByRole('button', { name: '出題設定に戻る' }).click();
    await expect(page.getByText('出題設定から条件を設定して出題してください。')).toBeVisible();
  });

  test('正解の登録に失敗した場合は次の問題に進まない', async ({ page, api }) => {
    api.on('POST', '/quiz/clear', { status: 500, json: {} });

    await page.getByRole('button', { name: '出題設定を開く' }).click();
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByRole('button', { name: '出題スタート' }).click();

    await page.getByRole('button', { name: '答え' }).click();
    await page.getByRole('button', { name: '正解!!' }).click();

    await expect(page.getByText('エラー:外部APIとの連携に失敗しました')).toBeVisible();
    await expect(page.getByText('2問中1問目')).toBeVisible();
  });

  test('問題ファイルを選ばないと出題スタートできない', async ({ page }) => {
    await page.getByRole('button', { name: '出題設定を開く' }).click();

    await expect(page.getByRole('button', { name: '出題スタート' })).toBeDisabled();
  });
});
