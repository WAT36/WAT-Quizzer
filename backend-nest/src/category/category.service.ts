import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReplaceAllCategorAPIRequestDto } from 'quizzer-lib';
import { prisma } from 'quizzer-db';

@Injectable()
export class CategoryService {
  // カテゴリリスト(ファイルごと)取得
  async getCategoryList(file_num: number) {
    try {
      return await prisma.category.findMany({
        where: {
          file_num: file_num,
          deleted_at: null,
        },
        select: {
          file_num: true,
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

  // カテゴリ総入れ替え
  async replaceAllCategory(req: ReplaceAllCategorAPIRequestDto) {
    try {
      const { file_num } = req;

      //指定ファイルのカテゴリ取得
      const results = await prisma.quiz.findMany({
        where: {
          file_num,
        },
        select: {
          category: true,
        },
        distinct: ['category'],
      });

      //カテゴリデータ作成
      let categories: Set<string> = new Set([]);
      // eslint-disable-next-line no-var
      for (var i = 0; i < results.length; i++) {
        if (!results[i].category) {
          continue;
        }
        const result_i: Set<string> = new Set(results[i].category.split(':'));
        categories = new Set([...result_i, ...categories]);
      }
      const categoriesArray: string[] = Array.from(categories);
      const data: [number, string][] = [];
      // eslint-disable-next-line no-var
      for (var i = 0; i < categoriesArray.length; i++) {
        data.push([file_num, categoriesArray[i]]);
      }

      // トランザクション実行
      const result = [];
      await prisma.$transaction(async (prisma) => {
        //まず指定ファイルのカテゴリを全削除
        await prisma.category.deleteMany({
          where: {
            file_num,
          },
        });

        //カテゴリデータ全挿入
        for (let i = 0; i < data.length; i++) {
          result.push(
            await prisma.category.create({
              data: {
                file_num: data[i][0],
                category: data[i][1],
              },
            }),
          );
        }
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

  // カテゴリ正解率取得
  async getAccuracyRateByCategory(file_num: number) {
    try {
      const result = {};

      // カテゴリビューから指定ファイルのカテゴリ毎の正解率取得
      const categoryResult = await prisma.category_view.findMany({
        where: {
          file_num: file_num,
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
