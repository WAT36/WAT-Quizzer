import type { Page } from '@playwright/test';
import { test, expect } from '../support/fixtures';
import { createDummyAccessToken } from '../support/api-mock';
import { sources, wordTestData } from '../support/data';
import { LAST_USERNAME_STORAGE_KEY } from '../../src/constants/auth';

test.describe('認証 / ログイン', () => {
  test.beforeEach(({ api }) => {
    // ログインしていない状態(refreshTokenのCookieがない)にする
    api.on('POST', '/auth/refresh', { status: 401, json: {} });
  });

  test('ログインしていない状態で画面を開くと、ログイン画面に移る', async ({ page }) => {
    await page.goto('/quizzer/addQuiz/');

    await expect(page).toHaveURL(/\/login\/?$/);
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
  });

  test('ログインに成功するとトップ画面に移る', async ({ page, api }) => {
    api.on('POST', '/auth/signin', { json: { status: 'SUCCESS', accessToken: createDummyAccessToken() } });
    // トップ画面で読み込む格言・TODO
    api.on('GET', '/saying', { json: { id: 1, saying: '継続は力なり' } });
    api.on('GET', '/todo', { json: [] });
    api.on('GET', /^\/todo\/check-status\/\d{4}-\d{2}-\d{2}$/, { json: { completedTodoIds: [] } });

    await page.goto('/login/');
    await page.getByLabel('ユーザー名').fill('wat');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('継続は力なり')).toBeVisible();
    expect(api.requests('POST', '/auth/signin')[0].body).toEqual({ username: 'wat', password: 'password123' });
    // 再ログイン時に入力済みにするため、ユーザー名を覚えておく
    expect(await page.evaluate((key) => localStorage.getItem(key), LAST_USERNAME_STORAGE_KEY)).toBe('wat');
  });

  test('ログインに失敗すると、失敗した理由が表示される', async ({ page, api }) => {
    api.on('POST', '/auth/signin', {
      status: 401,
      json: { error: 'NotAuthorizedException', message: 'Incorrect username or password.' }
    });

    await page.goto('/login/');
    await page.getByLabel('ユーザー名').fill('wat');
    await page.getByLabel('パスワード').fill('wrong-password');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page.getByText('ログイン失敗: NotAuthorizedException - Incorrect username or password.')).toBeVisible();
    await expect(page).toHaveURL(/\/login\/?$/);
  });

  test('新しいパスワードが必要な場合は、パスワード設定のフォームが表示される', async ({ page, api }) => {
    api.on('POST', '/auth/signin', { json: { status: 'NEW_PASSWORD_REQUIRED', session: 'session-123', username: 'wat' } });

    await page.goto('/login/');
    await page.getByLabel('ユーザー名').fill('wat');
    await page.getByLabel('パスワード').fill('temporary-password');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page.getByText('新しいパスワードでログイン')).toBeVisible();
    await expect(page.getByLabel('新しいパスワード')).toBeVisible();
  });
});

// 再ログインのモーダルはMUIのModalで、role="dialog"を持たないため、MUIのクラス名と見出しで探す
const reauthModal = (page: Page) =>
  page.locator('.MuiModal-root').filter({ has: page.getByRole('heading', { name: '再ログイン' }) });

test.describe('認証 / 再ログイン', () => {
  const renewedToken = createDummyAccessToken('e2e-user-renewed');

  test.beforeEach(async ({ page, api }) => {
    // 画面を開いた時はログイン済みで、その後(単語取得時)に認証が切れる
    api.on('POST', '/auth/refresh', () =>
      api.requests('POST', '/auth/refresh').length === 1
        ? { json: { accessToken: createDummyAccessToken() } }
        : { status: 401, json: {} }
    );
    api.on('GET', '/english/source', { json: sources });
    // 再ログインで新しいトークンに変わるまでは401を返す
    api.on('GET', '/english/word/test', ({ headers }) =>
      headers.authorization === `Bearer ${renewedToken}` ? { json: wordTestData } : { status: 401, json: {} }
    );
    api.on('POST', '/auth/signin', { json: { status: 'SUCCESS', accessToken: renewedToken } });

    await page.addInitScript((key) => localStorage.setItem(key, 'wat'), LAST_USERNAME_STORAGE_KEY);
    await page.goto('/englishBot/testWord/');
  });

  test('操作中に認証が切れると再ログインのモーダルが出て、再ログイン後に元の操作が続けられる', async ({ page, api }) => {
    await page.getByRole('button', { name: 'Random Word' }).click();

    const modal = reauthModal(page);
    await expect(modal.getByText('認証の有効期限が切れました。再度ログインしてください')).toBeVisible();
    // 前回ログインしたユーザー名が入力済みになっている
    await expect(modal.getByLabel('ユーザー名')).toHaveValue('wat');

    await modal.getByLabel('パスワード').fill('password123');
    await modal.getByRole('button', { name: 'ログイン' }).click();

    await expect(modal).toBeHidden();
    // 失敗していた単語の取得が新しいトークンで再送され、画面が続きから表示される
    await expect(page.getByText('abandon')).toBeVisible();
    expect(api.requests('POST', '/auth/signin')[0].body).toEqual({ username: 'wat', password: 'password123' });
    // 画面は移動していない
    await expect(page).toHaveURL(/\/englishBot\/testWord\/$/);
  });

  test('再ログインをキャンセルすると、操作はエラーになる', async ({ page, api }) => {
    await page.getByRole('button', { name: 'Random Word' }).click();

    const modal = reauthModal(page);
    await expect(modal.getByText('認証の有効期限が切れました。再度ログインしてください')).toBeVisible();
    await modal.getByRole('button', { name: 'キャンセル' }).click();

    await expect(modal).toBeHidden();
    await expect(page.getByText('エラー:外部APIとの連携に失敗しました')).toBeVisible();
    expect(api.requests('POST', '/auth/signin')).toHaveLength(0);
  });
});
