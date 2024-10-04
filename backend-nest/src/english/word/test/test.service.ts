import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  getDateForSqlString,
  getPastDate,
  getPrismaPastDayRange,
  getRandomElementsFromArray,
  getRandomInt,
  parseStrToBool,
} from 'quizzer-lib';
export const prisma: PrismaClient = new PrismaClient();

@Injectable()
export class EnglishWordTestService {
  // 英単語テストで利用するデータ（単語データ・四択ダミー選択肢）を取得する
  async getTestData(
    format: 'random' | 'lru',
    source: string,
    startDate?: string,
    endDate?: string,
    checked?: string,
    min_rate?: number,
    max_rate?: number,
  ) {
    try {
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
      // 取得条件
      const where = {
        word_source: {
          ...(source &&
            +source !== -1 && {
              some: {},
              every: {
                source_id: +source,
              },
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
        ...(parseStrToBool(checked)
          ? {
              checked: true,
            }
          : {}),
      };
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
          : [];
      // 取得件数を先に取得しておく(ランダムの場合のみ)
      const count =
        format === 'random'
          ? await prisma.word.count({
              where,
            })
          : -1;
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
        where,
        orderBy,
        skip: count !== -1 ? getRandomInt(count) : 0,
      });
      if (!result) {
        throw new HttpException(
          '条件に該当するデータはありません',
          HttpStatus.NOT_FOUND,
        );
      }

      // ダミー選択肢用の意味を取得
      const dummyOptions = getRandomElementsFromArray(
        await prisma.mean.findMany({
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
        }),
        3,
      );

      return {
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
          mean: getRandomElementsFromArray(result.mean, 1)[0].meaning,
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
