import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddExampleAPIRequestDto,
  SourceStatisticsApiResponse,
  SubmitAssociationExampleAPIRequestDto,
  prisma,
} from 'quizzer-lib';

@Injectable()
export class EnglishService {
  // 品詞取得
  async getPartsofSpeechService() {
    try {
      const data = await prisma.partsofspeech.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典取得
  async getSourceService() {
    try {
      const data = await prisma.source.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文追加
  async addExampleService(req: AddExampleAPIRequestDto) {
    const { exampleEn, exampleJa, explanation, wordName, sourceId, newSourceName } = req;

    // 入力単語存在チェック
    const wordData =
      wordName && wordName !== ''
        ? await prisma.word.findUnique({
            where: {
              name: wordName,
            },
            select: {
              id: true,
            },
          })
        : undefined;
    if (wordName && wordName !== '' && !wordData) {
      throw new HttpException(
        `エラー：入力した単語名「${wordName}は存在しません」`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 出典IDの解決（その他の場合は新規登録または既存取得）
    let resolvedSourceId: number | undefined = sourceId;
    if (sourceId === -2) {
      if (!newSourceName) {
        throw new HttpException(
          '新規追加する出典が入力されていません',
          HttpStatus.BAD_REQUEST,
        );
      }
      const sourceData = await prisma.source.findMany({
        where: { name: newSourceName, deleted_at: null },
      });
      if (sourceData[0]) {
        resolvedSourceId = sourceData[0].id;
      } else {
        const result = await prisma.source.create({ data: { name: newSourceName } });
        resolvedSourceId = result.id;
      }
    }

    try {
      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        //例文追加
        const createdExampleData = await prisma.example.create({
          data: {
            en_example_sentense: exampleEn,
            ja_example_sentense: exampleJa,
            example_explanation: {
              create: [
                {
                  explanation,
                },
              ],
            },
          },
        });

        //  word_exampleにデータ追加(単語入力ある場合のみ)
        if (wordData) {
          await prisma.word_example.create({
            data: {
              example_sentense_id: createdExampleData.id,
              word_id: wordData.id,
            },
          });
        }

        // example_sourceにデータ追加(出典入力ある場合のみ)
        if (resolvedSourceId !== undefined && resolvedSourceId !== -1) {
          await prisma.example_source.create({
            data: {
              example_id: createdExampleData.id,
              source_id: resolvedSourceId,
            },
          });
        }
      });
      return {
        result: 'Added!',
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

  // 例文検索
  async searchExampleService(query: string, isLinked: boolean) {
    try {
      const data = isLinked
        ? await prisma.example.findMany({
            where: {
              word_example: {
                every: {
                  word: {
                    name: query,
                  },
                  deleted_at: null,
                },
              },
              deleted_at: null,
            },
            select: {
              id: true,
              en_example_sentense: true,
              ja_example_sentense: true,
            },
            orderBy: {
              id: 'asc',
            },
          })
        : isLinked === false
          ? await prisma.example.findMany({
              where: {
                en_example_sentense: {
                  contains: query,
                },
                deleted_at: null,
              },
              select: {
                id: true,
                en_example_sentense: true,
                ja_example_sentense: true,
              },
              orderBy: {
                id: 'asc',
              },
            })
          : undefined;
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文紐付け更新
  async changeAssociationOfExampleService(
    req: SubmitAssociationExampleAPIRequestDto,
  ) {
    const { wordName, checkedId, isAssociation } = req;

    // 入力単語存在チェック
    const wordData = await prisma.word.findUnique({
      where: {
        name: wordName,
        deleted_at: null,
      },
      select: {
        id: true,
      },
    });
    if (!wordData) {
      throw new HttpException(
        `エラー：入力した単語名「${wordName}は存在しません」`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      // isAssociation:true->紐付け false->解除
      const data = isAssociation
        ? await prisma.word_example.upsert({
            create: {
              example_sentense_id: checkedId,
              word_id: wordData.id,
            },
            update: {
              deleted_at: null,
            },
            where: {
              example_sentense_id_word_id: {
                example_sentense_id: checkedId,
                word_id: wordData.id,
              },
            },
          })
        : await prisma.word_example.update({
            where: {
              example_sentense_id_word_id: {
                example_sentense_id: checkedId,
                word_id: wordData.id,
              },
            },
            data: {
              deleted_at: new Date(),
            },
          });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文テスト取得
  async getExampleTestService(sourceId?: number) {
    try {
      const where = {
        deleted_at: null,
        ...(sourceId !== undefined && {
          example_source: {
            some: {
              source_id: sourceId,
            },
          },
        }),
      };

      const total = await prisma.example.count({ where });

      if (total === 0) {
        throw new HttpException(
          '条件に合致するデータはありません',
          HttpStatus.NOT_FOUND,
        );
      }

      const skip = Math.floor(Math.random() * total);

      const example = await prisma.example.findFirst({
        where,
        skip,
        select: {
          id: true,
          en_example_sentense: true,
          ja_example_sentense: true,
        },
      });

      return { total, example };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典に単語リスト一挙登録（バッチ用）
  async registerWordsToSource(sourceId: number, words: string[]) {
    try {
      const unregisteredWord = [];
      const alreadyRegisteredWord = [];
      const registerWord = [];
      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        for (const wordName of words) {
          // 入力単語が実在するかチェック
          const wordData = await prisma.word.findFirst({
            where: {
              name: wordName,
            },
          });

          // ない場合はスルー
          if (!wordData) {
            unregisteredWord.push(wordName);
            continue;
          }

          // 出典・単語の組み合わせが既に登録されているかチェック
          const wordSourceData = await prisma.word_source.findUnique({
            where: {
              word_id_source_id: {
                word_id: wordData.id,
                source_id: sourceId,
              },
            },
          });

          // 既にある場合はスルー
          if (wordSourceData) {
            alreadyRegisteredWord.push(wordName);
            continue;
          }

          // 登録
          await prisma.word_source.create({
            data: {
              word_id: +wordData.id,
              source_id: sourceId,
            },
          });

          registerWord.push(wordName);
        }
      });
      return {
        result: `${registerWord.length} Registered!`,
        registerWord,
        unregisteredWord,
        alreadyRegisteredWord,
      };
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典統計ビューデータ取得
  async getSourceStatisticsData(): Promise<SourceStatisticsApiResponse[]> {
    const result = await prisma.source_statistics_view.findMany({
      select: {
        id: true,
        name: true,
        clear_count: true,
        fail_count: true,
        count: true,
        not_answered: true,
        accuracy_rate: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return result.map((x) => {
      return {
        ...x,
        count: Number(x.count),
        clear_count: Number(x.clear_count),
        fail_count: Number(x.fail_count),
        not_answered: Number(x.not_answered),
        accuracy_rate: Number(x.accuracy_rate),
      };
    });
  }
}
