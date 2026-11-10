import { readFileSync } from 'node:fs';
import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData } from '../support/data';

test.describe('quizzer / 設定', () => {
  test.beforeEach(async ({ page, api }) => {
    mockQuizzerMasterData(api);

    await page.goto('/quizzer/settings/');
  });

  test('各設定項目と小見出しが表示される', async ({ page }) => {
    for (const title of ['問題ファイル', '解答データ削除', '問題データCSVダウンロード', 'カテゴリ親子関係']) {
      await expect(page.locator('.MuiCardHeader-title').getByText(title, { exact: true })).toBeVisible();
    }
    for (const subheader of ['ファイル新規追加', 'ファイル削除']) {
      await expect(page.locator('.MuiCardHeader-subheader').getByText(subheader, { exact: true })).toBeVisible();
    }
  });

  test('問題ファイルを追加できる', async ({ page, api }) => {
    api.on('POST', '/quiz/file', { status: 201, json: {} });

    await page.getByLabel('新規ファイル名').fill('新しい問題集');
    await page.getByRole('button', { name: '追加', exact: true }).click();

    await expect.poll(() => api.requests('POST', '/quiz/file').length).toBe(1);
    expect(api.requests('POST', '/quiz/file')[0].body).toMatchObject({ file_nickname: '新しい問題集' });
  });

  test('カテゴリ親子関係でファイルを選ぶと、親子関係の追加と一覧が表示される', async ({ page, api }) => {
    api.on('GET', '/category/parent-child', { json: [] });
    api.on('GET', '/category/count', { json: [] });

    // 問題ファイルのプルダウンは、ファイル削除・解答データ削除・CSVダウンロード・カテゴリ親子関係の順に並ぶ
    await page.getByRole('combobox').nth(3).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    await expect(page.locator('.MuiCardHeader-subheader').getByText('親子関係追加')).toBeVisible();
    await expect(page.locator('.MuiCardHeader-subheader').getByText('登録済み親子関係')).toBeVisible();
    await expect(page.getByLabel('親カテゴリ')).toBeVisible();
  });

  test('ファイルを選んでCSVをダウンロードでき、中身はAPIのレスポンスと同じになる', async ({ page, api }) => {
    const csv = '"file_num","quiz_num","quiz_sentense"\n1,1,"Promiseとは？"';
    api.on('GET', '/quiz/file/csv', { text: csv });

    // 問題ファイルのプルダウンは、ファイル削除・解答データ削除・CSVダウンロード・カテゴリ親子関係の順に並ぶ
    await page.getByRole('combobox').nth(2).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'CSVダウンロード' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('export.csv');
    const path = await download.path();
    expect(readFileSync(path, 'utf-8')).toBe(csv);
    await expect(page.getByText('CSVダウンロードに成功しました')).toBeVisible();
    expect(api.requests('GET', '/quiz/file/csv')[0].query).toEqual({ file_num: '1' });
  });

  test('ファイルを選ばずにCSVダウンロードを押すと、エラーを表示してAPIは呼ばない', async ({ page, api }) => {
    await page.getByRole('button', { name: 'CSVダウンロード' }).click();

    await expect(page.getByText('エラー:問題ファイルを選択して下さい')).toBeVisible();
    expect(api.requests('GET', '/quiz/file/csv')).toHaveLength(0);
  });
});
