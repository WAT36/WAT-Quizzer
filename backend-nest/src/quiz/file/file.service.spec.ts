import * as Dao from '../../../lib/db/dao';
import { QuizFileService } from './file.service';
jest.mock('../../../lib/db/dao');

describe('QuizFileService', () => {
  let quizFileService: QuizFileService;

  beforeEach(() => {
    quizFileService = new QuizFileService();
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
    expect(await quizFileService.getFileList()).toEqual(testResult);
  });

  // ファイル名リスト取得 異常系
  it('getFileList - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizFileService.getFileList()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル追加 正常系1
  it('addFile - OK', async () => {
    // テストデータ
    const req = {
      file_name: 'ファイル名',
      file_nickname: '通称',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizFileService.addFile(req)).toEqual(testResult);
  });

  // ファイル追加 異常系1
  it('addFile - NG1', async () => {
    // テストデータ
    const req = {
      file_name: 'ファイル名',
      file_nickname: '通称',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizFileService.addFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル削除 正常系1
  it('deleteFile - OK', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execTransaction').mockResolvedValue(testResult);
    expect(await quizFileService.deleteFile(req)).toEqual({
      result: testResult,
    });
  });

  // ファイル削除 異常系1
  it('deleteFile - NG1', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    jest.spyOn(Dao, 'execTransaction').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizFileService.deleteFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
