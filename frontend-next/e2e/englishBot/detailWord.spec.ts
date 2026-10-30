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

  test('更新後の単語情報の取り直しに失敗しても、画面はそのまま表示してエラーを出す', async ({ page, api }) => {
    api.on('POST', '/english/word/check/toggle', { status: 201, json: {} });
    // チェック反転の後に取り直したときは失敗する
    api.on('GET', `/english/word/${wordDetail.id}`, () =>
      api.requests('POST', '/english/word/check/toggle').length > 0 ? { status: 500, json: {} } : { json: wordDetail }
    );

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: 'チェック反転' }).click();

    await expect(page.getByText('エラー:外部APIとの連携に失敗しました')).toBeVisible();
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();
    await expect(page.getByText('捨てる、見捨てる')).toBeVisible();
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

  test('意味を更新すると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('PATCH', `/english/word/${wordDetail.id}`, { json: {} });
    // 意味更新の後に取り直したときは、更新後の意味になっている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('PATCH', `/english/word/${wordDetail.id}`).length > 0
          ? { ...wordDetail, mean: [{ ...wordDetail.mean[0], meaning: '見捨てる' }, wordDetail.mean[1]] }
          : wordDetail
    }));

    await expect(page.getByText('捨てる、見捨てる')).toBeVisible();

    // 編集途中で閉じても、開き直すと元の意味に戻っている
    await page.getByRole('button', { name: '編集' }).first().click();
    await page.getByLabel('意味', { exact: true }).fill('途中まで入力');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '編集' }).first().click();
    await expect(page.getByLabel('意味', { exact: true })).toHaveValue('捨てる、見捨てる');

    await page.getByLabel('意味', { exact: true }).fill('見捨てる');
    await page.getByRole('button', { name: '意味更新' }).click();

    await expect(page.getByText('見捨てる', { exact: true })).toBeVisible();
    expect(api.requests('PATCH', `/english/word/${wordDetail.id}`)[0].body).toEqual({
      wordId: wordDetail.id,
      wordMeanId: 1,
      meanId: 1,
      partofspeechId: 1,
      meaning: '見捨てる'
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('意味を追加すると、既存の最大wordmean_id+1で登録される', async ({ page, api }) => {
    api.on('PATCH', `/english/word/${wordDetail.id}`, { json: {} });

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: '意味追加' }).click();
    // 新規追加では削除できない
    await expect(page.getByRole('button', { name: '意味削除' })).toBeDisabled();
    await page.getByRole('combobox', { name: '品詞' }).click();
    await page.getByRole('option', { name: '名詞' }).click();
    await page.getByLabel('意味', { exact: true }).fill('放棄');
    await page.getByRole('button', { name: '意味追加' }).last().click();

    await expect(page.getByLabel('意味', { exact: true })).toBeHidden();
    expect(api.requests('PATCH', `/english/word/${wordDetail.id}`)[0].body).toEqual({
      wordId: wordDetail.id,
      wordMeanId: 3,
      meanId: -1,
      partofspeechId: 2,
      meaning: '放棄'
    });
    // 単語情報の取り直しは非同期のため、呼ばれるまで待つ
    await expect.poll(() => api.requests('GET', `/english/word/${wordDetail.id}`).length).toBe(2);
  });

  test('意味を削除すると、削除APIが呼ばれて単語情報を取り直す', async ({ page, api }) => {
    api.on('DELETE', '/english/word/mean', { json: {} });

    await expect(page.getByText('自由奔放')).toBeVisible();

    await page.getByRole('button', { name: '編集' }).nth(1).click();
    await page.getByRole('button', { name: '意味削除' }).click();

    await expect(page.getByLabel('意味', { exact: true })).toBeHidden();
    expect(api.requests('DELETE', '/english/word/mean')[0].body).toEqual({ meanId: 2 });
    // 単語情報の取り直しは非同期のため、呼ばれるまで待つ
    await expect.poll(() => api.requests('GET', `/english/word/${wordDetail.id}`).length).toBe(2);
  });

  test('出典を更新すると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('POST', '/english/word/source', { status: 201, json: {} });
    // 出典更新の後に取り直したときは、更新後の出典になっている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('POST', '/english/word/source').length > 0
          ? { ...wordDetail, word_source: [{ source: { id: 2, name: '英検準1級' } }] }
          : wordDetail
    }));

    await expect(page.getByText('TOEIC', { exact: true })).toBeVisible();

    // 出典の編集ボタンは、意味(2件)の編集ボタンの後に並ぶ
    await page.getByRole('button', { name: '編集' }).nth(2).click();
    await expect(page.getByRole('combobox', { name: '出典' })).toHaveText('TOEIC');
    await page.getByRole('combobox', { name: '出典' }).click();
    await page.getByRole('option', { name: '英検準1級' }).click();
    await page.getByRole('button', { name: '出典更新' }).click();

    await expect(page.getByText('英検準1級', { exact: true })).toBeVisible();
    expect(api.requests('POST', '/english/word/source')[0].body).toEqual({
      wordId: wordDetail.id,
      oldSourceId: 1,
      newSourceId: 2
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('出典を追加すると、oldSourceId=-1で登録APIが呼ばれる', async ({ page, api }) => {
    api.on('POST', '/english/word/source', { status: 201, json: {} });

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: '出典追加', exact: true }).click();
    // 新規追加では削除できない
    await expect(page.getByRole('button', { name: '出典削除' })).toBeDisabled();
    await expect(page.getByRole('combobox', { name: '出典' })).toHaveText('選択なし');
    await page.getByRole('combobox', { name: '出典' }).click();
    await page.getByRole('option', { name: '英検準1級' }).click();
    await page.getByRole('button', { name: '出典追加', exact: true }).last().click();

    await expect(page.getByRole('combobox', { name: '出典' })).toBeHidden();
    expect(api.requests('POST', '/english/word/source')[0].body).toEqual({
      wordId: wordDetail.id,
      oldSourceId: -1,
      newSourceId: 2
    });
    // 単語情報の取り直しは非同期のため、呼ばれるまで待つ
    await expect.poll(() => api.requests('GET', `/english/word/${wordDetail.id}`).length).toBe(2);
  });

  test('出典を削除すると、削除APIが呼ばれて単語情報を取り直す', async ({ page, api }) => {
    api.on('DELETE', '/english/word/source', { json: {} });

    await expect(page.getByText('TOEIC', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: '編集' }).nth(2).click();
    await page.getByRole('button', { name: '出典削除' }).click();

    await expect(page.getByRole('combobox', { name: '出典' })).toBeHidden();
    expect(api.requests('DELETE', '/english/word/source')[0].body).toEqual({ word_id: wordDetail.id, source_id: 1 });
    // 単語情報の取り直しは非同期のため、呼ばれるまで待つ
    await expect.poll(() => api.requests('GET', `/english/word/${wordDetail.id}`).length).toBe(2);
  });

  test('サブ出典を更新すると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('POST', '/english/word/subsource', { status: 201, json: {} });
    // サブ出典更新の後に取り直したときは、更新後のサブ出典になっている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('POST', '/english/word/subsource').length > 0
          ? { ...wordDetail, word_subsource: [{ ...wordDetail.word_subsource[0], subsource: '公式問題集 Part6' }] }
          : wordDetail
    }));

    await expect(page.getByText('公式問題集 Part5')).toBeVisible();

    // サブ出典の編集ボタンは、意味(2件)・出典(1件)の編集ボタンの後に並ぶ
    await page.getByRole('button', { name: '編集' }).nth(3).click();
    await expect(page.getByLabel('サブ出典', { exact: true })).toHaveValue('公式問題集 Part5');
    await page.getByLabel('サブ出典', { exact: true }).fill('公式問題集 Part6');
    await page.getByRole('button', { name: 'サブ出典更新' }).click();

    await expect(page.getByText('公式問題集 Part6')).toBeVisible();
    expect(api.requests('POST', '/english/word/subsource')[0].body).toEqual({
      id: 1,
      wordId: wordDetail.id,
      subSource: '公式問題集 Part6'
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });

  test('サブ出典を追加すると、id=-1で登録APIが呼ばれる', async ({ page, api }) => {
    api.on('POST', '/english/word/subsource', { status: 201, json: {} });

    await expect(page.getByRole('heading', { level: 1, name: 'abandon' })).toBeVisible();

    await page.getByRole('button', { name: 'サブ出典追加' }).click();
    // 新規追加では削除できない
    await expect(page.getByRole('button', { name: 'サブ出典削除' })).toBeDisabled();
    await page.getByLabel('サブ出典', { exact: true }).fill('金のフレーズ');
    await page.getByRole('button', { name: 'サブ出典追加' }).last().click();

    await expect(page.getByLabel('サブ出典', { exact: true })).toBeHidden();
    expect(api.requests('POST', '/english/word/subsource')[0].body).toEqual({
      id: -1,
      wordId: wordDetail.id,
      subSource: '金のフレーズ'
    });
    // 単語情報の取り直しは非同期のため、呼ばれるまで待つ
    await expect.poll(() => api.requests('GET', `/english/word/${wordDetail.id}`).length).toBe(2);
  });

  test('サブ出典を削除すると、削除APIが呼ばれて単語情報を取り直す', async ({ page, api }) => {
    api.on('DELETE', '/english/word/subsource', { json: {} });

    await expect(page.getByText('公式問題集 Part5')).toBeVisible();

    await page.getByRole('button', { name: '編集' }).nth(3).click();
    await page.getByRole('button', { name: 'サブ出典削除' }).click();

    await expect(page.getByLabel('サブ出典', { exact: true })).toBeHidden();
    expect(api.requests('DELETE', '/english/word/subsource')[0].body).toEqual({ id: 1 });
    // 単語情報の取り直しは非同期のため、呼ばれるまで待つ
    await expect.poll(() => api.requests('GET', `/english/word/${wordDetail.id}`).length).toBe(2);
  });

  test('類義語を追加すると、更新後の単語情報を取り直して表示される', async ({ page, api }) => {
    api.on('POST', '/english/word/synonym', { status: 201, json: {} });
    // 類義語追加の後に取り直したときは、追加した類義語が含まれている
    api.on('GET', `/english/word/${wordDetail.id}`, () => ({
      json:
        api.requests('POST', '/english/word/synonym').length > 0
          ? {
              ...wordDetail,
              synonym_original: [
                ...wordDetail.synonym_original,
                { word_id: 7, synonym_word_id: 12, synonym_word: { name: 'forsake' } }
              ]
            }
          : wordDetail
    }));

    await expect(page.getByText('desert')).toBeVisible();

    await page.getByRole('button', { name: '類義語追加' }).click();
    // 元の単語と同じ名前は入力できない
    await page.getByLabel('類義語名').fill('abandon');
    await expect(page.getByText('元の単語は入力できません')).toBeVisible();
    await expect(page.getByRole('button', { name: '類義語追加' }).last()).toBeDisabled();

    await page.getByLabel('類義語名').fill('forsake');
    await page.getByRole('button', { name: '類義語追加' }).last().click();

    await expect(page.getByText('forsake')).toBeVisible();
    expect(api.requests('POST', '/english/word/synonym')[0].body).toEqual({
      wordId: wordDetail.id,
      synonymWordName: 'forsake'
    });
    expect(api.requests('GET', `/english/word/${wordDetail.id}`)).toHaveLength(2);
  });
});
