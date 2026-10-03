import type { Page } from '@playwright/test';
import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData, quizzes } from '../support/data';

// 削除画面は「削除する(統合元の)問題」と「統合先の問題」の2つの欄に同じ名前の入力欄・ボタンがあるため、欄ごとに絞り込んで操作する
const DELETE_SECTION = '削除する(統合元の)問題';
const INTEGRATE_SECTION = '統合先の問題';

const section = (page: Page, title: string) => {
  const otherTitle = title === DELETE_SECTION ? INTEGRATE_SECTION : DELETE_SECTION;
  return page
    .locator('.MuiPaper-root')
    .filter({ has: page.getByRole('heading', { name: title }) })
    .filter({ hasNot: page.getByRole('heading', { name: otherTitle }) })
    .first();
};

test.describe('quizzer / 問題削除', () => {
  const [integrateTo, target] = quizzes;

  test.beforeEach(async ({ page, api }) => {
    mockQuizzerMasterData(api);
    // 問題番号で1問取得する
    api.on('GET', '/quiz', ({ query }) => {
      const quiz = quizzes.find((q) => String(q.quiz_num) === query.quiz_num);
      return quiz ? { json: quiz } : { status: 404, json: {} };
    });
    api.on('DELETE', '/quiz', { json: {} });
    api.on('POST', '/quiz/integrate', { status: 201, json: {} });

    await page.goto('/quizzer/deleteQuiz/');
  });

  const fetchDeleteTarget = async (page: Page) => {
    const deleteSection = section(page, DELETE_SECTION);
    await deleteSection.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await deleteSection.getByLabel('問題番号').fill(String(target.quiz_num));
    await deleteSection.getByRole('button', { name: '問題取得' }).click();
    await expect(deleteSection.getByText(target.quiz_sentense)).toBeVisible();
  };

  test('問題番号を指定して取得した問題を削除できる', async ({ page, api }) => {
    await fetchDeleteTarget(page);

    expect(api.requests('GET', '/quiz')[0].query).toMatchObject({ file_num: '1', quiz_num: '2' });

    await section(page, DELETE_SECTION).getByRole('button', { name: '削除' }).click();

    await expect(page.getByText('Success! 削除に成功しました [1-2]')).toBeVisible();
    expect(api.requests('DELETE', '/quiz')[0].body).toEqual({ file_num: 1, quiz_num: 2 });
    // 削除が終わると表示していた問題が消える
    await expect(page.getByText(target.quiz_sentense)).toBeHidden();
  });

  test('削除する問題を別の問題に統合できる', async ({ page, api }) => {
    await fetchDeleteTarget(page);

    const integrateSection = section(page, INTEGRATE_SECTION);
    await integrateSection.getByLabel('問題番号').fill(String(integrateTo.quiz_num));
    await integrateSection.getByRole('button', { name: '問題取得' }).click();
    await expect(integrateSection.getByText(integrateTo.quiz_sentense)).toBeVisible();

    await integrateSection.getByRole('button', { name: '統合' }).click();

    await expect(page.getByText(`Success! 統合に成功しました[ID:${target.id}->${integrateTo.id}]`)).toBeVisible();
    expect(api.requests('POST', '/quiz/integrate')[0].body).toEqual({ fromQuizId: target.id, toQuizId: integrateTo.id });
    expect(api.requests('DELETE', '/quiz')).toHaveLength(0);
  });

  test('問題を取得せずに削除しようとするとエラーになり、削除は行われない', async ({ page, api }) => {
    await section(page, DELETE_SECTION).getByRole('button', { name: '削除' }).click();

    await expect(page.getByText('エラー:削除する問題を取得して下さい')).toBeVisible();
    expect(api.requests('DELETE', '/quiz')).toHaveLength(0);
  });
});
