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
    };
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

  // カテゴリ総入れ替え 正常系
  it('replaceAllCategory - OK', async () => {
    // テストデータ 正常時の返り値
    const testCategoryResult = [
      {
        result: 'OK',
      },
    ];
    jest
      .spyOn(categoryService, 'replaceAllCategory')
      .mockResolvedValueOnce(testCategoryResult);
    expect(
      await categoryService.replaceAllCategory({
        file_num: 0,
      }),
    ).toBe(testCategoryResult);
  });
});
