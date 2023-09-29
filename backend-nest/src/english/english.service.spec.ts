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
});
