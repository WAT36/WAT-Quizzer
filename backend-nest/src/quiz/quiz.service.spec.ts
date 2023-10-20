import * as Dao from '../../lib/db/dao';
import { QuizService } from './quiz.service';
jest.mock('../../lib/db/dao');

describe('QuizService', () => {
  let quizService: QuizService;

  beforeEach(() => {
    quizService = new QuizService();
  });

  // ファイル名リスト取得 正常系
  it('getFileList - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 0,
        file_name: '品詞テスト',
        file_nickname: '品詞テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await quizService.getFileList()).toEqual(testResult);
  });

  // ファイル名リスト取得 異常系
  it('getFileList - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.getFileList()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
