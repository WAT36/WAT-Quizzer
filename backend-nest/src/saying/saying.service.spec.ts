import * as Dao from '../../lib/db/dao';
import { SayingService } from './saying.service';
jest.mock('../../lib/db/dao');

describe('SayingService', () => {
  let sayingService: SayingService;

  beforeEach(() => {
    sayingService = new SayingService();
  });

  // 格言ランダム取得 正常系
  it('getRandomSaying - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        saying: '格言テスト',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await sayingService.getRandomSaying()).toEqual(testResult);
  });

  // 格言ランダム取得 異常系
  it('getRandomSaying - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.getRandomSaying()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 啓発本追加 正常系
  it('addBookService - OK', async () => {
    // テストデータ
    const req = {
      book_name: '本の名前',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        saying: '格言テスト',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await sayingService.addBookService(req)).toEqual(testResult);
  });

  // 啓発本追加 異常系
  it('addBookService - NG', async () => {
    // テストデータ
    const req = {
      book_name: '本の名前',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.addBookService(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 啓発本リスト取得 正常系
  it('getBookListService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        saying: '格言テスト',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await sayingService.getBookListService()).toEqual(testResult);
  });

  // 啓発本リスト取得 異常系
  it('getBookListService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.getBookListService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 格言追加 正常系
  it('addSayingService - OK', async () => {
    // テストデータ
    const req = {
      book_id: 0,
      saying: '格言',
      explanation: '説明',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        book_saying_id: 0,
        saying: '格言テスト',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await sayingService.addSayingService(req)).toEqual(testResult);
  });
});
