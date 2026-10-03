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
});
