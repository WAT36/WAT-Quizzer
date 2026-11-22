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

  test.describe('画像を探して登録', () => {
    // 候補の画像は外部サイトにせず、画面と同じオリジンのURLをテスト内で返す
    const imageBase = 'http://127.0.0.1:3000/e2e-images';
    const candidates = [
      {
        image_url: `${imageBase}/a.png`,
        thumbnail_url: `${imageBase}/a-thumb.png`,
        source_url: 'https://example.com/a',
        caption: '候補Aの説明',
        signature: 'sig-a'
      },
      {
        image_url: `${imageBase}/b.png`,
        thumbnail_url: null,
        source_url: 'https://example.org/b',
        caption: '候補Bの説明',
        signature: 'sig-b'
      }
    ];

    // MUIのModalはrole="dialog"を持たないので、見出し(aria-labelledby)から付く名前でモーダルを特定する
    const imageSearchDialog = (page: Page) => page.getByLabel('画像を探して登録', { exact: true });

    const openImageSearch = async (page: Page) => {
      await page.route(`${imageBase}/**`, (route) =>
        route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from('iVBORw0KGgo=', 'base64') })
      );
      await page.getByRole('button', { name: '出題設定を開く' }).click();
      await page.getByLabel('問題ファイル').click();
      await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
      await page.getByRole('button', { name: '出題スタート' }).click();
      await page.getByRole('button', { name: '答え' }).click();
      await page.getByRole('button', { name: '画像を探して登録' }).click();
    };

    test('候補から1枚選んで登録すると、署名付きで登録し、すぐに画像を表示する', async ({ page, api }) => {
      api.on('GET', '/quiz/image/candidates', { json: { candidates } });
      api.on('POST', '/quiz/image/import', { status: 201, json: { fileName: 'auto_q101_x.png' } });
      api.on('GET', '/quiz/image', { json: { base64: 'iVBORw0KGgo=', mimeType: 'image/png' } });

      await openImageSearch(page);

      const dialog = imageSearchDialog(page);
      await expect(dialog.getByRole('heading', { name: '画像を探して登録' })).toBeVisible();
      // どの問題の画像を選んでいるか分かるよう、元の問題文と答えを表示する
      await expect(dialog.getByText(quizzes[0].quiz_sentense)).toBeVisible();
      await expect(dialog.getByText(quizzes[0].answer, { exact: true })).toBeVisible();
      // 開いた時に、追加指示なしで出題中の問題の候補を探す
      expect(api.requests('GET', '/quiz/image/candidates')[0].query).toEqual({ quiz_id: String(quizzes[0].id) });

      // 選ぶまでは登録できない
      await expect(dialog.getByRole('button', { name: 'この画像で登録' })).toBeDisabled();
      await dialog.getByRole('button', { name: /候補Bの説明/ }).click();
      await expect(dialog.getByRole('button', { name: /候補Bの説明/ })).toHaveAttribute('aria-pressed', 'true');
      await dialog.getByRole('button', { name: 'この画像で登録' }).click();

      await expect(imageSearchDialog(page)).toHaveCount(0);
      expect(api.requests('POST', '/quiz/image/import')[0].body).toEqual({
        quiz_id: quizzes[0].id,
        image_url: candidates[1].image_url,
        thumbnail_url: null,
        signature: 'sig-b'
      });
      // 自動表示がOFFでも、登録した画像をすぐ表示する
      await expect(page.getByAltText('取得した画像')).toHaveAttribute('src', 'data:image/png;base64,iVBORw0KGgo=');
      expect(api.requests('GET', '/quiz/image')[0].query).toEqual({ fileName: 'auto_q101_x.png' });
      await expect(page.getByText('画像を登録しました(auto_q101_x.png)')).toBeVisible();
      // 以降は差し替えになる
      await expect(page.getByRole('button', { name: '画像を探して差し替え' })).toBeVisible();
    });

    test('追加指示を入れて再検索すると、追加指示を付けて探し直す', async ({ page, api }) => {
      api.on('GET', '/quiz/image/candidates', { json: { candidates } });

      await openImageSearch(page);
      const dialog = imageSearchDialog(page);
      await expect(dialog.getByRole('button', { name: /候補Aの説明/ })).toBeVisible();

      await dialog.getByLabel('追加指示（任意）').fill('  図解で  ');
      await dialog.getByRole('button', { name: '再検索' }).click();

      await expect.poll(() => api.requests('GET', '/quiz/image/candidates').length).toBe(2);
      expect(api.requests('GET', '/quiz/image/candidates')[1].query).toEqual({
        quiz_id: String(quizzes[0].id),
        hint: '図解で'
      });
    });

    test('候補が見つからなければ、その旨を表示する', async ({ page, api }) => {
      api.on('GET', '/quiz/image/candidates', { json: { candidates: [] } });

      await openImageSearch(page);

      await expect(imageSearchDialog(page).getByText('画像の候補が見つかりませんでした。再検索するか')).toBeVisible();
    });

    test('選んだ画像を取得できなければ、理由を表示し、別の候補を選べるよう開いたままにする', async ({ page, api }) => {
      api.on('GET', '/quiz/image/candidates', { json: { candidates } });
      api.on('POST', '/quiz/image/import', {
        status: 422,
        json: { statusCode: 422, message: 'この画像は取得できませんでした(HTTP 403)。別の画像を選んでください' }
      });

      await openImageSearch(page);
      const dialog = imageSearchDialog(page);
      await dialog.getByRole('button', { name: /候補Aの説明/ }).click();
      await dialog.getByRole('button', { name: 'この画像で登録' }).click();

      await expect(page.getByText('この画像は取得できませんでした(HTTP 403)。別の画像を選んでください')).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'この画像で登録' })).toBeEnabled();
      await expect(page.getByAltText('取得した画像')).toHaveCount(0);
    });

    test('OpenAIのクレジットが不足していたら、その旨を表示する', async ({ page, api }) => {
      api.on('GET', '/quiz/image/candidates', {
        status: 402,
        json: { statusCode: 402, message: 'OpenAIのクレジットが不足しているため、画像を検索できません' }
      });

      await openImageSearch(page);

      await expect(
        imageSearchDialog(page).getByText(
          'エラー:OpenAIのクレジットが不足しているため、画像を検索できません。OpenAIの残高・利用上限を確認してください'
        )
      ).toBeVisible();
    });

    test('候補の検索に失敗したら、エラーを表示する', async ({ page, api }) => {
      api.on('GET', '/quiz/image/candidates', {
        status: 502,
        json: { statusCode: 502, message: '画像の検索に失敗しました: タイムアウトしました' }
      });

      await openImageSearch(page);

      // 5xxの理由は画面に出さず、共通のメッセージにする
      await expect(imageSearchDialog(page).getByText('エラー:外部APIとの連携に失敗しました')).toBeVisible();
    });
  });
});
