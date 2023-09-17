import { CategoryApiResponse } from '../../../interfaces/db';
import { CategoryService } from './category.service';
jest.mock('./category.service');

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
    } as CategoryApiResponse;
    jest
      .spyOn(categoryService, 'getCategoryList')
      .mockResolvedValueOnce(testResult);
    expect(await categoryService.getCategoryList(0)).toBe(testResult);
  });

  // カテゴリリスト取得 異常系
  it('getCategoryList - NG', async () => {
    const httpError: Error = {
      message: 'error test by jest.',
      name: 'error',
    };
    jest
      .spyOn(categoryService, 'getCategoryList')
      .mockRejectedValueOnce(httpError);
    await expect(categoryService.getCategoryList(0)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
