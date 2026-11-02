import { test, expect } from '../support/fixtures';

test.describe('englishBot / トップ', () => {
  test.beforeEach(async ({ api }) => {
    api.on('GET', '/english/word/summary', {
      json: [
        { name: 'all', count: 30 },
        { name: 'word', count: 20 },
        { name: 'phrase', count: 10 }
      ]
    });
    api.on('GET', '/english/word/random', {
      json: {
        id: 7,
        name: 'abandon',
        pronounce: '',
        mean: [{ meaning: '捨てる、見捨てる', partsofspeech: { name: '動詞' } }],
        word_source: []
      }
    });
    api.on('GET', '/english/source/statistics', {
      json: [{ id: 1, name: 'TOEIC', clear_count: 5, fail_count: 3, count: 10, not_answered: 2, accuracy_rate: 0.6 }]
    });
    api.on('GET', '/english/word/test/statistics/week', {
      json: [
        { date: '2024-01-01', count: 15 },
        { date: '2024-01-02', count: 23 }
      ]
    });
  });

  test('各カードがそれぞれのデータを取得して表示する', async ({ page, api }) => {
    await page.goto('/englishBot/');

    await expect(page.getByText('abandon')).toBeVisible();
    await expect(page.getByText('[動詞] 捨てる、見捨てる')).toBeVisible();
    await expect(page.locator('canvas[aria-label="単熟語登録数グラフ"]')).toBeVisible();
    await expect(page.locator('canvas[aria-label="出典別正答率グラフ"]')).toBeVisible();
    await expect(page.locator('canvas[aria-label="過去１週間の回答数グラフ"]')).toBeVisible();
    await expect(page.getByLabel('読み込み中')).toHaveCount(0);

    // 各APIは1回ずつだけ呼ばれる
    expect(api.requests('GET', '/english/word/summary')).toHaveLength(1);
    expect(api.requests('GET', '/english/word/random')).toHaveLength(1);
    expect(api.requests('GET', '/english/source/statistics')).toHaveLength(1);
    expect(api.requests('GET', '/english/word/test/statistics/week')).toHaveLength(1);
  });
});
