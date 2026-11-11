import { test, expect } from './support/fixtures';

const saying = { id: 3, saying: '継続は力なり', explanation: '続けることが大切', selfhelp_book: { name: '名言集' } };

test.describe('格言', () => {
  test('トップ画面を開くとランダムな格言が表示され、更新で取り直せる', async ({ page, api }) => {
    api.on('GET', '/saying', { json: saying });
    api.on('GET', '/todo', { json: [] });
    api.on('GET', /^\/todo\/check-status\/\d{4}-\d{2}-\d{2}$/, { json: { completedTodoIds: [] } });

    await page.goto('/');

    await expect(page.getByText(saying.saying)).toBeVisible();
    await expect(page.getByText(saying.selfhelp_book.name)).toBeVisible();
    // ランダム取得は条件を付けずに呼ぶ
    expect(api.requests('GET', '/saying')[0].query).toEqual({});

    api.on('GET', '/saying', { json: { ...saying, id: 4, saying: '急がば回れ' } });
    await page.getByRole('button', { name: '更新', exact: true }).click();
    await expect(page.getByText('急がば回れ')).toBeVisible();
  });

  test.describe('格言編集', () => {
    test.beforeEach(async ({ page, api }) => {
      api.on('GET', '/saying/book', { json: [] });
      api.on('GET', '/todo', { json: [] });
      api.on('GET', '/todo/all', { json: [] });

      await page.goto('/settings/');
    });

    test('IDを指定して取得すると、その格言が編集欄に読み込まれる', async ({ page, api }) => {
      api.on('GET', '/saying/3', { json: saying });

      await page.getByLabel('格言ID').fill('3');
      await page.getByRole('button', { name: '取得', exact: true }).click();

      await expect(page.getByLabel('格言　　：')).toHaveValue(saying.saying);
      await expect(page.getByText('ID:3')).toBeVisible();
    });

    test('IDを空にして取得すると、ランダムな格言を読み込まずにエラーを表示する', async ({ page, api }) => {
      await page.getByLabel('格言ID').fill('3');
      await page.getByLabel('格言ID').fill('');
      await page.getByRole('button', { name: '取得', exact: true }).click();

      await expect(page.getByText('エラー:入力したIDが不正です:0')).toBeVisible();
      expect(api.requests('GET', '/saying')).toHaveLength(0);
      await expect(page.getByLabel('格言　　：')).toHaveValue('');
    });
  });
});
