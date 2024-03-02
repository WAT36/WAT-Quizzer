import { EnglishWordService } from './word.service';
import * as Dao from '../../../lib/db/dao';
jest.mock('../../../lib/db/dao');

describe('EnglishWordService', () => {
  let englishWordService: EnglishWordService;

  beforeEach(() => {
    englishWordService = new EnglishWordService();
  });

  // 単語と意味追加 正常系
  it('addWordAndMeanService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    jest.spyOn(Dao, 'execTransaction').mockResolvedValue(testResult);
    expect(
      await englishWordService.addWordAndMeanService({
        wordName: 'testWord',
        pronounce: 'testPronounce',
        meanArrayData: [],
      }),
    ).toEqual(testResult);
  });

  // 単語と意味追加 異常系
  it('addWordAndMeanService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishWordService.addWordAndMeanService({
        wordName: 'testWord',
        pronounce: 'testPronounce',
        meanArrayData: [],
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語検索 正常系
  it('searchWordService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await englishWordService.searchWordService('searchWord')).toEqual(
      testResult,
    );
  });

  // 単語検索 異常系
  it('searchWordService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishWordService.searchWordService('searchWord'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語全取得 正常系
  it('getAllWordService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await englishWordService.getAllWordService()).toEqual(testResult);
  });

  // 単語全取得 異常系
  it('getAllWordService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(englishWordService.getAllWordService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // IDから単語情報取得 正常系
  it('getWordByIdService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await englishWordService.getWordByIdService(0)).toEqual(testResult);
  });

  // IDから単語情報取得 異常系
  it('getWordByIdService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishWordService.getWordByIdService(0),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語名から単語情報取得 正常系
  it('getWordByNameService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await englishWordService.getWordByNameService('test')).toEqual(
      testResult,
    );
  });

  // 単語名から単語情報取得 異常系
  it('getWordByNameService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishWordService.getWordByNameService('test'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語の意味などを更新 正常系
  it('editWordMeanService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    jest.spyOn(Dao, 'execTransaction').mockResolvedValue(testResult);
    expect(
      await englishWordService.editWordMeanService({
        wordId: 0,
        wordMeanId: 0,
        meanId: 0,
        partofspeechId: 0,
        meaning: '意味テスト',
      }),
    ).toEqual(testResult);
  });

  // 単語の意味などを更新 異常系
  it('editWordMeanService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishWordService.editWordMeanService({
        wordId: 0,
        wordMeanId: 0,
        meanId: 0,
        partofspeechId: 0,
        meaning: '意味テスト',
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
