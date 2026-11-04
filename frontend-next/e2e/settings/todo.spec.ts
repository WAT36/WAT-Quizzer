import { test, expect } from '../support/fixtures';

const todos = [
  { id: 1, todo: '単語を覚える', deleted_at: null },
  { id: 2, todo: '問題を解く', deleted_at: null }
];
const deletedTodo = { id: 3, todo: '削除済みのTODO', deleted_at: '2024-01-01T00:00:00Z' };

test.describe('設定 / TODO', () => {
  test.beforeEach(async ({ page, api }) => {
    api.on('GET', '/saying/book', { json: [] });
    api.on('GET', '/todo', { json: todos });
    api.on('GET', '/todo/all', { json: [...todos, deletedTodo] });

    await page.goto('/settings/');
  });

  test('TODOを削除すると、削除APIが呼ばれて一覧を取り直す', async ({ page, api }) => {
    api.on('DELETE', '/todo/2', { json: {} });

    await page.getByRole('row', { name: '問題を解く' }).getByRole('button', { name: '削除' }).click();

    await expect.poll(() => api.requests('DELETE', '/todo/2').length).toBe(1);
    await expect.poll(() => api.requests('GET', '/todo').length).toBe(2);
  });

  test('削除済みのTODOは復元ボタンが表示され、復元すると一覧を取り直す', async ({ page, api }) => {
    api.on('PUT', '/todo/3/restore', { json: {} });

    await expect(page.getByRole('row', { name: '問題を解く' })).toBeVisible();
    await expect(page.getByRole('row', { name: '削除済みのTODO' })).toBeHidden();

    await page.getByLabel('削除済みも表示').check();
    await page.getByRole('row', { name: '削除済みのTODO' }).getByRole('button', { name: '復元' }).click();

    await expect.poll(() => api.requests('PUT', '/todo/3/restore').length).toBe(1);
    await expect.poll(() => api.requests('GET', '/todo/all').length).toBe(2);
  });
});
