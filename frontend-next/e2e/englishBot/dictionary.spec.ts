import { test, expect } from '../support/fixtures';

const searchResult = [
  {
    id: 7,
    name: 'abandon',
    pronounce: 'əˈbændən',
    mean: [{ meaning: '捨てる、見捨てる' }]
  }
];

test.describe('englishBot / 辞書', () => {
  test.beforeEach(async ({ page, api }) => {
    api.on('GET', '/english/word/search', { json: searchResult });

    await page.goto('/englishBot/dictionary/');
  });

  test('単語名で検索すると、検索結果が表示される', async ({ page, api }) => {
    await page.getByLabel('単語名検索').fill('aban');
    await page.getByRole('button', { name: '検索' }).click();

    await expect(page.getByText('捨てる、見捨てる')).toBeVisible();
    expect(api.requests('GET', '/english/word/search')[0].query).toMatchObject({ wordName: 'aban' });
  });

  test('サブ出典だけを入力しても検索できる', async ({ page, api }) => {
    await page.getByLabel('Sub Source').fill('Part5');
    await page.getByRole('button', { name: '検索' }).click();

    await expect(page.getByText('捨てる、見捨てる')).toBeVisible();
    expect(api.requests('GET', '/english/word/search')[0].query).toMatchObject({ subSourceName: 'Part5' });
  });

  test('検索条件を何も入力せずに検索すると、エラーを表示してAPIは呼ばない', async ({ page, api }) => {
    await page.getByRole('button', { name: '検索' }).click();

    await expect(page.getByText('エラー:検索語句を入力して下さい')).toBeVisible();
    expect(api.requests('GET', '/english/word/search')).toHaveLength(0);
  });
});
