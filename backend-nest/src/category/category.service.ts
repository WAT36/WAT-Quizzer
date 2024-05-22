import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export const prisma: PrismaClient = new PrismaClient();

@Injectable()
export class CategoryService {
  // カテゴリリスト(ファイルごと)取得
  async getCategoryList(file_num: number) {
    try {
      return await prisma.category_view.findMany({
        where: {
          file_num,
        },
        select: {
          category: true,
        },
        orderBy: {
          category: 'asc',
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // カテゴリ正解率取得
  async getAccuracyRateByCategory(file_num: number) {
    try {
      const result = {};

      // カテゴリビューから指定ファイルのカテゴリ毎の正解率取得
      const categoryResult = await prisma.category_view.findMany({
        where: {
          file_num,
        },
        orderBy: {
          accuracy_rate: 'asc',
        },
      });
      result['result'] = categoryResult.map((x) => {
        return {
          ...x,
          count: Number(x.count),
        };
      });

      // チェック済問題の正解率取得
      const checkedResult = await prisma.quiz_view.groupBy({
        by: ['checked'],
        where: {
          file_num,
          checked: true,
          deleted_at: null,
        },
        _sum: {
          clear_count: true,
          fail_count: true,
        },
        _count: {
          checked: true,
        },
      });
      result['checked_result'] = checkedResult.map((x) => {
        return {
          checked: x.checked,
          count: x._count.checked,
          sum_clear: Number(x._sum.clear_count),
          sum_fail: Number(x._sum.fail_count),
          accuracy_rate:
            100 *
            (Number(x._sum.clear_count) /
              (Number(x._sum.clear_count) + Number(x._sum.fail_count))),
        };
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
