import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData, quizzes } from '../support/data';

test.describe('quizzer / 問題追加', () => {
  test.beforeEach(async ({ page, api }) => {
    mockQuizzerMasterData(api);
    // 既定では同じ答えの問題は見つからない
    api.on('GET', '/quiz/search', { json: { total: 0, quizzes: [] } });
    api.on('POST', '/quiz', ({ body }) => {
      const { file_num, question, answer } = body as { file_num: number; question: string; answer: string };
      return { status: 201, json: { file_num, quiz_num: 3, quiz_sentense: question, answer } };
    });

    await page.goto('/quizzer/addQuiz/');
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
  });

  test('入力した内容で問題が登録され、実行ログに表示される', async ({ page, api }) => {
    await page.getByLabel('問題文').fill('配列の末尾に要素を追加するメソッドは？');
    await page.getByLabel('答え').fill('push');
    await page.getByLabel('カテゴリ').fill('JavaScript');

    await page.getByRole('button', { name: '問題登録' }).click();

    await expect(page.getByText('Success!! 問題を追加できました!')).toBeVisible();
    await expect(page.getByText('Added!! [1-3]:配列の末尾に要素を追加するメソッドは？,push')).toBeVisible();

    // 登録前に同じ答えの問題がないか確認している
    expect(api.requests('GET', '/quiz/search')[0].query).toMatchObject({
      query: 'push',
      file_num: '1',
      searchInOnlyAnswer: 'true'
    });
    expect(api.requests('POST', '/quiz')[0].body).toMatchObject({
      file_num: 1,
      format_id: 1,
      question: '配列の末尾に要素を追加するメソッドは？',
      answer: 'push',
      category: 'JavaScript'
    });
  });

  test('同じ答えの問題がある場合は確認が表示され、それでも登録できる', async ({ page, api }) => {
    api.on('GET', '/quiz/search', { json: { total: 1, quizzes: [quizzes[0]] } });

    await page.getByLabel('問題文').fill('定数を宣言するキーワードは？');
    await page.getByLabel('答え').fill(quizzes[0].answer);
    await page.getByRole('button', { name: '問題登録' }).click();

    await expect(page.getByText('同じ答えの問題がすでに登録されています')).toBeVisible();
    expect(api.requests('POST', '/quiz')).toHaveLength(0);

    await page.getByRole('button', { name: 'それでも登録する' }).click();

    await expect(page.getByText('Success!! 問題を追加できました!')).toBeVisible();
    expect(api.requests('POST', '/quiz')).toHaveLength(1);
  });

  test('答えにカンマが含まれている場合は登録しない', async ({ page, api }) => {
    await page.getByLabel('問題文').fill('JavaScriptの変数宣言キーワードは？');
    await page.getByLabel('答え').fill('let, const');
    await page.getByRole('button', { name: '問題登録' }).click();

    await expect(page.getByText(/^エラー:/)).toBeVisible();
    expect(api.requests('POST', '/quiz')).toHaveLength(0);
  });
});
