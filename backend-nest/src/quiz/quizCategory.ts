import { Prisma } from '@prisma/client';

// 問題を有効なカテゴリ付きで返す際のinclude条件
export const includeActiveCategories = {
  category_quiz: {
    where: { deleted_at: null },
    select: { category: { select: { name: true } } },
  },
} satisfies Prisma.quizInclude;

// カテゴリ名からカテゴリを取得・作成する（削除済みなら復活させる）
export const upsertCategory = (
  tx: Prisma.TransactionClient,
  name: string,
  file_num: number,
) =>
  tx.category.upsert({
    where: { name_file_num: { name, file_num } },
    update: { deleted_at: null },
    create: { name, file_num },
  });

// 問題にカテゴリを紐付ける（カテゴリマスターへの登録、削除済みの紐付けの復活も行う）
export const linkCategories = async (
  tx: Prisma.TransactionClient,
  quiz_id: number,
  file_num: number,
  names: string[],
) => {
  for (const name of names) {
    const { id: category_id } = await upsertCategory(tx, name, file_num);
    await tx.category_quiz.upsert({
      where: { quiz_id_category_id: { quiz_id, category_id } },
      update: { deleted_at: null },
      create: { quiz_id, category_id },
    });
  }
};

// 新しく登録した問題に、カテゴリとその祖先カテゴリ（親・親の親…）をすべて紐付ける
// カテゴリ・祖先カテゴリが削除済みなら復活させる。同じカテゴリは1回だけ紐付ける
// ※紐付けを新規作成するので、カテゴリが未紐付けの問題(新規登録した問題)に使うこと
export const linkNewQuizCategoriesWithAncestors = async (
  tx: Prisma.TransactionClient,
  quiz_id: number,
  file_num: number,
  names: string[],
) => {
  const linkedCategoryIds = new Set<number>();
  const link = async (category_id: number) => {
    linkedCategoryIds.add(category_id);
    await tx.category_quiz.create({ data: { quiz_id, category_id } });
  };

  // 指定されたカテゴリを登録・紐付けし、祖先を辿るキューに入れる
  const queue: number[] = [];
  for (const name of names) {
    const { id } = await upsertCategory(tx, name, file_num);
    if (!linkedCategoryIds.has(id)) {
      await link(id);
    }
    queue.push(id);
  }

  // 幅優先探索で祖先カテゴリをすべて紐付ける
  while (queue.length > 0) {
    const parentRelations = await tx.category_parent_child.findMany({
      where: { child_category_id: queue.shift(), deleted_at: null },
      include: { parent_category: true },
    });
    for (const { parent_category } of parentRelations) {
      if (linkedCategoryIds.has(parent_category.id)) continue;
      await tx.category.update({
        where: { id: parent_category.id },
        data: { deleted_at: null },
      });
      await link(parent_category.id);
      queue.push(parent_category.id);
    }
  }
};

// 問題に紐付いたカテゴリのうち、削除されていないもののカテゴリ名
export const activeCategoryNames = (
  category_quiz: { deleted_at: Date | null; category: { name: string } }[],
) => category_quiz.filter((cq) => !cq.deleted_at).map((cq) => cq.category.name);
