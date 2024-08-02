import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getDateForSqlString } from 'lib/str';
import { PrismaClient } from '@prisma/client';
import { getRandomElementsFromArray } from 'quizzer-lib';
export const prisma: PrismaClient = new PrismaClient();

@Injectable()
export class EnglishWordTestService {
  // 四択問題テストで利用するデータ（ランダム単語・ダミー選択肢）を取得する
  async getTestDataOfFourChoice(
    source: string,
    startDate: string,
    endDate: string,
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
      // ランダム取得
      const randomResult = await prisma.word.findMany({
        select: {
          id: true,
          name: true,
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
        },
        where: {
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
        },
      });
      if (randomResult.length === 0) {
        throw new HttpException(
          '条件に該当するデータはありません',
          HttpStatus.NOT_FOUND,
        );
      }
      // 結果からランダムに1つ取得して返す
      const testWord = getRandomElementsFromArray(randomResult, 1)[0];

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
              not: testWord.id,
            },
          },
        }),
        3,
      );

      return {
        word: {
          id: testWord.id,
          name: testWord.name,
          mean: testWord.mean,
          word_source: testWord.word_source,
        },
        correct: {
          mean: getRandomElementsFromArray(testWord.mean, 1)[0].meaning,
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

  // 四択問題テストで利用するデータ（ランダム単語・ダミー選択肢。LRU（最も出題されてないもの））を取得する
  async getLRUTestDataOfFourChoice(
    source: string,
    startDate: string,
    endDate: string,
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
      // LRU取得
      const lruResult = await prisma.word.findFirst({
        select: {
          id: true,
          name: true,
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
        },
        where: {
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
        },
        orderBy: [
          {
            word_statistics_view: {
              last_answer_log: {
                sort: 'asc',
                nulls: 'first',
              },
            },
          },
        ],
      });
      if (!lruResult) {
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
              not: lruResult.id,
            },
          },
        }),
        3,
      );

      return {
        word: {
          id: lruResult.id,
          name: lruResult.name,
          mean: lruResult.mean,
          word_source: lruResult.word_source,
        },
        correct: {
          mean: getRandomElementsFromArray(lruResult.mean, 1)[0].meaning,
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
}
