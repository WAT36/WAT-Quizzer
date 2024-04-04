import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../../config/sql';
import { execQuery, execTransaction } from '../../../lib/db/dao';
import { TransactionQuery } from '../../../interfaces/db';
import { getDateForSqlString } from 'lib/str';
import {
  AddEnglishWordAPIRequestDto,
  AddWordTestResultLogAPIRequestDto,
  EditWordSourceAPIRequestDto,
  AddWordSubSourceAPIRequestDto,
  EditWordMeanAPIRequestDto,
  WordSearchAPIResponseDto,
  GetWordAPIResponseDto,
  GetWordBynameAPIResponseDto,
  GetRandomWordAPIResponseDto,
  GetFourChoiceAPIResponseDto,
  FourChoiceAPIResponseDto,
  GetWordSummaryAPIResponseDto,
  GetSourceOfWordAPIResponseDto,
  GetSubSourceOfWordAPIResponseDto,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EnglishWordService {
  // 単語と意味追加
  async addWordAndMeanService(req: AddEnglishWordAPIRequestDto) {
    const { wordName, pronounce, meanArrayData } = req;
    try {
      // //トランザクション実行準備
      await prisma.$transaction(async (prisma) => {
        //単語追加
        const addWordResult = await prisma.word.create({
          data: {
            name: wordName,
            pronounce,
          },
        });

        // insertされた単語ID取得
        const wordWillId = addWordResult.id;

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

          // その他　の場合は入力した出典をチェック
          let sourceId: number = meanArrayData[i].sourceId;
          if (meanArrayData[i].sourceId === -2) {
            if (!meanArrayData[i].sourceName) {
              throw new Error(`[${i + 1}]出典が入力されていません`);
            }

            // 出典名で既に登録されているか検索
            const sourceData = await prisma.source.findMany({
              where: {
                name: meanArrayData[i].sourceName,
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
                  name: meanArrayData[i].sourceName,
                },
              });
              sourceId = result.id;
            }
          }
          //意味追加
          const addMeanResult = await prisma.mean.create({
            data: {
              word_id: wordWillId,
              wordmean_id: i + 1,
              partsofspeech_id: partofspeechId,
              meaning: meanArrayData[i].meaning,
            },
          });
          // 意味出典追加
          await prisma.mean_source.create({
            data: {
              mean_id: addMeanResult.id,
              source_id: sourceId,
            },
          });
        }
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

  // 単語検索
  async searchWordService(wordName: string, subSourceName: string) {
    try {
      const result = await prisma.word.findMany({
        select: {
          id: true,
          name: true,
          pronounce: true,
        },
        where: {
          name: {
            contains: wordName,
          },
          ...(subSourceName && {
            word_subsource: {
              every: {
                subsource: {
                  contains: subSourceName,
                },
              },
            },
          }),
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

  // 単語をランダムに取得
  async getRandomWordService(
    source: string,
    startDate: string,
    endDate: string,
  ) {
    try {
      // サブ出典・日時に関するクエリ
      const startDateQuery = {
        gte: new Date(getDateForSqlString(startDate)),
      };
      const endDateQuery = {
        lte: new Date(getDateForSqlString(endDate)),
      };
      const subSourceQuery =
        startDate && endDate
          ? { ...startDateQuery, ...endDateQuery }
          : startDate
          ? startDateQuery
          : endDate
          ? endDateQuery
          : null;
      // ランダム取得
      const result = await prisma.word.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          mean: {
            ...(source && {
              every: {
                mean_source: {
                  every: {
                    source_id: +source,
                  },
                },
              },
            }),
          },
          word_subsource: {
            every: {
              created_at: subSourceQuery,
            },
          },
        },
        // skip:  //TODO prismaでランダムってどうやるか
        take: 1,
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

  // 指定した単語を出題するときの四択選択肢（正解選択肢1つとダミー選択肢3つ）を作る
  async makeFourChoiceService(wordId: number) {
    try {
      if (isNaN(wordId)) {
        throw new HttpException(
          `単語IDが不正です:${wordId}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 指定単語idの意味を取得
      const correctMeans: GetFourChoiceAPIResponseDto[] = await execQuery(
        SQL.ENGLISH.MEAN.GET.BY_WORD_ID,
        [wordId],
      );
      // ダミー選択肢用の意味を取得
      const dummyMeans: GetFourChoiceAPIResponseDto[] = await execQuery(
        SQL.ENGLISH.MEAN.GET.BY_NOT_WORD_ID,
        [wordId],
      );

      return [
        {
          correct: { mean: correctMeans[0].meaning },
          dummy: dummyMeans.map((x) => ({
            mean: x.meaning,
          })),
        },
      ] as FourChoiceAPIResponseDto[];
    } catch (error: unknown) {
      if (error instanceof Error) {
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
      const { wordId } = req;
      return await execQuery(SQL.ENGLISH.WORD_TEST.CLEARED.INPUT, [wordId]);
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
      const { wordId } = req;
      return await execQuery(SQL.ENGLISH.WORD_TEST.FAILED.INPUT, [wordId]);
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
      const { meanId, oldSourceId, newSourceId } = req;
      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      if (oldSourceId === -1) {
        // 出典追加
        for (let i = 0; i < meanId.length; i++) {
          transactionQuery.push({
            query: SQL.ENGLISH.MEAN.SOURCE.ADD,
            value: [meanId[i], newSourceId],
          });
        }
      } else {
        // 出典更新
        for (let i = 0; i < meanId.length; i++) {
          transactionQuery.push({
            query: SQL.ENGLISH.MEAN.SOURCE.EDIT,
            value: [newSourceId, meanId[i], oldSourceId],
          });
        }
      }
      //トランザクション実行
      return await execTransaction(transactionQuery);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語のサブ出典追加
  async addSubSourceOfWordById(req: AddWordSubSourceAPIRequestDto) {
    try {
      const { wordId, subSource } = req;
      return await execQuery(SQL.ENGLISH.WORD.SUBSOURCE.ADD, [
        wordId,
        subSource,
      ]);
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
      const result: GetWordSummaryAPIResponseDto[] = await execQuery(
        SQL.ENGLISH.WORD.SUMMARY.GET,
        [],
      );
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

  // 単語IDから出典情報取得
  async getSourceOfWordById(id: number) {
    try {
      const result: GetSourceOfWordAPIResponseDto[] = await execQuery(
        SQL.ENGLISH.WORD.GET.SOURCE,
        [id],
      );
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

  // 単語のサブ出典取得
  async getSubSourceOfWordById(id: number) {
    try {
      const result: GetSubSourceOfWordAPIResponseDto[] = await execQuery(
        SQL.ENGLISH.WORD.GET.SUBSOURCE,
        [id],
      );
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

  // IDから単語情報取得
  async getWordByIdService(id: number) {
    try {
      const result: GetWordBynameAPIResponseDto[] = await execQuery(
        SQL.ENGLISH.WORD.GET.ID,
        [id],
      );
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

  // 単語の意味などを更新
  async editWordMeanService(req: EditWordMeanAPIRequestDto) {
    try {
      const { wordId, wordMeanId, meanId, partofspeechId, meaning } = req;
      //意味編集及び追加
      if (meanId === -1) {
        return await execQuery(SQL.ENGLISH.MEAN.ADD, [
          wordId,
          wordMeanId,
          partofspeechId,
          meaning,
        ]);
      } else {
        return await execQuery(SQL.ENGLISH.MEAN.EDIT, [
          partofspeechId,
          meaning,
          wordId,
          wordMeanId,
        ]);
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
}
