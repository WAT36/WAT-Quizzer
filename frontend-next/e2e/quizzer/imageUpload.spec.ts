import { test, expect } from '../support/fixtures';

const file = (name: string, mimeType: string, size = 10) => ({ name, mimeType, buffer: Buffer.alloc(size) });

test.describe('quizzer / 画像アップロード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quizzer/imageUpload/');
  });

  test('画像をアップロードできる', async ({ page, api }) => {
    api.on('POST', '/quiz/image/upload', { status: 201, json: { fileName: 'a.png' } });

    await page
      .getByLabel('画像ファイルを選択')
      .setInputFiles([file('a.png', 'image/png'), file('b.jpg', 'image/jpeg')]);

    await expect(page.getByText('2件のアップロードが完了しました')).toBeVisible();
    expect(api.requests('POST', '/quiz/image/upload')).toHaveLength(2);
  });

  test('WebP・AVIFの画像もアップロードできる', async ({ page, api }) => {
    api.on('POST', '/quiz/image/upload', { status: 201, json: { fileName: 'a.png' } });

    await page
      .getByLabel('画像ファイルを選択')
      .setInputFiles([file('a.webp', 'image/webp'), file('b.avif', 'image/avif')]);

    await expect(page.getByText('2件のアップロードが完了しました')).toBeVisible();
    expect(api.requests('POST', '/quiz/image/upload')).toHaveLength(2);
  });

  test('アップロードに失敗した場合は、完了ではなくエラーを表示する', async ({ page, api }) => {
    api.on('POST', '/quiz/image/upload', () =>
      api.requests('POST', '/quiz/image/upload').length === 1 ? { status: 201, json: { fileName: 'a.png' } } : { status: 500, json: {} }
    );

    await page.getByLabel('画像ファイルを選択').setInputFiles([file('a.png', 'image/png'), file('b.png', 'image/png')]);

    await expect(page.getByText('エラー：2件中1件のアップロードに失敗しました')).toBeVisible();
    await expect(page.getByText('アップロードが完了しました')).toBeHidden();
  });

  test('APIが本文を文字列で返しても、201なら完了を表示する', async ({ page, api }) => {
    api.on('POST', '/quiz/image/upload', { status: 201, text: 'a.png' });

    await page.getByLabel('画像ファイルを選択').setInputFiles(file('a.png', 'image/png'));

    await expect(page.getByText('1件のアップロードが完了しました')).toBeVisible();
  });

  test('アップロードに失敗した場合は、失敗したファイル名とエラー理由を表示する', async ({ page, api }) => {
    api.on('POST', '/quiz/image/upload', { status: 400, json: { statusCode: 400, message: 'アップロードできない形式のファイルです' } });

    await page.getByLabel('画像ファイルを選択').setInputFiles(file('a.png', 'image/png'));

    await expect(
      page.getByText('エラー：1件中1件のアップロードに失敗しました（a.png: アップロードできない形式のファイルです）')
    ).toBeVisible();
  });

  test('画像以外のファイルはアップロードしない', async ({ page, api }) => {
    await page.getByLabel('画像ファイルを選択').setInputFiles(file('a.pdf', 'application/pdf'));

    await expect(
      page.getByText('エラー：5MB以下のPNG・JPEG・GIF・WebP・AVIF画像のみアップロードできます')
    ).toBeVisible();
    expect(api.requests('POST', '/quiz/image/upload')).toHaveLength(0);
  });

  test('5MBを超える画像はアップロードしない', async ({ page, api }) => {
    await page.getByLabel('画像ファイルを選択').setInputFiles(file('a.png', 'image/png', 5 * 1024 * 1024 + 1));

    await expect(
      page.getByText('エラー：5MB以下のPNG・JPEG・GIF・WebP・AVIF画像のみアップロードできます')
    ).toBeVisible();
    expect(api.requests('POST', '/quiz/image/upload')).toHaveLength(0);
  });
});
