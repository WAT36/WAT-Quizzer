import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  getDateForSqlString,
  GetEnglishWordTestDataAPIRequestDto,
  getPastDate,
  getPrismaPastDayRange,
  getRandomElementsFromArray,
  getRandomInt,
  getTodayStart,
  prisma,
} from 'quizzer-lib';

@Injectable()
export class EnglishWordTestService {
  // 英単語テストで利用するデータ（単語データ・四択ダミー選択肢）を取得する
  async getTestData(req: GetEnglishWordTestDataAPIRequestDto) {
    try {
      const {
        format,
        source,
        startDate,
        endDate,
        checked,
        min_rate,
        max_rate,
        result_from,
        result_to,
        word_type,
      } = req;
      // サブ出典・日時に関するクエリ
      const startDateQuery = startDate
        ? {
            gte: new Date(getDateForSqlString(startDate)),
          }
        : {};
      const endDateTomorrow = new Date(getDateForSqlString(endDate));
      endDateTomorrow.setDate(endDateTomorrow.getDate() + 1);
      const endDateQuery = endDate
        ? {
            lt: endDateTomorrow,
          }
        : {};
      const subSourceQuery =
        startDate && endDate
          ? { ...startDateQuery, ...endDateQuery }
          : startDate
            ? startDateQuery
            : endDate
              ? endDateQuery
              : null;
      // 単語種別フィルタ（スペースあり=熟語、スペースなし=単語）
      const wordTypeFilter =
        word_type === 'word'
          ? { name: { not: { contains: ' ' } } }
          : word_type === 'phrase'
            ? { name: { contains: ' ' } }
            : {};
      // 取得条件
      const where = {
        ...wordTypeFilter,
        word_source: {
          ...(source &&
            +source !== -1 && {
              some: { source_id: +source },
            }),
        },
        word_subsource: {
          ...(subSourceQuery && {
            some: {},
            every: {
              created_at: subSourceQuery,
            },
          }),
        },
        word_statistics_view: {
          accuracy_rate: {
            gte: min_rate || 0,
            lte: max_rate || 100,
          },
        },
        ...(checked
          ? {
              checked: true,
            }
          : {}),
      };
      // review時の追加条件
      const reviewWhere =
        format === 'review'
          ? {
              word_statistics_view: {
                last_failed_answer_log: {
                  lt: getTodayStart(),
                },
                last_answer_log: {
                  lt: getTodayStart(),
                },
              },
            }
          : {};
      // ソート条件
      const orderBy =
        format === 'random'
          ? [{ id: 'asc' as const }]
          : format === 'lru'
            ? [
                {
                  word_statistics_view: {
                    last_answer_log: {
                      sort: 'asc' as const,
                      nulls: 'first' as const,
                    },
                  },
                },
              ]
            : format === 'review'
              ? [
                  {
                    word_statistics_view: {
                      last_failed_answer_log: 'desc' as const,
                    },
                  },
                ]
              : [];
      // 取得件数を先に取得しておく
      const finalWhere = { ...where, ...reviewWhere };
      const count = await prisma.word.count({
        where: finalWhere,
      });
      // result_from/result_toによる範囲指定
      if (
        result_from !== undefined &&
        result_to !== undefined &&
        result_from > result_to
      ) {
        throw new HttpException(
          'result_fromはresult_to以下の値を指定してください',
          HttpStatus.BAD_REQUEST,
        );
      }
      const fromIndex = result_from !== undefined ? result_from - 1 : 0;
      const toIndex = result_to !== undefined ? Math.min(result_to, count) - 1 : count - 1;
      const effectiveCount = Math.max(0, toIndex - fromIndex + 1);
      const skip =
        format === 'random'
          ? fromIndex + getRandomInt(effectiveCount)
          : fromIndex;
      // データ取得
      const result = await prisma.word.findFirst({
        select: {
          id: true,
          name: true,
          checked: true,
          mean: {
            select: {
              id: true,
              word_id: true,
              wordmean_id: true,
              meaning: true,
              created_at: true,
              updated_at: true,
              deleted_at: true,
              partsofspeech: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          word_source: {
            select: {
              source: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          word_statistics_view: {
            select: {
              accuracy_rate: true,
            },
          },
        },
        where: finalWhere,
        orderBy,
        skip,
      });
      if (!result) {
        throw new HttpException(
          '条件に該当するデータはありません',
          HttpStatus.NOT_FOUND,
        );
      }

      // ダミー選択肢用の意味を取得
      const dummyOptions = getRandomElementsFromArray(
        (await prisma.mean.findMany({
          select: {
            id: true,
            word_id: true,
            wordmean_id: true,
            meaning: true,
            partsofspeech: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            word_id: {
              not: result.id,
            },
          },
        })) as any[],
        3,
      );

      return {
        total: count,
        word: {
          id: result.id,
          name: result.name,
          mean: result.mean,
          checked: result.checked,
          word_source: result.word_source,
          word_statistics_view: {
            accuracy_rate: result.word_statistics_view.accuracy_rate.toString(),
          },
        },
        correct: {
          mean: getRandomElementsFromArray(result.mean as any[], 1)[0].meaning,
        },
        dummy: dummyOptions.map((x) => ({
          mean: x.meaning,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      } else if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 過去１週間各日の回答数取得
  async getWordTestLogStatisticsPastWeek() {
    try {
      const result = [];
      for (let i = 0; i < 7; i++) {
        result.push({
          date: getPastDate(i),
          count: await prisma.englishbot_answer_log.count({
            where: {
              created_at: getPrismaPastDayRange(i),
            },
          }),
        });
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
