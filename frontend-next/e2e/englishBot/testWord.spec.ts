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
});
