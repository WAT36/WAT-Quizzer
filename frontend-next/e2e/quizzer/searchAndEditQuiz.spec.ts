import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData, quizzes } from '../support/data';
import type { CategoryParentChildAPIResponseDto } from 'quizzer-lib';

// 「非同期処理」の親カテゴリが「JavaScript」という親子関係
const categoryParentChildList: CategoryParentChildAPIResponseDto[] = [
  { id: 1, parent_category_id: 1, parent_category_name: 'JavaScript', child_category_id: 2, child_category_name: '非同期処理' }
];

test.describe('quizzer / 問題検索 → 編集', () => {
  const target = quizzes[1];

  test.beforeEach(async ({ page, api }) => {
    mockQuizzerMasterData(api);
    api.on('GET', '/quiz/search', { json: { total: quizzes.length, quizzes } });
    // 編集画面で問題番号を指定して1問取得する
    api.on('GET', '/quiz', { json: target });
    api.on('GET', '/category/parent-child', { json: categoryParentChildList });
    api.on('POST', '/quiz/edit', ({ body }) => {
      const { file_num, quiz_num, question, answer } = body as {
        file_num: number;
        quiz_num: number;
        question: string;
        answer: string;
      };
      return { status: 201, json: { file_num, quiz_num, quiz_sentense: question, answer } };
    });

    await page.goto('/quizzer/searchQuiz/');
  });

  test('検索結果から問題を選んで編集し、更新できる', async ({ page, api }) => {
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByLabel('検索語句').fill('Promise');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    expect(api.requests('GET', '/quiz/search')[0].query).toMatchObject({ file_num: '1', query: 'Promise' });
    await expect(page.getByText(`全${quizzes.length}件中 ${quizzes.length}件表示`)).toBeVisible();

    // 対象の問題の行にある編集ボタンから編集画面へ移る
    await page.getByRole('row', { name: target.quiz_sentense }).getByRole('button').click();

    await expect(page).toHaveURL(/\/quizzer\/editQuiz\/?\?file_num=1&quiz_num=2$/);
    expect(api.requests('GET', '/quiz')[0].query).toMatchObject({ file_num: '1', quiz_num: '2' });
    await expect(page.getByLabel('問題文')).toHaveValue(target.quiz_sentense);
    await expect(page.getByLabel('答え')).toHaveValue(target.answer);

    await page.getByLabel('答え').fill('fulfilled(履行済み)');
    await page.getByLabel('カテゴリ').fill('非同期処理');
    await page.getByRole('button', { name: '更新' }).click();

    await expect(page.getByText('Success!! 問題を更新できました!')).toBeVisible();
    // カテゴリは親カテゴリも含めて送られる
    expect(api.requests('POST', '/quiz/edit')[0].body).toMatchObject({
      quiz_id: target.id,
      file_num: 1,
      quiz_num: 2,
      question: target.quiz_sentense,
      answer: 'fulfilled(履行済み)',
      category: 'JavaScript,非同期処理'
    });
    // 更新が終わると入力欄が空になり、続けて更新できない
    await expect(page.getByLabel('問題文')).toHaveValue('');
    await expect(page.getByRole('button', { name: '更新' })).toBeDisabled();
  });

  test('編集画面から戻ると、前回の検索条件で自動的に再検索される', async ({ page, api }) => {
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByLabel('検索語句').fill('Promise');
    await page.getByRole('button', { name: '検索', exact: true }).click();
    await page.getByRole('row', { name: target.quiz_sentense }).getByRole('button').click();
    await expect(page.getByLabel('問題文')).toHaveValue(target.quiz_sentense);

    await page.goBack();

    await expect(page.getByLabel('検索語句')).toHaveValue('Promise');
    await expect(page.getByRole('row', { name: target.quiz_sentense })).toBeVisible();
    expect(api.requests('GET', '/quiz/search')).toHaveLength(2);
    expect(api.requests('GET', '/quiz/search')[1].query).toMatchObject({ file_num: '1', query: 'Promise' });
  });
});
