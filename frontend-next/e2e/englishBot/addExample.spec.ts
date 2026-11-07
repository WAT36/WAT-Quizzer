import type { Page } from '@playwright/test';
import { test, expect } from '../support/fixtures';
import { mockEnglishMasterData } from '../support/data';

test.describe('englishBot / 例文追加', () => {
  test.beforeEach(async ({ page, api }) => {
    mockEnglishMasterData(api);
    api.on('POST', '/english/example', { status: 201, json: {} });

    await page.goto('/englishBot/addExample/');
    await expect.poll(() => api.requests('GET', '/english/source').length).toBeGreaterThan(0);
  });

  test('例文と出典を入力して登録でき、登録後も出典は残る', async ({ page, api }) => {
    await page.getByLabel('例文(英語)').fill('She abandoned the plan.');
    await page.getByLabel('例文(和訳)').fill('彼女はその計画を断念した。');
    await page.getByRole('combobox', { name: '出典' }).click();
    await page.getByRole('option', { name: 'TOEIC' }).click();

    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect(page.getByText('例文を登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/example')[0].body).toEqual({
      exampleEn: 'She abandoned the plan.',
      exampleJa: '彼女はその計画を断念した。',
      wordName: '',
      sourceId: 1
    });
    await expect(page.getByLabel('例文(英語)')).toHaveValue('');
    await expect(page.getByRole('combobox', { name: '出典' })).toHaveText('TOEIC');
  });

  test('出典に「その他」を選ぶと、新しい出典名を入力して登録できる', async ({ page, api }) => {
    await page.getByLabel('例文(英語)').fill('She abandoned the plan.');
    await page.getByLabel('例文(和訳)').fill('彼女はその計画を断念した。');
    await page.getByRole('combobox', { name: '出典' }).click();
    await page.getByRole('option', { name: 'その他' }).click();
    await page.getByRole('textbox', { name: '出典', exact: true }).fill('洋書');

    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect(page.getByText('例文を登録しました')).toBeVisible();
    expect(api.requests('POST', '/english/example')[0].body).toMatchObject({
      sourceId: -2,
      newSourceName: '洋書'
    });
    // 登録後も、入力した出典名は残る
    await expect(page.getByRole('textbox', { name: '出典', exact: true })).toHaveValue('洋書');
  });

  test.describe('単語例文紐付け', () => {
    const examples = [
      { id: 11, en_example_sentense: 'She abandoned the plan.', ja_example_sentense: '彼女はその計画を断念した。' },
      { id: 12, en_example_sentense: 'They abandoned the ship.', ja_example_sentense: '彼らは船を捨てた。' }
    ];

    test.beforeEach(async ({ api }) => {
      api.on('GET', '/english/example', { status: 200, json: examples });
    });

    // 1行目はヘッダーの全選択なので、各行のチェックボックスを選ぶ
    const checkAllRows = async (page: Page) => {
      const grid = page.getByRole('grid');
      await expect(grid.getByText('They abandoned the ship.')).toBeVisible();
      await grid.getByRole('checkbox', { name: 'Select all rows' }).check();
    };

    test('選択した例文をまとめて1回のリクエストで紐付けられる', async ({ page, api }) => {
      api.on('POST', '/english/example/association', { status: 201, json: { count: 2 } });

      await page.getByLabel('例文に紐付ける単語名(完全一致)').fill('abandon');
      await page.getByLabel('例文検索(単語入力)').fill('abandon');
      await page.getByRole('button', { name: '例文検索(紐付用)' }).click();
      await checkAllRows(page);
      await page.getByRole('button', { name: '例文紐付' }).click();

      await expect(page.getByText('例文を紐付けました')).toBeVisible();
      const requests = api.requests('POST', '/english/example/association');
      expect(requests).toHaveLength(1);
      expect(requests[0].body).toEqual({ wordName: 'abandon', exampleIdList: [11, 12], isAssociation: true });
    });

    test('紐付いている例文を解除できる', async ({ page, api }) => {
      api.on('POST', '/english/example/association', { status: 201, json: { count: 2 } });

      await page.getByLabel('例文に紐付ける単語名(完全一致)').fill('abandon');
      await page.getByRole('button', { name: '例文検索(解除用)' }).click();
      await checkAllRows(page);
      await page.getByRole('button', { name: '例文解除' }).click();

      await expect(page.getByText('例文の紐付けを解除しました')).toBeVisible();
      expect(api.requests('POST', '/english/example/association')[0].body).toEqual({
        wordName: 'abandon',
        exampleIdList: [11, 12],
        isAssociation: false
      });
    });

    test('単語が存在せず失敗した時は、成功と表示せずエラー理由を表示する', async ({ page, api }) => {
      api.on('POST', '/english/example/association', {
        status: 404,
        json: { statusCode: 404, message: 'エラー：入力した単語名「abandonxは存在しません」' }
      });

      await page.getByLabel('例文に紐付ける単語名(完全一致)').fill('abandonx');
      await page.getByLabel('例文検索(単語入力)').fill('abandon');
      await page.getByRole('button', { name: '例文検索(紐付用)' }).click();
      await checkAllRows(page);
      await page.getByRole('button', { name: '例文紐付' }).click();

      await expect(page.getByText('エラー：入力した単語名「abandonxは存在しません」')).toBeVisible();
      await expect(page.getByText('例文を紐付けました')).toHaveCount(0);
    });
  });
});
