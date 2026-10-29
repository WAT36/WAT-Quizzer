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
});
