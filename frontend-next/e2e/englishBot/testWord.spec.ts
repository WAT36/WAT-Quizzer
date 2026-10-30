import { test, expect } from '../support/fixtures';
import { sources, wordTestData } from '../support/data';

test.describe('englishBot / 英単語テスト', () => {
  test.beforeEach(async ({ page, api }) => {
    api.on('GET', '/english/source', { json: sources });
    api.on('GET', '/english/word/test', { json: wordTestData });
    api.on('POST', '/english/word/test/clear', { status: 201, json: {} });
    api.on('POST', '/english/word/test/fail', { status: 201, json: {} });

    await page.goto('/englishBot/testWord/');
  });

  test('単語を出題し、答えを確認して正解を登録できる', async ({ page, api }) => {
    const answerButton = page.getByRole('button', { name: '答え' });
    await expect(answerButton).toBeHidden();

    await page.getByRole('button', { name: 'Random Word' }).click();

    expect(api.requests('GET', '/english/word/test')[0].query).toMatchObject({ format: 'random' });
    await expect(page.getByText('対象単語数：全120件')).toBeVisible();
    await expect(page.getByText('abandon')).toBeVisible();

    await answerButton.click();
    await expect(page.getByText('[動詞]捨てる、見捨てる')).toBeVisible();

    await page.getByRole('button', { name: '正解!!' }).click();

    await expect(page.getByText('正解+1! 登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/word/test/clear')[0].body).toEqual({ wordId: 501, testType: 0 });
    // 登録が終わると出題内容がリセットされる
    await expect(answerButton).toBeHidden();
  });

  test('条件に合う単語がないときは、エラーを表示して出題しない', async ({ page, api }) => {
    api.on('GET', '/english/word/test', { status: 404, json: {} });

    await page.getByRole('button', { name: 'Random Word' }).click();

    await expect(page.getByText('エラー:条件に合致するデータはありません')).toBeVisible();
    await expect(page.getByRole('button', { name: '答え' })).toBeHidden();
  });

  test('不正解を登録できる', async ({ page, api }) => {
    await page.getByRole('button', { name: 'Random Word' }).click();
    await page.getByRole('button', { name: '答え' }).click();
    await page.getByRole('button', { name: '不正解...' }).click();

    await expect(page.getByText('不正解+1.. 登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/word/test/fail')[0].body).toEqual({ wordId: 501, testType: 0 });
  });

  test('出典を指定してLRUで出題すると、条件がAPIに渡される', async ({ page, api }) => {
    await page.getByLabel('出典').click();
    await page.getByRole('option', { name: 'TOEIC' }).click();
    await page.getByRole('button', { name: 'LRU' }).click();

    await expect(page.getByText('abandon')).toBeVisible();
    expect(api.requests('GET', '/english/word/test')[0].query).toMatchObject({ format: 'lru', source: '1' });
  });

  test('出典が1件だけでも選択できる', async ({ page, api }) => {
    api.on('GET', '/english/source', { json: [sources[1]] });
    await page.reload();

    await page.getByLabel('出典').click();
    await page.getByRole('option', { name: sources[1].name }).click();
    await page.getByRole('button', { name: 'Random Word' }).click();

    expect(api.requests('GET', '/english/word/test')[0].query).toMatchObject({ source: String(sources[1].id) });
  });

  test('意味当てテストでは、意味を出題して答えで単語を表示する', async ({ page, api }) => {
    // 画面の処理が動き出してから(出典一覧の取得後に)テスト形式を切り替える
    await expect.poll(() => api.requests('GET', '/english/source').length).toBeGreaterThan(0);
    await page.getByLabel('意味当て').check();
    await page.getByRole('button', { name: 'Random Word' }).click();

    await expect(page.getByText('[動詞]捨てる、見捨てる')).toBeVisible();
    // 答えを開くまで単語は表示しない
    await expect(page.getByText('abandon')).toBeHidden();

    await page.getByRole('button', { name: '答え' }).click();
    await expect(page.getByText('abandon')).toBeVisible();
    await page.getByRole('button', { name: '正解!!' }).click();

    await expect(page.getByText('正解+1! 登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/word/test/clear')[0].body).toEqual({ wordId: 501, testType: 2 });
  });

  test('四択テストでは、選んだ選択肢で正解・不正解を登録する', async ({ page, api }) => {
    api.on('GET', '/english/word/test', {
      json: {
        ...wordTestData,
        correct: { mean: '捨てる、見捨てる' },
        dummy: [{ mean: '受け入れる' }, { mean: '保つ' }, { mean: '始める' }]
      }
    });

    // 画面の処理が動き出してから(出典一覧の取得後に)テスト形式を切り替える
    await expect.poll(() => api.requests('GET', '/english/source').length).toBeGreaterThan(0);
    await page.getByLabel('四択').check();
    // ほかのラジオボタンのグループの選択は外れない
    await expect(page.getByRole('radio', { name: 'Word', exact: true })).toBeChecked();
    await page.getByRole('button', { name: 'Random Word' }).click();

    await expect(page.getByText('abandon')).toBeVisible();
    await page.getByLabel('保つ').check();
    await page.getByRole('button', { name: 'SUBMIT' }).click();

    await expect(page.getByText('不正解+1.. 登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/word/test/fail')[0].body).toEqual({ wordId: 501, testType: 1 });
  });
});
