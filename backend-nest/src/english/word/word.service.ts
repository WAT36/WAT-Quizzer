import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getDateForSqlString } from 'lib/str';
import {
  AddEnglishWordAPIRequestDto,
  AddWordTestResultLogAPIRequestDto,
  EditWordSourceAPIRequestDto,
  EditWordMeanAPIRequestDto,
  getRandomElementsFromArray,
  UpsertWordSubSourceAPIRequestDto,
  DeleteWordSubSourceAPIRequestDto,
  DeleteWordSourceAPIRequestDto,
  DeleteMeanAPIRequestDto,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';
export const prisma: PrismaClient = new PrismaClient();

@Injectable()
export class EnglishWordService {
  // 単語と意味追加
  async addWordAndMeanService(req: AddEnglishWordAPIRequestDto) {
    const { inputWord, pronounce, meanArrayData } = req;
    try {
      // トランザクション実行準備
      await prisma.$transaction(async (prisma) => {
        //単語追加
        const addWordResult = await prisma.word.create({
          data: {
            name: inputWord.wordName,
            pronounce,
          },
        });

        // insertされた単語ID取得
        const wordWillId = addWordResult.id;

        // その他　の場合は入力した出典をチェック
        let sourceId: number = inputWord.sourceId;
        if (sourceId === -2) {
          if (!inputWord.newSourceName) {
            throw new Error(`新規追加する出典が入力されていません`);
          }

          // 出典名で既に登録されているか検索
          const sourceData = await prisma.source.findMany({
            where: {
              name: inputWord.newSourceName,
              deleted_at: null,
            },
          });

          if (sourceData[0]) {
            // 既にある -> そのIDを出典IDとして使用
            sourceId = sourceData[0].id;
          } else {
            // 登録されていない -> 新規登録してそのIDを使用
            const result = await prisma.source.create({
              data: {
                name: inputWord.newSourceName,
              },
            });
            sourceId = result.id;
          }
        }

        // 単語出典追加（登録されてない場合(-1)は登録しない）
        if (sourceId !== -1) {
          await prisma.word_source.create({
            data: {
              word_id: wordWillId,
              source_id: sourceId,
            },
          });
        }

        // サブ出典追加
        if (inputWord.subSourceName && inputWord.subSourceName !== '') {
          await prisma.word_subsource.create({
            data: {
              word_id: wordWillId,
              subsource: inputWord.subSourceName,
            },
          });
        }

        //入力した意味一つ分のデータ作成
        for (let i = 0; i < meanArrayData.length; i++) {
          // その他　の場合は入力した品詞をチェック
          let partofspeechId: number = meanArrayData[i].partOfSpeechId;
          if (meanArrayData[i].partOfSpeechId === -2) {
            if (!meanArrayData[i].partOfSpeechName) {
              throw new Error(`[${i + 1}]品詞が入力されていません`);
            }

            // 品詞名で既に登録されているか検索
            const posData = await prisma.partsofspeech.findMany({
              where: {
                name: meanArrayData[i].partOfSpeechName,
                deleted_at: null,
              },
            });

            if (posData[0]) {
              // 既にある -> そのIDを品詞IDとして使用
              partofspeechId = posData[0].id;
            } else {
              // 登録されていない -> 新規登録してそのIDを使用
              const result = await prisma.partsofspeech.create({
                data: {
                  name: meanArrayData[i].partOfSpeechName,
                },
              });
              partofspeechId = result.id;
            }
          }

          //意味追加
          await prisma.mean.create({
            data: {
              word_id: wordWillId,
              wordmean_id: i + 1,
              partsofspeech_id: partofspeechId,
              meaning: meanArrayData[i].meaning,
            },
          });
        }
      });

      return {
        result: 'Added!!',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語検索
  async searchWordService(
    wordName: string,
    meanQuery: string,
    subSourceName: string,
  ) {
    try {
      const result = await prisma.word.findMany({
        select: {
          id: true,
          name: true,
          pronounce: true,
          mean: {
            select: {
              meaning: true,
            },
          },
        },
        where: {
          AND: [
            {
              ...(wordName && {
                name: {
                  contains: wordName,
                },
              }),
              ...(meanQuery && {
                mean: {
                  some: {
                    meaning: {
                      contains: meanQuery,
                    },
                  },
                },
              }),
              ...(subSourceName && {
                word_subsource: {
                  some: {
                    subsource: {
                      contains: subSourceName,
                    },
                  },
                },
              }),
            },
          ],
        },
        orderBy: {
          name: 'asc',
        },
        take: 200,
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

  // ランダムに単語を1つ取得
  async getRandomWordService() {
    try {
      //  現在登録されている単語数を取得
      const wordNum = (
        await prisma.word.aggregate({
          _count: {
            id: true,
          },
        })
      )._count.id;

      // 単語をランダムに1つ取得
      const result = await prisma.word.findMany({
        select: {
          id: true,
          name: true,
          pronounce: true,
          mean: {
            select: {
              meaning: true,
              partsofspeech: {
                select: {
                  name: true,
                },
              },
            },
          },
          word_source: {
            select: {
              source: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip: Math.floor(Math.random() * wordNum),
        take: 1,
      });
      return result[0];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語全取得
  async getAllWordService() {
    try {
      const result = await prisma.word.findMany({
        where: {
          deleted_at: null,
        },
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

  // 単語名から単語情報取得
  async getWordByNameService(name: string) {
    try {
      const result = await prisma.word.findMany({
        select: {
          id: true,
          name: true,
          pronounce: true,
          mean: {
            select: {
              id: true,
              wordmean_id: true,
              meaning: true,
              partsofspeech: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          name,
          deleted_at: null,
        },
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

  // TODO ここと下のLRU 共通してるとこ多い（prismaとか）ので共通化できるとこはしたい
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

  // 正解登録
  async wordTestClearedService(req: AddWordTestResultLogAPIRequestDto) {
    try {
      const { wordId, testType } = req;
      return await prisma.englishbot_answer_log.create({
        data: {
          word_id: wordId,
          result: true,
          test_type: testType,
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

  // 不正解登録
  async wordTestFailedService(req: AddWordTestResultLogAPIRequestDto) {
    try {
      const { wordId, testType } = req;
      return await prisma.englishbot_answer_log.create({
        data: {
          word_id: wordId,
          result: false,
          test_type: testType,
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

  // 単語の出典追加・更新
  async editSourceOfWordById(req: EditWordSourceAPIRequestDto) {
    try {
      const { wordId, oldSourceId, newSourceId } = req;
      const result = [];
      //トランザクション実行準備
      await prisma.$transaction(async (prisma) => {
        if (oldSourceId === -1) {
          // 出典追加
          result.push(
            await prisma.word_source.create({
              data: {
                word_id: wordId,
                source_id: newSourceId,
              },
            }),
          );
        } else {
          // 出典更新
          result.push(
            await prisma.word_source.update({
              data: {
                source_id: newSourceId,
                updated_at: new Date(),
              },
              where: {
                word_id_source_id: {
                  word_id: wordId,
                  source_id: oldSourceId,
                },
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

  // 単語の出典削除
  async deleteSourceOfWordById(req: DeleteWordSourceAPIRequestDto) {
    try {
      const { word_id, source_id } = req;
      return await prisma.word_source.delete({
        where: {
          word_id_source_id: {
            word_id,
            source_id,
          },
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

  // 単語のサブ出典追加更新
  async upsertSubSourceOfWordById(req: UpsertWordSubSourceAPIRequestDto) {
    try {
      const { id, wordId, subSource } = req;
      return await prisma.word_subsource.upsert({
        where: {
          id,
        },
        update: {
          subsource: subSource,
        },
        create: {
          word_id: wordId,
          subsource: subSource,
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

  // 単語のサブ出典削除
  async deleteSubSourceOfWordById(req: DeleteWordSubSourceAPIRequestDto) {
    try {
      const { id } = req;
      return await prisma.word_subsource.delete({
        where: {
          id,
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

  // 単語の意味削除
  async deleteMeandById(req: DeleteMeanAPIRequestDto) {
    try {
      const { meanId } = req;
      return await prisma.mean.delete({
        where: {
          id: meanId,
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

  // 単語のサマリデータ取得
  async getSummary() {
    try {
      const result = await prisma.word_summarize.findMany({
        select: {
          name: true,
          count: true,
        },
      });
      return result.map((x) => {
        return {
          ...x,
          count: x.count.toString(),
        };
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

  // 単語IDから出典情報取得
  async getSourceOfWordById(id: number) {
    try {
      return await prisma.word.findMany({
        select: {
          id: true,
          name: true,
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
          id,
          deleted_at: null,
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

  // 単語のサブ出典取得
  async getSubSourceOfWordById(id: number) {
    try {
      return await prisma.word_subsource.findMany({
        select: {
          subsource: true,
        },
        where: {
          word_id: id,
          deleted_at: null,
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

  // IDから単語情報取得
  async getWordByIdService(id: number) {
    try {
      return await prisma.word.findUnique({
        select: {
          id: true,
          name: true,
          pronounce: true,
          mean: {
            select: {
              id: true,
              wordmean_id: true,
              meaning: true,
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
              id: true,
              source: true,
            },
          },
          word_subsource: {
            select: {
              id: true,
              subsource: true,
              created_at: true,
            },
          },
        },
        where: {
          id,
          deleted_at: null,
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

  // 単語の意味などを更新
  async editWordMeanService(req: EditWordMeanAPIRequestDto) {
    try {
      const { wordId, wordMeanId, meanId, partofspeechId, meaning } = req;
      //意味編集及び追加
      if (meanId === -1) {
        return await prisma.mean.create({
          data: {
            word_id: wordId,
            wordmean_id: wordMeanId,
            partsofspeech_id: partofspeechId,
            meaning,
          },
        });
      } else {
        return await prisma.mean.update({
          data: {
            partsofspeech_id: partofspeechId,
            meaning,
            updated_at: new Date(),
          },
          where: {
            word_id_wordmean_id: {
              word_id: wordId,
              wordmean_id: wordMeanId,
            },
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 現在登録されている単語の最大idを取得
  async getWordNumService() {
    try {
      return await prisma.word.aggregate({
        _max: {
          id: true,
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
}
