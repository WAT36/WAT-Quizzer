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

// 問題に紐付いたカテゴリのうち、削除されていないもののカテゴリ名
export const activeCategoryNames = (
  category_quiz: { deleted_at: Date | null; category: { name: string } }[],
) => category_quiz.filter((cq) => !cq.deleted_at).map((cq) => cq.category.name);
