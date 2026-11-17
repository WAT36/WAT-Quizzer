import { readFileSync } from 'node:fs';
import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData, quizFiles } from '../support/data';

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

  test('sessionStorageに保存した問題ファイル一覧の形が違う場合は、APIから取り直す', async ({ page, api }) => {
    await page.addInitScript(() => sessionStorage.setItem('fileName', JSON.stringify({ file_num: 'abc' })));
    await page.reload();

    await page.getByRole('combobox').nth(0).click();
    await expect(page.getByRole('option', { name: 'プログラミング基礎問題集' })).toBeVisible();
    expect(api.requests('GET', '/quiz/file').length).toBeGreaterThan(0);
    // 取り直した一覧で保存し直す
    const saved = await page.evaluate(() => sessionStorage.getItem('fileName'));
    expect(JSON.parse(saved ?? 'null')).toEqual(expect.arrayContaining([expect.objectContaining({ file_num: 1 })]));
  });

  test('カテゴリ親子関係で親・子カテゴリを選ばずに追加すると、エラーを表示してAPIは呼ばない', async ({ page, api }) => {
    api.on('GET', '/category/parent-child', { json: [] });
    api.on('GET', '/category/count', { json: [] });

    await page.getByRole('combobox').nth(3).click();
    await page.getByRole('option', { name: 'プログラミング基礎問題集' }).click();
    await expect(page.getByLabel('親カテゴリ')).toBeVisible();
    // 追加ボタンは、ファイル新規追加・親子関係追加の順に並ぶ
    await page.getByRole('button', { name: '追加', exact: true }).last().click();

    await expect(page.getByText('エラー:親カテゴリを選択して下さい')).toBeVisible();
    expect(api.requests('POST', '/category/parent-child')).toHaveLength(0);
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

  test('ファイル名を入力せずに問題ファイルを追加すると、エラーを表示してAPIは呼ばない', async ({ page, api }) => {
    await page.getByRole('button', { name: '追加', exact: true }).click();

    await expect(page.getByText('エラー:ファイル名を入力してください')).toBeVisible();
    expect(api.requests('POST', '/quiz/file')).toHaveLength(0);
  });

  test('ファイルを選ばずにファイル削除・解答データ削除をすると、エラーを表示してAPIは呼ばない', async ({
    page,
    api
  }) => {
    // 削除ボタンは、ファイル削除・解答データ削除の順に並ぶ
    await page.getByRole('button', { name: '削除', exact: true }).nth(0).click();
    await page.getByRole('dialog').getByRole('button', { name: '削除', exact: true }).click();
    await expect(page.getByText('エラー:問題ファイルを選択して下さい')).toBeVisible();

    await page.getByRole('button', { name: '削除', exact: true }).nth(1).click();
    await page.getByRole('dialog').getByRole('button', { name: '削除', exact: true }).click();
    await expect(page.getByText('エラー:問題ファイルを選択して下さい')).toBeVisible();

    expect(api.requests('DELETE', '/quiz/file')).toHaveLength(0);
    expect(api.requests('PATCH', '/quiz/answer_log/file')).toHaveLength(0);
  });

  test('ファイルを追加すると、設定画面と他の画面のファイル一覧に追加したファイルが出る', async ({ page, api }) => {
    const added = { file_num: 3, file_name: 'go', file_nickname: 'Go言語' };
    api.on('POST', '/quiz/file', { status: 201, json: added });
    // 追加した後に取り直したときは、追加したファイルが含まれている
    api.on('GET', '/quiz/file', () => ({
      json: api.requests('POST', '/quiz/file').length > 0 ? [...quizFiles, added] : quizFiles
    }));

    await page.getByLabel('新規ファイル名').fill('Go言語');
    await page.getByRole('button', { name: '追加', exact: true }).first().click();
    await expect(page.getByText('新規ファイル「Go言語」を追加しました')).toBeVisible();

    // 問題ファイルのプルダウンは、ファイル削除・解答データ削除・CSVダウンロード・カテゴリ親子関係の順に並ぶ
    await page.getByRole('combobox').nth(0).click();
    await expect(page.getByRole('option', { name: 'Go言語' })).toBeVisible();
    await page.keyboard.press('Escape');
    // 追加の結果のメッセージは、一覧の取り直しで消えない
    await expect(page.getByText('新規ファイル「Go言語」を追加しました')).toBeVisible();

    await page.goto('/quizzer/addQuiz/');
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await expect(page.getByRole('option', { name: 'Go言語' })).toBeVisible();
  });

  test('ファイルを削除すると、設定画面と他の画面のファイル一覧から消える', async ({ page, api }) => {
    api.on('DELETE', '/quiz/file', { json: {} });
    // 削除した後に取り直したときは、削除したファイルが含まれていない
    api.on('GET', '/quiz/file', () => ({
      json: api.requests('DELETE', '/quiz/file').length > 0 ? quizFiles.slice(0, 1) : quizFiles
    }));

    await page.getByRole('combobox').nth(0).click();
    await page.getByRole('option', { name: 'AWS認定試験対策' }).click();
    await page.getByRole('button', { name: '削除', exact: true }).nth(0).click();
    await page.getByRole('dialog').getByRole('button', { name: '削除', exact: true }).click();
    await expect(page.getByText('ファイルを削除しました(id:2)')).toBeVisible();

    await page.getByRole('combobox').nth(1).click();
    await expect(page.getByRole('option', { name: 'プログラミング基礎問題集' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'AWS認定試験対策' })).toHaveCount(0);
    await page.keyboard.press('Escape');

    await page.goto('/quizzer/addQuiz/');
    await page.getByLabel('問題ファイル', { exact: true }).click();
    await expect(page.getByRole('option', { name: 'プログラミング基礎問題集' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'AWS認定試験対策' })).toHaveCount(0);
  });
});
