import { Prisma } from '@prisma/client';
import { linkNewQuizCategoriesWithAncestors } from './quizCategory';

describe('linkNewQuizCategoriesWithAncestors', () => {
  // カテゴリの親子関係: A(1)→C(3), B(2)→C(3)・A(1), C(3)→D(4)
  const parents: Record<number, number[]> = { 1: [3], 2: [3, 1], 3: [4] };
  const createTx = () => {
    const ids: Record<string, number> = { A: 1, B: 2 };
    return {
      category: {
        upsert: jest.fn(({ create }) =>
          Promise.resolve({ id: ids[create.name] }),
        ),
        update: jest.fn(),
      },
      category_quiz: { create: jest.fn() },
      category_parent_child: {
        findMany: jest.fn(({ where }) =>
          Promise.resolve(
            (parents[where.child_category_id] ?? []).map((id) => ({
              parent_category: { id },
            })),
          ),
        ),
      },
    };
  };

  it('指定カテゴリと祖先カテゴリを重複なく紐付け、祖先カテゴリは削除済みなら復活させる', async () => {
    const tx = createTx();
    await linkNewQuizCategoriesWithAncestors(
      tx as unknown as Prisma.TransactionClient,
      10,
      1,
      ['A', 'B', 'A'],
    );
    expect(tx.category_quiz.create.mock.calls.map(([arg]) => arg.data)).toEqual(
      [
        { quiz_id: 10, category_id: 1 },
        { quiz_id: 10, category_id: 2 },
        { quiz_id: 10, category_id: 3 },
        { quiz_id: 10, category_id: 4 },
      ],
    );
    expect(tx.category.update.mock.calls.map(([arg]) => arg.where.id)).toEqual([
      3, 4,
    ]);
    expect(tx.category.upsert).toHaveBeenCalledWith({
      where: { name_file_num: { name: 'A', file_num: 1 } },
      update: { deleted_at: null },
      create: { name: 'A', file_num: 1 },
    });
  });
});
