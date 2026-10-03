import type { Page } from '@playwright/test';
import { test, expect } from '../support/fixtures';
import { mockEnglishMasterData } from '../support/data';

// 意味の表の品詞プルダウン・品詞入力欄は、出典側の要素とidが重複している影響でラベルから正しく探せないため、
// 意味の入力欄と同じ行の中で探す
const meaningRow = (page: Page) => page.getByRole('row').filter({ has: page.getByLabel('意味') });
const meaningRowPosSelect = (page: Page) => meaningRow(page).getByRole('combobox');
const meaningRowPosInput = (page: Page) => meaningRow(page).locator('#input-pos-01');

test.describe('englishBot / 単語追加', () => {
  test.beforeEach(async ({ page, api }) => {
    mockEnglishMasterData(api);
    api.on('POST', '/english/word', { status: 201, json: {} });

    await page.goto('/englishBot/addWord/');
  });

  test('単語・出典・意味を入力して登録できる', async ({ page, api }) => {
    await page.getByLabel('New Word').fill('resilient');
    await page.getByRole('combobox', { name: '出典' }).click();
    await page.getByRole('option', { name: 'TOEIC' }).click();
    await page.getByLabel('サブ出典').fill('公式問題集 Part5');

    await page.getByRole('button', { name: '行追加' }).click();
    await meaningRowPosSelect(page).click();
    await page.getByRole('option', { name: '動詞' }).click();
    await page.getByLabel('意味').fill('回復力のある');

    await page.getByRole('button', { name: '登録' }).click();

    await expect(page.getByText('単語「resilient」を登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/word')[0].body).toEqual({
      inputWord: { wordName: 'resilient', sourceId: 1, subSourceName: '公式問題集 Part5' },
      pronounce: '',
      meanArrayData: [{ partOfSpeechId: 1, meaning: '回復力のある' }]
    });
    // 登録が終わると入力内容がリセットされる
    await expect(page.getByLabel('New Word')).toHaveValue('');
    await expect(page.getByLabel('意味')).toBeHidden();
  });

  test('品詞・出典に「その他」を選ぶと、新しい名前を入力して登録できる', async ({ page, api }) => {
    await page.getByLabel('New Word').fill('serendipity');
    await page.getByRole('combobox', { name: '出典' }).click();
    await page.getByRole('option', { name: 'その他' }).click();
    await page.getByRole('textbox', { name: '出典', exact: true }).fill('洋書');

    await page.getByRole('button', { name: '行追加' }).click();
    await meaningRowPosSelect(page).click();
    await page.getByRole('option', { name: 'その他' }).click();
    await meaningRowPosInput(page).fill('名詞(不可算)');
    await page.getByLabel('意味').fill('思いがけない幸運');

    await page.getByRole('button', { name: '登録' }).click();

    await expect(page.getByText('単語「serendipity」を登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/word')[0].body).toMatchObject({
      inputWord: { wordName: 'serendipity', sourceId: -2, newSourceName: '洋書' },
      meanArrayData: [{ partOfSpeechId: -2, partOfSpeechName: '名詞(不可算)', meaning: '思いがけない幸運' }]
    });
  });

  test('意味の品詞を選んでいない場合はエラーになり、登録しない', async ({ page, api }) => {
    await page.getByLabel('New Word').fill('resilient');
    await page.getByRole('button', { name: '行追加' }).click();
    await page.getByLabel('意味').fill('回復力のある');

    await page.getByRole('button', { name: '登録' }).click();

    await expect(page.getByText('エラー:1行目の品詞を入力してください')).toBeVisible();
    expect(api.requests('POST', '/english/word')).toHaveLength(0);
  });
});
