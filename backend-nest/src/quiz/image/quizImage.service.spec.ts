import { QuizImageService } from './quizImage.service';
import { getQuizImageFromS3, uploadQuizImageToS3 } from 'quizzer-lib';

jest.mock('quizzer-lib', () => ({
  uploadQuizImageToS3: jest.fn(),
  getQuizImageFromS3: jest.fn(),
}));

describe('QuizImageService', () => {
  let quizImageService: QuizImageService;

  beforeEach(() => {
    quizImageService = new QuizImageService();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  // 画像アップロード 正常系 ファイル名をJSONで返せるようオブジェクトで返す
  it('uploadQuizImage - OK', async () => {
    (uploadQuizImageToS3 as jest.Mock).mockResolvedValueOnce('a.png');
    const file = { originalname: 'a.png' } as Express.Multer.File;
    expect(await quizImageService.uploadQuizImage(file)).toEqual({
      fileName: 'a.png',
    });
  });

  // 画像アップロード 異常系 ファイル未指定は400
  it('uploadQuizImage - NG no file', async () => {
    await expect(
      quizImageService.uploadQuizImage(
        undefined as unknown as Express.Multer.File,
      ),
    ).rejects.toMatchObject({ status: 400 });
  });

  // 画像アップロード 異常系 S3への送信失敗は理由付きの500
  it('uploadQuizImage - NG s3 error', async () => {
    (uploadQuizImageToS3 as jest.Mock).mockRejectedValueOnce(
      new Error('Access Denied'),
    );
    const file = { originalname: 'a.png' } as Express.Multer.File;
    await expect(quizImageService.uploadQuizImage(file)).rejects.toMatchObject({
      status: 500,
      message: '画像のアップロードに失敗しました(a.png): Access Denied',
    });
  });

  // 画像ダウンロード 正常系 base64と拡張子に応じたMIMEタイプを返す
  it('downloadQuizImage - OK', async () => {
    (getQuizImageFromS3 as jest.Mock).mockResolvedValueOnce(Buffer.from('abc'));
    expect(await quizImageService.downloadQuizImage('a.png')).toEqual({
      base64: Buffer.from('abc').toString('base64'),
      mimeType: 'image/png',
    });
  });

  // 画像ダウンロード 異常系 S3から取得できなければ404
  it('downloadQuizImage - NG', async () => {
    (getQuizImageFromS3 as jest.Mock).mockRejectedValueOnce(
      new Error('NoSuchKey'),
    );
    await expect(
      quizImageService.downloadQuizImage('a.png'),
    ).rejects.toMatchObject({
      status: 404,
      message: '画像が見つかりません(a.png)',
    });
  });
});
