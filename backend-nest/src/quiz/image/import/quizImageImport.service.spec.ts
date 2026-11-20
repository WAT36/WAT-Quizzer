import { prisma, putQuizImageToS3 } from 'quizzer-lib';
import { QuizImageImportService } from './quizImageImport.service';
import { DownloadError, downloadExternalFile } from './safeImageDownload';
import { signImageCandidate } from '../search/candidateSignature';

jest.mock('quizzer-lib', () => ({
  prisma: { quiz: { findFirst: jest.fn(), update: jest.fn() } },
  putQuizImageToS3: jest.fn(),
  generateAutoQuizImageFileName: (id: number, ext: string) =>
    `auto_q${id}_test.${ext}`,
  QUIZ_IMAGE_LIMITS: { MAX_FILE_SIZE_MB: 5 },
}));
jest.mock('./safeImageDownload', () => ({
  ...jest.requireActual('./safeImageDownload'),
  downloadExternalFile: jest.fn(),
}));

const png = Buffer.from('89504e470d0a1a0a0000', 'hex');
const jpg = Buffer.from('ffd8ffe000', 'hex');
const html = Buffer.from('<!doctype html>');
const IMAGE = 'https://a.example/x.png';
const THUMB = 'https://a.example/t.jpg';

describe('QuizImageImportService', () => {
  const service = new QuizImageImportService();
  const original = process.env.QUIZ_IMAGE_SIGNING_SECRET;
  const download = downloadExternalFile as jest.Mock;

  const request = (
    overrides: Partial<{
      image_url: string;
      thumbnail_url: string | null;
    }> = {},
  ) => {
    const target = { image_url: IMAGE, thumbnail_url: THUMB, ...overrides };
    return {
      quiz_id: 3,
      ...target,
      signature: signImageCandidate({
        quizId: 3,
        imageUrl: target.image_url,
        thumbnailUrl: target.thumbnail_url,
      }),
    };
  };

  beforeEach(() => {
    process.env.QUIZ_IMAGE_SIGNING_SECRET = 'test-secret';
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    (prisma.quiz.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
  });
  afterAll(() => {
    process.env.QUIZ_IMAGE_SIGNING_SECRET = original;
  });

  it('元画像を保存し、生成したファイル名を問題に紐付ける', async () => {
    download.mockResolvedValue({ body: png, contentType: 'text/plain' });
    expect(await service.importImage(request())).toEqual({
      fileName: 'auto_q3_test.png',
    });
    expect(download).toHaveBeenCalledTimes(1);
    expect(download).toHaveBeenCalledWith(IMAGE, { maxBytes: 5 * 1024 * 1024 });
    // Content-Typeではなく中身で判定した形式で保存する
    expect(putQuizImageToS3).toHaveBeenCalledWith(
      'auto_q3_test.png',
      png,
      'image/png',
    );
    expect(prisma.quiz.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { img_file: 'auto_q3_test.png' },
    });
  });

  it('元画像を取得できなければサムネイルで取り直す', async () => {
    download
      .mockRejectedValueOnce(new DownloadError('HTTP 403'))
      .mockResolvedValueOnce({ body: jpg, contentType: 'image/jpeg' });
    expect(await service.importImage(request())).toEqual({
      fileName: 'auto_q3_test.jpg',
    });
    expect(download).toHaveBeenLastCalledWith(THUMB, expect.anything());
  });

  it('元画像が画像でなければ（HTMLなど）サムネイルで取り直す', async () => {
    download
      .mockResolvedValueOnce({ body: html, contentType: 'image/png' })
      .mockResolvedValueOnce({ body: jpg, contentType: 'image/jpeg' });
    expect((await service.importImage(request())).fileName).toBe(
      'auto_q3_test.jpg',
    );
  });

  it('元画像もサムネイルも取得できなければ、元画像の理由付きの422で保存しない', async () => {
    download
      .mockRejectedValueOnce(new DownloadError('HTTP 403'))
      .mockRejectedValueOnce(new DownloadError('HTTP 404'));
    await expect(service.importImage(request())).rejects.toMatchObject({
      status: 422,
      message:
        'この画像は取得できませんでした(HTTP 403)。別の画像を選んでください',
    });
    expect(putQuizImageToS3).not.toHaveBeenCalled();
    expect(prisma.quiz.update).not.toHaveBeenCalled();
  });

  it('サムネイルがなければ取り直さずに422', async () => {
    download.mockResolvedValueOnce({ body: html, contentType: 'text/html' });
    await expect(
      service.importImage(request({ thumbnail_url: null })),
    ).rejects.toMatchObject({
      status: 422,
      message:
        'この画像は取得できませんでした(対応していない形式です)。別の画像を選んでください',
    });
    expect(download).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['署名が違う', { signature: 'x' }],
    ['元画像のURLを差し替えた', { image_url: 'http://169.254.169.254/' }],
    ['サムネイルのURLを差し替えた', { thumbnail_url: 'http://localhost/' }],
    ['別の問題の候補', { quiz_id: 4 }],
  ])('%sなら400で画像を取りに行かない', async (_, change) => {
    await expect(
      service.importImage({ ...request(), ...change }),
    ).rejects.toMatchObject({ status: 400 });
    expect(download).not.toHaveBeenCalled();
    expect(prisma.quiz.findFirst).not.toHaveBeenCalled();
  });

  it('問題がなければ404で画像を取りに行かない', async () => {
    (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(service.importImage(request())).rejects.toMatchObject({
      status: 404,
    });
    expect(download).not.toHaveBeenCalled();
  });

  it('S3への保存に失敗したら500で問題は更新しない', async () => {
    download.mockResolvedValue({ body: png, contentType: 'image/png' });
    (putQuizImageToS3 as jest.Mock).mockRejectedValue(
      new Error('Access Denied'),
    );
    await expect(service.importImage(request())).rejects.toMatchObject({
      status: 500,
      message: '画像の保存に失敗しました: Access Denied',
    });
    expect(prisma.quiz.update).not.toHaveBeenCalled();
  });

  it('想定外の例外（DownloadError以外）はそのまま投げる', async () => {
    download.mockRejectedValue(new TypeError('bug'));
    await expect(service.importImage(request())).rejects.toThrow('bug');
  });
});
