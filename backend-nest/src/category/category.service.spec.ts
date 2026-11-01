import { CategoryService } from './category.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    answer_log: {
      findMany: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    category_parent_child: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    category_quiz: {
      findMany: jest.fn(),
    },
    category_view: {
      findMany: jest.fn(),
    },
    quiz_view: {
      groupBy: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
  };
});

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });

  // カテゴリリスト取得 正常系
  it('getCategoryList - OK', async () => {
    // DBから返るデータ（nameプロパティ）
    const dbResult = [{ name: 'categorytest' }];
    // 期待するレスポンス（categoryプロパティにマップされる）
    const expectedResult = [{ category: 'categorytest' }];
    (prisma.category as any).findMany.mockResolvedValue(dbResult);
    expect(await categoryService.getCategoryList(0)).toEqual(expectedResult);
  });

  // カテゴリリスト取得 異常系
  it('getCategoryList - NG', async () => {
    (prisma.category as any).findMany.mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(categoryService.getCategoryList(0)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // カテゴリ正解率取得 正常系
  it('getAccuracyRateByCategory - OK', async () => {
    (prisma.answer_log.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.category_view.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.quiz_view.groupBy as jest.Mock).mockResolvedValue([]);
    expect(await categoryService.getAccuracyRateByCategory(0)).toEqual({
      all_result: [
        {
          accuracy_rate: 0,
          count: 0,
          sum_clear: 0,
          sum_fail: 0,
        },
      ],
      checked_result: [
        {
          accuracy_rate: 0,
          checked: true,
          count: 0,
          sum_clear: 0,
          sum_fail: 0,
        },
      ],
      result: [],
    });
  });

  // カテゴリ正解率取得 異常系
  it('getAccuracyRateByCategory - NG', async () => {
    (prisma.category_view.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      categoryService.getAccuracyRateByCategory(0),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // カテゴリ親子関係追加 正常系（削除済みの親子関係は復活させる）
  it('addCategoryParentChild - OK (restore deleted relation)', async () => {
    (prisma.category.findFirst as jest.Mock)
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 });
    (prisma.category_parent_child.findFirst as jest.Mock).mockResolvedValue(
      null,
    );
    const record = {
      id: 10,
      parent_category_id: 1,
      child_category_id: 2,
      deleted_at: null,
    };
    (prisma.category_parent_child.upsert as jest.Mock).mockResolvedValue(
      record,
    );
    (prisma.category_quiz.findMany as jest.Mock).mockResolvedValue([]);
    expect(
      await categoryService.addCategoryParentChild(0, 'parent', 'child'),
    ).toEqual(record);
    expect(prisma.category_parent_child.upsert).toHaveBeenCalledWith({
      where: {
        parent_category_id_child_category_id: {
          parent_category_id: 1,
          child_category_id: 2,
        },
      },
      create: { parent_category_id: 1, child_category_id: 2 },
      update: { deleted_at: null },
    });
  });

  // カテゴリ親子関係追加 異常系（有効な親子関係が既に存在する）
  it('addCategoryParentChild - NG (already exists)', async () => {
    (prisma.category.findFirst as jest.Mock)
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 });
    (prisma.category_parent_child.findFirst as jest.Mock).mockResolvedValue({
      id: 10,
    });
    (prisma.category_parent_child.upsert as jest.Mock).mockClear();
    await expect(
      categoryService.addCategoryParentChild(0, 'parent', 'child'),
    ).rejects.toMatchObject({ status: 409 });
    expect(prisma.category_parent_child.upsert).not.toHaveBeenCalled();
  });
});
