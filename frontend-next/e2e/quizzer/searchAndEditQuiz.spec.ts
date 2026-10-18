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

  test('カテゴリを複数指定してAND検索でき、カテゴリごとにNOTを指定できる', async ({ page, api }) => {
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    await page.getByRole('combobox', { name: 'カテゴリ' }).click();
    await page.getByRole('option', { name: 'JavaScript' }).click();
    await page.getByRole('option', { name: '非同期処理' }).click();
    await page.keyboard.press('Escape');

    // 追加したカテゴリはNOTなし。OR は指定できない
    const asyncNot = page.getByRole('button', { name: '非同期処理を含まない', exact: true });
    await expect(asyncNot).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'OR', exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: '検索', exact: true }).click();
    expect(api.requests('GET', '/quiz/search')[0].query).toMatchObject({
      file_num: '1',
      category_and: JSON.stringify(['JavaScript', '非同期処理'])
    });

    await asyncNot.click();
    await expect(asyncNot).toHaveAttribute('aria-pressed', 'true');
    // NOTの切り替えで候補リストは開かない
    await expect(page.getByRole('listbox')).toHaveCount(0);

    await page.getByRole('button', { name: '検索', exact: true }).click();
    const query = api.requests('GET', '/quiz/search')[1].query;
    expect(query).toMatchObject({
      file_num: '1',
      category_and: JSON.stringify(['JavaScript']),
      category_not: JSON.stringify(['非同期処理'])
    });
    expect(query).not.toHaveProperty('category');
  });

  test('旧形式（カテゴリ1つ）で保存された検索条件はANDのカテゴリとして復元される', async ({ page, api }) => {
    await page.evaluate(() =>
      sessionStorage.setItem(
        'searchQuizRequestData',
        JSON.stringify({ query: '', file_num: 1, format_id: {}, category: 'JavaScript' })
      )
    );
    await page.reload();

    await expect(page.getByRole('row', { name: target.quiz_sentense })).toBeVisible();
    expect(api.requests('GET', '/quiz/search')[0].query).toMatchObject({
      file_num: '1',
      category_and: JSON.stringify(['JavaScript'])
    });
    await expect(page.getByRole('button', { name: 'JavaScriptを含まない', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
