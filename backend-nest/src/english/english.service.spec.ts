import { EnglishService } from './english.service';
import * as Dao from '../../lib/db/dao';
jest.mock('../../lib/db/dao');

describe('EnglishService', () => {
  let englishService: EnglishService;

  beforeEach(() => {
    englishService = new EnglishService();
  });

  // 品詞リスト取得 正常系
  it('getPartsofSpeechService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        name: '品詞テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await englishService.getPartsofSpeechService()).toEqual(testResult);
  });

  // 品詞リスト取得 異常系
  it('getPartsofSpeechService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishService.getPartsofSpeechService(),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 出典リスト取得 正常系
  it('getSourceService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        name: '出典テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await englishService.getSourceService()).toEqual(testResult);
  });

  // 出典リスト取得 異常系
  it('getSourceService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(englishService.getSourceService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
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
      await englishService.addWordAndMeanService({
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
      englishService.addWordAndMeanService({
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
    expect(await englishService.searchWordService('searchWord')).toEqual(
      testResult,
    );
  });

  // 単語検索 異常系
  it('searchWordService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishService.searchWordService('searchWord'),
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
    expect(await englishService.getAllWordService()).toEqual(testResult);
  });

  // 単語全取得 異常系
  it('getAllWordService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(englishService.getAllWordService()).rejects.toMatchObject({
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
    expect(await englishService.getWordByIdService(0)).toEqual(testResult);
  });

  // IDから単語情報取得 異常系
  it('getWordByIdService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(englishService.getWordByIdService(0)).rejects.toMatchObject({
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
    expect(await englishService.getWordByNameService('test')).toEqual(
      testResult,
    );
  });

  // 単語名から単語情報取得 異常系
  it('getWordByNameService - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      englishService.getWordByNameService('test'),
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
      await englishService.editWordMeanService({
        wordId: 0,
        wordMeanId: 0,
        meanId: 0,
        partofspeechId: 0,
        meaning: '意味テスト',
        sourceId: 0,
      }),
    ).toEqual({ result: testResult });
  });
});
