import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FUTURE_DAY,
  GetAccuracyRateByCategoryAPIResponseDto,
  PAST_DAY,
  prisma,
} from 'quizzer-lib';
import { Prisma } from '@prisma/client';
import { formatIdCondition } from '../common/formatId';

@Injectable()
export class CategoryService {
  // カテゴリリスト(ファイルごと)取得
  async getCategoryList(file_num: number) {
    const categories = await prisma.category.findMany({
      where: {
        file_num,
        deleted_at: null,
      },
      select: {
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    // レスポンス形式を維持（category プロパティ名で返す）
    return categories.map((c) => ({
      category: c.name,
    }));
  }

  // カテゴリ親子関係一覧取得
  async getCategoryParentChildList(file_num: number) {
    const records = await prisma.category_parent_child.findMany({
      where: {
        deleted_at: null,
        parent_category: {
          file_num,
          deleted_at: null,
        },
      },
      include: {
        parent_category: {
          select: { name: true },
        },
        child_category: {
          select: { name: true },
        },
      },
      orderBy: [
        { parent_category: { name: 'asc' } },
        { child_category: { name: 'asc' } },
      ],
    });
    return records.map((r) => ({
      id: r.id,
      parent_category_id: r.parent_category_id,
      parent_category_name: r.parent_category.name,
      child_category_id: r.child_category_id,
      child_category_name: r.child_category.name,
    }));
  }

  // カテゴリ親子関係追加
  async addCategoryParentChild(
    file_num: number,
    parent_category: string,
    child_category: string,
  ) {
    try {
      const parent = await prisma.category.findFirst({
        where: { name: parent_category, file_num, deleted_at: null },
      });
      if (!parent) {
        throw new HttpException(
          `親カテゴリ「${parent_category}」が見つかりません`,
          HttpStatus.NOT_FOUND,
        );
      }
      const child = await prisma.category.findFirst({
        where: { name: child_category, file_num, deleted_at: null },
      });
      if (!child) {
        throw new HttpException(
          `子カテゴリ「${child_category}」が見つかりません`,
          HttpStatus.NOT_FOUND,
        );
      }
      // 子カテゴリに持たせられる親カテゴリは一つまで。有効な親子関係があれば登録しない
      const existing = await prisma.category_parent_child.findFirst({
        where: {
          child_category_id: child.id,
          deleted_at: null,
        },
        include: {
          parent_category: {
            select: { name: true },
          },
        },
      });
      if (existing) {
        throw new HttpException(
          existing.parent_category_id === parent.id
            ? '既に登録されている親子関係です'
            : `子カテゴリ「${child_category}」は既に親カテゴリ「${existing.parent_category.name}」に紐づいているため登録できません`,
          HttpStatus.CONFLICT,
        );
      }
      // 削除は論理削除のため、過去に削除した親子関係はユニーク制約に残っている。その場合は復活させる
      const record = await prisma.category_parent_child.upsert({
        where: {
          parent_category_id_child_category_id: {
            parent_category_id: parent.id,
            child_category_id: child.id,
          },
        },
        create: {
          parent_category_id: parent.id,
          child_category_id: child.id,
        },
        update: { deleted_at: null },
      });

      // 子カテゴリが付与されている問題に親カテゴリが付与されていなければ付与する
      const quizzesWithChild = await prisma.category_quiz.findMany({
        where: { category_id: child.id, deleted_at: null },
        select: { quiz_id: true },
      });
      const quizIds = quizzesWithChild.map((q) => q.quiz_id);

      if (quizIds.length > 0) {
        // 既に親カテゴリが付与されている問題ID（deleted_at: null）
        const alreadyAssigned = await prisma.category_quiz.findMany({
          where: {
            category_id: parent.id,
            quiz_id: { in: quizIds },
            deleted_at: null,
          },
          select: { quiz_id: true },
        });
        const alreadyAssignedIds = new Set(
          alreadyAssigned.map((q) => q.quiz_id),
        );
        const missingIds = quizIds.filter((id) => !alreadyAssignedIds.has(id));

        for (const quiz_id of missingIds) {
          await prisma.category_quiz.upsert({
            where: { quiz_id_category_id: { quiz_id, category_id: parent.id } },
            create: { quiz_id, category_id: parent.id },
            update: { deleted_at: null },
          });
        }
      }

      return record;
    } catch (error: unknown) {
      // 一意制約違反は重複登録として409にする（それ以外は例外フィルタに任せる）
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          '既に登録されている親子関係です',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  // カテゴリ親子関係削除（ソフトデリート）
  async deleteCategoryParentChild(id: number) {
    const record = await prisma.category_parent_child.findFirst({
      where: { id, deleted_at: null },
    });
    if (!record) {
      throw new HttpException(
        '指定された親子関係が見つかりません',
        HttpStatus.NOT_FOUND,
      );
    }
    await prisma.category_parent_child.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { id };
  }

  // カテゴリ別問題数取得
  async getCategoryQuizCount(file_num: number) {
    const categories = await prisma.category.findMany({
      where: {
        file_num,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            category_quiz: {
              where: { deleted_at: null },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      count: c._count.category_quiz,
    }));
  }

  // 問題が紐付いていない空カテゴリを論理削除
  async cleanupEmptyCategories() {
    const emptyCategories = await prisma.category.findMany({
      where: {
        deleted_at: null,
        category_quiz: {
          none: {
            deleted_at: null,
          },
        },
      },
      select: { id: true },
    });

    if (emptyCategories.length === 0) {
      return { deleted_count: 0 };
    }

    const ids = emptyCategories.map((c) => c.id);
    await prisma.category.updateMany({
      where: { id: { in: ids } },
      data: { deleted_at: new Date() },
    });

    return { deleted_count: ids.length };
  }

  // カテゴリ正解率取得
  async getAccuracyRateByCategory(
    file_num: number,
    startDate?: Date,
    endDate?: Date,
    format_id?: number[],
  ) {
    // カテゴリビューから指定ファイルのカテゴリ毎の正解率取得
    const categorylogs = await prisma.answer_log.findMany({
      where: {
        quiz: {
          file_num,
          ...formatIdCondition(format_id),
        },
        created_at: {
          gte: startDate || PAST_DAY,
          lte: endDate || FUTURE_DAY,
        },
      },
      include: {
        quiz: {
          select: {
            file_num: true,
            category_quiz: {
              select: {
                deleted_at: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const allCategories = await prisma.category_view.findMany({
      select: {
        category: true,
      },
      where: {
        file_num,
      },
    });

    //Prismaではリレーションをまたいだ groupBy はできないため、データを取得後JSで集計する
    const categoryResultMap = new Map<
      string,
      { file_num: number; category: string; total: number; correct: number }
    >();
    for (const category of allCategories) {
      const key = `${String(file_num)}+${category.category}`;
      categoryResultMap.set(key, {
        file_num,
        category: category.category,
        total: 0,
        correct: 0,
      });
    }
    for (const log of categorylogs) {
      const file_num = log.quiz.file_num;
      const categories = log.quiz.category_quiz
        .filter((c) => !c.deleted_at)
        .map((c) => c.category.name ?? '未分類');

      for (const category of categories) {
        const key = `${file_num}+${category}`;
        if (!categoryResultMap.has(key)) {
          categoryResultMap.set(key, {
            file_num,
            category,
            total: 0,
            correct: 0,
          });
        }
        const entry = categoryResultMap.get(key)!;
        entry.total += 1;
        if (log.is_corrected === true) {
          entry.correct += 1;
        }
      }
    }

    // map から出力形式に変換
    const categoryResult = [...categoryResultMap.values()].map(
      ({ file_num, category, total, correct }) => ({
        file_num,
        category,
        count: total,
        accuracy_rate: total > 0 ? 100 * (correct / total) : 0,
      }),
    );

    // チェック済・全問題の正解率取得
    const checkedLogs = await prisma.answer_log.findMany({
      where: {
        quiz: {
          file_num,
          ...formatIdCondition(format_id),
        },
        created_at: {
          gte: startDate || PAST_DAY,
          lte: endDate || FUTURE_DAY,
        },
      },
      include: {
        quiz: {
          select: {
            checked: true,
            file_num: true,
          },
        },
      },
    });

    let total = 0;
    let correct = 0;

    let checkedOnlyTotal = 0;
    let checkedOnlyCorrect = 0;

    for (const log of checkedLogs) {
      const isCorrect = log.is_corrected === true;
      const isChecked = log.quiz.checked === true;

      // 全体の集計
      total += 1;
      if (isCorrect) correct += 1;

      // checked === true のみ
      if (isChecked) {
        checkedOnlyTotal += 1;
        if (isCorrect) checkedOnlyCorrect += 1;
      }
    }

    const result: GetAccuracyRateByCategoryAPIResponseDto = {
      result: categoryResult,
      checked_result: [
        {
          checked: true,
          count: checkedOnlyTotal,
          sum_clear: checkedOnlyCorrect,
          sum_fail: checkedOnlyTotal - checkedOnlyCorrect,
          accuracy_rate:
            100 *
            (checkedOnlyTotal > 0 ? checkedOnlyCorrect / checkedOnlyTotal : 0),
        },
      ],
      all_result: [
        {
          count: total,
          sum_clear: correct,
          sum_fail: total - correct,
          accuracy_rate: 100 * (total > 0 ? correct / total : 0),
        },
      ],
    };

    return result;
  }
}
