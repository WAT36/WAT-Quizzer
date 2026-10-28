import type { GetWordDetailAPIResponseDto } from 'quizzer-lib';
import { test, expect } from '../support/fixtures';
import { mockEnglishMasterData } from '../support/data';

// 詳細ページはビルド時に作られるため、idはe2e/support/build.mjsで作るページの範囲(1〜40)にしておく
const wordDetail: GetWordDetailAPIResponseDto = {
  id: 7,
  name: 'abandon',
  pronounce: 'əˈbændən',
  checked: false,
  mean: [
    { id: 1, wordmean_id: 1, meaning: '捨てる、見捨てる', partsofspeech: { id: 1, name: '動詞' } },
    { id: 2, wordmean_id: 2, meaning: '自由奔放', partsofspeech: { id: 2, name: '名詞' } }
  ],
  word_source: [{ source: { id: 1, name: 'TOEIC' } }],
  word_subsource: [{ id: 1, subsource: '公式問題集 Part5', created_at: '2024-01-01T00:00:00Z' }],
  synonym_original: [{ word_id: 7, synonym_word_id: 8, synonym_word: { name: 'desert' } }],
  synonym_word: [],
  antonym_original: [{ word_id: 7, antonym_word_id: 9, antonym_word: { name: 'keep' } }],
  antonym_word: [],
  word_etymology: []
};

test.describe('englishBot / 単語詳細', () => {
  test.beforeEach(async ({ page, api }) => {
    mockEnglishMasterData(api);
    api.on('GET', `/english/word/${wordDetail.id}`, { json: wordDetail });

    await page.goto(`/englishBot/detailWord/${wordDetail.id}/`);
  });

  test('単語の意味・出典・類義語・対義語が表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await expect(page.getByText('[動詞]')).toBeVisible();
    await expect(page.getByText('捨てる、見捨てる')).toBeVisible();
    await expect(page.getByText('[名詞]')).toBeVisible();
    await expect(page.getByText('自由奔放')).toBeVisible();

    await expect(page.getByText('TOEIC', { exact: true })).toBeVisible();
    await expect(page.getByText('公式問題集 Part5')).toBeVisible();
    await expect(page.getByText('desert')).toBeVisible();
    await expect(page.getByText('keep')).toBeVisible();
  });

  test('チェック反転すると、更新後の単語情報を取り直して✅が付く', async ({ page, api }) => {
    api.on('POST', '/english/word/check/toggle', { status: 201, json: {} });
    // チェック反転の後に取り直したときは、チェック済みになっている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json: { ...wordDetail, checked: api.requests('POST', '/english/word/check/toggle').length > 0 }
    }));

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();
    await expect(page.getByText('✅')).toBeHidden();

    await page.getByRole('button', { name: 'チェック反転' }).click();

    await expect(page.getByText('✅')).toBeVisible();
    expect(api.requests('POST', '/english/word/check/toggle')[0].body).toEqual({ wordId: wordDetail.id });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('対義語を追加すると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('POST', '/english/word/antonym', { status: 201, json: {} });
    // 対義語追加の後に取り直したときは、追加した対義語が含まれている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('POST', '/english/word/antonym').length > 0
          ? {
              ...wordDetail,
              antonym_original: [
                ...wordDetail.antonym_original,
                { word_id: 7, antonym_word_id: 10, antonym_word: { name: 'retain' } }
              ]
            }
          : wordDetail
    }));

    await expect(page.getByText('keep')).toBeVisible();

    await page.getByRole('button', { name: '反意語追加' }).click();
    // 元の単語と同じ名前は入力できない
    await page.getByLabel('対義語名').fill('abandon');
    await expect(page.getByText('元の単語は入力できません')).toBeVisible();
    await expect(page.getByRole('button', { name: '対義語追加' })).toBeDisabled();

    await page.getByLabel('対義語名').fill('retain');
    await page.getByRole('button', { name: '対義語追加' }).click();

    await expect(page.getByText('retain')).toBeVisible();
    expect(api.requests('POST', '/english/word/antonym')[0].body).toEqual({
      wordId: wordDetail.id,
      antonymWordName: 'retain'
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('派生語を追加すると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('POST', '/english/word/derivative', { status: 201, json: {} });
    // 派生語追加の後に取り直したときは、追加した派生語が含まれている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('POST', '/english/word/derivative').length > 0
          ? {
              ...wordDetail,
              derivative: {
                derivative_group_id: 1,
                derivative_group: {
                  derivative: [
                    { word_id: wordDetail.id, word: { name: wordDetail.name } },
                    { word_id: 11, word: { name: 'abandonment' } }
                  ]
                }
              }
            }
          : wordDetail
    }));

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: '派生語追加' }).click();
    // 元の単語と同じ名前は入力できない
    await page.getByLabel('派生語名').fill('abandon');
    await expect(page.getByText('元の単語は入力できません')).toBeVisible();
    await expect(page.getByRole('button', { name: '派生語追加' }).last()).toBeDisabled();

    await page.getByLabel('派生語名').fill('abandonment');
    await page.getByRole('button', { name: '派生語追加' }).last().click();

    await expect(page.getByText('abandonment')).toBeVisible();
    expect(api.requests('POST', '/english/word/derivative')[0].body).toEqual({
      wordName: wordDetail.name,
      derivativeName: 'abandonment'
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('語源を紐付けると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('POST', '/english/word/etymology/link', { status: 201, json: {} });
    // 語源紐付けの後に取り直したときは、紐付けた語源が含まれている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('POST', '/english/word/etymology/link').length > 0
          ? { ...wordDetail, word_etymology: [{ etymology: { id: 1, name: 'ラテン語 bandon' } }] }
          : wordDetail
    }));

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: '語源紐付け' }).click();
    await page.getByLabel('語源名').fill('ラテン語 bandon');
    await page.getByRole('button', { name: '語源紐付け' }).last().click();

    await expect(page.getByText('ラテン語 bandon')).toBeVisible();
    expect(api.requests('POST', '/english/word/etymology/link')[0].body).toEqual({
      etymologyName: 'ラテン語 bandon',
      wordId: wordDetail.id
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('語源を新規登録すると、登録APIが呼ばれる', async ({ page, api }) => {
    api.on('POST', '/english/word/etymology', { status: 201, json: {} });

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: '語源追加' }).click();
    await page.getByLabel('語源名').fill('ラテン語 bandon');
    await page.getByRole('button', { name: '語源追加' }).last().click();

    await expect(page.getByLabel('語源名')).toBeHidden();
    expect(api.requests('POST', '/english/word/etymology')[0].body).toEqual({ etymologyName: 'ラテン語 bandon' });
    // 語源の新規登録だけでは単語への紐付けは行わないため、単語情報は取り直さない
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(1);
  });
});
