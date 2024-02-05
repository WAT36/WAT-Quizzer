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
});
