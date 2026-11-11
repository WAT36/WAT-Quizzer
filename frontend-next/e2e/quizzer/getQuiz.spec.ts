import type { Page } from '@playwright/test';
import { test, expect } from '../support/fixtures';
import type { ApiMock } from '../support/api-mock';
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

    // 1問目: 答えを表示して正解
    await expect(page.getByText('2問中1問目')).toBeVisible();
    // 指定した条件で問題を取得している
    expect(api.requests('GET', '/quiz/random')[0].query).toMatchObject({ file_num: '1', count: '2' });
    await expect(page.getByText(quizzes[0].quiz_sentense)).toBeVisible();
    await page.getByRole('button', { name: '答え' }).click();
    await expect(page.getByText(quizzes[0].answer, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '正解!!' }).click();

    // 2問目: 不正解
    await expect(page.getByText('2問中2問目')).toBeVisible();
    await expect(page.getByText(quizzes[1].quiz_sentense)).toBeVisible();
    await page.getByRole('button', { name: '答え' }).click();
    await page.getByRole('button', { name: '不正解...' }).click();

    await expect(page.getByText('2問中1問正解でした')).toBeVisible();

    // 回答した問題ごとに、正解・不正解が登録されている
    expect(api.requests('POST', '/quiz/clear').map((r) => r.body)).toEqual([
      expect.objectContaining({ quiz_id: quizzes[0].id })
    ]);
    expect(api.requests('POST', '/quiz/fail').map((r) => r.body)).toEqual([
      expect.objectContaining({ quiz_id: quizzes[1].id })
    ]);

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

  test('チェックをつける/外すと、問題文の✅が切り替わる', async ({ page, api }) => {
    // 奇数回目のチェック反転でチェック済みになる
    api.on('POST', '/quiz/check', () => ({
      status: 201,
      json: { checked: api.requests('POST', '/quiz/check').length % 2 === 1 }
    }));

    await page.getByRole('button', { name: '出題設定を開く' }).click();
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByRole('button', { name: '出題スタート' }).click();

    await page.getByRole('button', { name: '答え' }).click();
    await expect(page.getByText('✅')).toBeHidden();

    const checkButton = page.getByRole('button', { name: 'チェックつける/外す' });
    await checkButton.click();
    await expect(page.getByText('✅')).toBeVisible();
    expect(api.requests('POST', '/quiz/check')[0].body).toEqual({ quiz_id: quizzes[0].id });

    await checkButton.click();
    await expect(page.getByText('✅')).toBeHidden();
  });

  test('チェック反転の登録に失敗すると、問題文の✅は変わらない', async ({ page, api }) => {
    api.on('POST', '/quiz/check', { status: 500, json: {} });

    await page.getByRole('button', { name: '出題設定を開く' }).click();
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByRole('button', { name: '出題スタート' }).click();

    await page.getByRole('button', { name: '答え' }).click();
    await page.getByRole('button', { name: 'チェックつける/外す' }).click();

    await expect.poll(() => api.requests('POST', '/quiz/check').length).toBe(1);
    await expect(page.getByText('✅')).toBeHidden();
  });

  test('四択問題でチェック反転しても、選択肢の並びは変わらない', async ({ page, api }) => {
    api.on('GET', '/quiz/random', {
      json: {
        total: 1,
        quizzes: [
          {
            ...quizzes[1],
            format_id: 3,
            quiz_dummy_choice: [
              { dummy_choice_sentense: 'pending', is_corrected: false },
              { dummy_choice_sentense: 'rejected', is_corrected: false },
              { dummy_choice_sentense: 'settled', is_corrected: false }
            ]
          }
        ]
      }
    });
    api.on('POST', '/quiz/check', { status: 201, json: { checked: true } });

    await page.getByRole('button', { name: '出題設定を開く' }).click();
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByRole('button', { name: '出題スタート' }).click();
    await page.getByRole('button', { name: '答え' }).click();

    // 答えの文には、選択肢に割り当てられた記号が含まれる
    const answer = page.getByText(/^[A-D]: fulfilled/);
    const answerBefore = await answer.textContent();

    // 並び替えが偶然同じ結果になっても見逃さないよう、何度か反転する
    for (let i = 1; i <= 6; i++) {
      await page.getByRole('button', { name: 'チェックつける/外す' }).click();
      await expect.poll(() => api.requests('POST', '/quiz/check').length).toBe(i);
      await expect(page.getByText('✅')).toHaveCount(i % 2);
      await expect(answer).toHaveText(answerBefore ?? '');
    }
  });

  test('出題中の問題の編集アイコンから、その問題の編集画面に移る', async ({ page, api }) => {
    api.on('GET', '/quiz', { json: quizzes[0] });

    await page.getByRole('button', { name: '出題設定を開く' }).click();
    await page.getByLabel('問題ファイル').click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await page.getByRole('button', { name: '出題スタート' }).click();

    await page.getByRole('button', { name: '問題1-1を編集' }).click();

    await expect(page).toHaveURL(/\/quizzer\/editQuiz\/?\?file_num=1&quiz_num=1$/);
    await expect(page.getByLabel('問題文')).toHaveValue(quizzes[0].quiz_sentense);
  });

  test('問題ファイルを選ばないと出題スタートできない', async ({ page }) => {
    await page.getByRole('button', { name: '出題設定を開く' }).click();

    await expect(page.getByRole('button', { name: '出題スタート' })).toBeDisabled();
  });

  test.describe('画像の自動表示', () => {
    // ファイル名にURLで特別な意味を持つ文字(&,#,スペース)を含める
    const imgFile = 'a&b #1.png';
    // 「画像を自動表示」は出題後に表示されるので、1問目でONにして、画像付きの2問目に進む
    const goToQuizWithImage = async (page: Page, api: ApiMock) => {
      api.on('GET', '/quiz/random', {
        json: { total: 2, quizzes: [quizzes[0], { ...quizzes[1], img_file: imgFile }] }
      });
      await page.getByRole('button', { name: '出題設定を開く' }).click();
      await page.getByLabel('問題ファイル').click();
      await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
      await page.getByRole('button', { name: '出題スタート' }).click();
      await page.getByLabel('画像を自動表示').check();
      await page.getByRole('button', { name: '答え' }).click();
      await page.getByRole('button', { name: '正解!!' }).click();
      await expect(page.getByText(quizzes[1].quiz_sentense)).toBeVisible();
    };

    test('問題に画像があると取得して表示し、ファイル名はそのまま送られる', async ({ page, api }) => {
      api.on('GET', '/quiz/image', { json: { base64: 'iVBORw0KGgo=', mimeType: 'image/png' } });

      await goToQuizWithImage(page, api);

      await expect(page.getByAltText('取得した画像')).toHaveAttribute('src', 'data:image/png;base64,iVBORw0KGgo=');
      expect(api.requests('GET', '/quiz/image')[0].query).toEqual({ fileName: imgFile });
    });

    test('画像が見つからない場合は、エラー理由を表示して画像は出さない', async ({ page, api }) => {
      api.on('GET', '/quiz/image', {
        status: 404,
        json: { statusCode: 404, message: `画像が見つかりません(${imgFile})` }
      });

      await goToQuizWithImage(page, api);

      await expect(page.getByText(`画像が見つかりません(${imgFile})`)).toBeVisible();
      await expect(page.getByAltText('取得した画像')).toHaveCount(0);
    });
  });
});
