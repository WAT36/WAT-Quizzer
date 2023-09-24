import { CategoryService } from './category.service';
import * as Dao from '../../lib/db/dao';
jest.mock('../../lib/db/dao');

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });

  // カテゴリリスト取得 正常系
  it('getCategoryList - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = {
      file_num: 0,
      category: 'categorytest',
      created_at: '2000-01-01 00:00:00',
      updated_at: '2000-01-01 00:00:00',
      deleted_at: null,
    };
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await categoryService.getCategoryList(0)).toBe(testResult);
  });

  // カテゴリリスト取得 異常系
  it('getCategoryList - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(categoryService.getCategoryList(0)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // カテゴリ総入れ替え 正常系
  it('replaceAllCategory - OK', async () => {
    // テストデータ 正常時の返り値
    const testCategoryResult = [
      {
        category: 'カテゴリ',
      },
    ];
    const testResult = [
      {
        result: 'OK',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testCategoryResult);
    jest.spyOn(Dao, 'execTransaction').mockResolvedValueOnce(testResult);
    expect(
      await categoryService.replaceAllCategory({
        file_num: 0,
      }),
    ).toBe(testResult);
  });

  // カテゴリ総入れ替え 異常系
  it('replaceAllCategory - NG', async () => {
    // jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
    //   throw Error('error test by jest.');
    // });
    jest
      .spyOn(Dao, 'execQuery')
      .mockRejectedValueOnce(new Error('error test by jest.'));
    await expect(
      categoryService.replaceAllCategory({
        file_num: 0,
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // カテゴリ正解率取得 正常系
  it('getAccuracyRateByCategory - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await categoryService.getAccuracyRateByCategory(0)).toEqual([
      {
        result: testResult,
        checked_result: testResult,
      },
    ]);
  });
});
