import { CategoryApiResponse } from '../../../interfaces/db';
import { CategoryService } from './category.service';
jest.mock('./category.service');

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });

  it('getCategoryList - OK', async () => {
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
});
