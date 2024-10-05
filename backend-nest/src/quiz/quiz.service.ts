import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteAnswerLogOfFileApiRequestDto,
  getPrismaYesterdayRange,
  getRandomElementFromArray,
  getPrismaPastDayRange,
  getPastDate,
  AddCategoryToQuizAPIRequestDto,
  IntegrateToQuizAPIRequestDto,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';
export const prisma: PrismaClient = new PrismaClient();

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type getQuizProps = {
  file_num: number;
  quiz_num?: number;
  min_rate?: number;
  max_rate?: number;
  category?: string;
  checked?: boolean;
  format: string; //'basic' | 'applied' | '4choice';
  method?: 'random' | 'worstRate' | 'leastClear' | 'LRU' | 'review';
};

@Injectable()
export class QuizService {
  // 問題取得
  // TODO 問題取得系API（これとランダム、ワースト、LRUなど）は全部１つにまとめたい englishbotの方も同様
  async getQuiz({
    file_num,
    quiz_num,
    min_rate,
    max_rate,
    category,
    checked,
    format = 'basic',
    method,
  }: getQuizProps) {
    try {
      switch (format) {
        case 'basic':
          // 取得条件
          const basicWhere =
            // methodがある時は条件指定
            method
              ? {
                  file_num,
                  deleted_at: null,
                  quiz_statistics_view: {
                    accuracy_rate: {
                      gte: min_rate || 0,
                      lte: max_rate || 100,
                    },
                    ...(method === 'review' && {
                      last_failed_answer_log: getPrismaYesterdayRange(),
                    }),
                  },
                  ...(category && {
                    category: {
                      contains: category,
                    },
                  }),
                  ...(checked
                    ? {
                        checked: true,
                      }
                    : {}),
                }
              : {
                  file_num,
                  quiz_num,
                  deleted_at: null,
                };
          const basicOrderBy =
            method === 'worstRate'
              ? {
                  quiz_statistics_view: {
                    accuracy_rate: 'asc' as const,
                  },
                }
              : method === 'leastClear'
              ? [
                  {
                    quiz_statistics_view: {
                      answer_count: 'asc' as const,
                    },
                  },
                  {
                    quiz_statistics_view: {
                      fail_count: 'desc' as const,
                    },
                  },
                ]
              : method === 'LRU'
              ? {
                  quiz_statistics_view: {
                    last_answer_log: 'desc' as const,
                  },
                }
              : {};
          // データ取得
          const basicResults = await prisma.quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              img_file: true,
              checked: true,
              quiz_category: {
                select: {
                  category: true,
                  deleted_at: true,
                },
              },
              quiz_statistics_view: {
                select: {
                  clear_count: true,
                  fail_count: true,
                  accuracy_rate: true,
                },
              },
            },
            where: basicWhere,
            orderBy: basicOrderBy,
          });
          if (basicResults.length === 0) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
          const basicResult =
            method === 'random' || method === 'review'
              ? getRandomElementFromArray(basicResults)
              : basicResults[0];
          return {
            ...basicResult,
            ...(basicResult.quiz_category && {
              quiz_category: basicResult.quiz_category
                .filter((x) => {
                  return !x.deleted_at;
                })
                .map((x) => {
                  return {
                    category: x.category,
                  };
                }),
            }),
            ...(basicResult.quiz_statistics_view && {
              quiz_statistics_view: {
                clear_count:
                  basicResult.quiz_statistics_view.clear_count.toString(),
                fail_count:
                  basicResult.quiz_statistics_view.fail_count.toString(),
                accuracy_rate:
                  basicResult.quiz_statistics_view.accuracy_rate.toString(),
              },
            }),
          };
          break;
        case 'applied':
          // 取得条件
          const appliedWhere = method
            ? {
                file_num,
                advanced_quiz_type_id: 1,
                deleted_at: null,
                advanced_quiz_statistics_view: {
                  accuracy_rate: {
                    gte: min_rate || 0,
                    lte: max_rate || 100,
                  },
                  ...(method === 'review' && {
                    last_failed_answer_log: getPrismaYesterdayRange(),
                  }),
                },
                ...(checked
                  ? {
                      checked: true,
                    }
                  : {}),
              }
            : {
                file_num,
                quiz_num,
                advanced_quiz_type_id: 1,
                deleted_at: null,
              };
          const appliedOrderBy =
            method === 'worstRate'
              ? {
                  advanced_quiz_statistics_view: {
                    accuracy_rate: 'asc' as const,
                  },
                }
              : method === 'leastClear'
              ? [
                  {
                    advanced_quiz_statistics_view: {
                      answer_count: 'asc' as const,
                    },
                  },
                  {
                    advanced_quiz_statistics_view: {
                      fail_count: 'desc' as const,
                    },
                  },
                ]
              : method === 'LRU'
              ? {
                  advanced_quiz_statistics_view: {
                    last_answer_log: 'desc' as const,
                  },
                }
              : {};
          // データ取得
          const appliedResults = await prisma.advanced_quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              advanced_quiz_type_id: true,
              quiz_sentense: true,
              answer: true,
              img_file: true,
              checked: true,
              advanced_quiz_statistics_view: {
                select: {
                  clear_count: true,
                  fail_count: true,
                  accuracy_rate: true,
                },
              },
              advanced_quiz_explanation: {
                select: {
                  explanation: true,
                },
              },
              quiz_basis_advanced_linkage: {
                select: {
                  basis_quiz_id: true,
                },
              },
            },
            where: appliedWhere,
            orderBy: appliedOrderBy,
          });
          if (appliedResults.length === 0) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
          const appliedResult =
            method === 'random' || method === 'review'
              ? getRandomElementFromArray(appliedResults)
              : appliedResults[0];
          return {
            ...appliedResult,
            ...(appliedResult.advanced_quiz_statistics_view && {
              advanced_quiz_statistics_view: {
                clear_count:
                  appliedResult.advanced_quiz_statistics_view.clear_count.toString(),
                fail_count:
                  appliedResult.advanced_quiz_statistics_view.fail_count.toString(),
                accuracy_rate:
                  appliedResult.advanced_quiz_statistics_view.accuracy_rate.toString(),
              },
            }),
          };
          break;
        case '4choice':
          // 取得条件
          const fcWhere = method
            ? {
                file_num,
                advanced_quiz_type_id: 2,
                deleted_at: null,
                advanced_quiz_statistics_view: {
                  accuracy_rate: {
                    gte: min_rate || 0,
                    lte: max_rate || 100,
                  },
                  ...(method === 'review' && {
                    last_failed_answer_log: getPrismaYesterdayRange(),
                  }),
                },
                ...(checked
                  ? {
                      checked: true,
                    }
                  : {}),
              }
            : {
                file_num,
                quiz_num,
                advanced_quiz_type_id: 2,
                deleted_at: null,
              };
          const fcOrderBy =
            method === 'worstRate'
              ? {
                  advanced_quiz_statistics_view: {
                    accuracy_rate: 'asc' as const,
                  },
                }
              : method === 'leastClear'
              ? [
                  {
                    advanced_quiz_statistics_view: {
                      answer_count: 'asc' as const,
                    },
                  },
                  {
                    advanced_quiz_statistics_view: {
                      fail_count: 'desc' as const,
                    },
                  },
                ]
              : method === 'LRU'
              ? {
                  advanced_quiz_statistics_view: {
                    last_answer_log: 'desc' as const,
                  },
                }
              : {};
          const fcResults = await prisma.advanced_quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              advanced_quiz_type_id: true,
              quiz_sentense: true,
              answer: true,
              img_file: true,
              checked: true,
              advanced_quiz_statistics_view: {
                select: {
                  clear_count: true,
                  fail_count: true,
                  accuracy_rate: true,
                },
              },
              dummy_choice: {
                select: {
                  dummy_choice_sentense: true,
                },
              },
              advanced_quiz_explanation: {
                select: {
                  explanation: true,
                },
              },
              quiz_basis_advanced_linkage: {
                select: {
                  basis_quiz_id: true,
                },
              },
            },
            where: fcWhere,
            orderBy: fcOrderBy,
          });
          if (fcResults.length === 0) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
          const fcResult =
            method === 'random' || method === 'review'
              ? getRandomElementFromArray(fcResults)
              : fcResults[0];
          return {
            ...fcResult,
            ...(fcResult.advanced_quiz_statistics_view && {
              advanced_quiz_statistics_view: {
                clear_count:
                  fcResult.advanced_quiz_statistics_view.clear_count.toString(),
                fail_count:
                  fcResult.advanced_quiz_statistics_view.fail_count.toString(),
                accuracy_rate:
                  fcResult.advanced_quiz_statistics_view.accuracy_rate.toString(),
              },
            }),
          };
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        // 404系はそのまま返す
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
  async cleared(req: ClearQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
      switch (format) {
        case 'basic': // 基礎問題
          return prisma.answer_log.create({
            data: {
              quiz_format_id: 1,
              file_num,
              quiz_num,
              is_corrected: true,
            },
          });
          break;
        case 'applied': // 応用問題
          return prisma.answer_log.create({
            data: {
              quiz_format_id: 2,
              file_num,
              quiz_num,
              is_corrected: true,
            },
          });
          break;
        case '4choice': // 四択問題
          return prisma.answer_log.create({
            data: {
              quiz_format_id: 3,
              file_num,
              quiz_num,
              is_corrected: true,
            },
          });
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
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

  // 不正解登録
  async failed(req: FailQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
      switch (format) {
        case 'basic': // 基礎問題
          return prisma.answer_log.create({
            data: {
              quiz_format_id: 1,
              file_num,
              quiz_num,
              is_corrected: false,
            },
          });
          break;
        case 'applied': // 応用問題
          return prisma.answer_log.create({
            data: {
              quiz_format_id: 2,
              file_num,
              quiz_num,
              is_corrected: false,
            },
          });
          break;
        case '4choice': // 四択問題
          return prisma.answer_log.create({
            data: {
              quiz_format_id: 3,
              file_num,
              quiz_num,
              is_corrected: false,
            },
          });
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
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

  // 問題を１問追加
  async add(req: AddQuizAPIRequestDto) {
    try {
      const { file_num, question, answer, category, img_file } = req;
      if (!file_num || !question || !answer) {
        throw new HttpException(
          `ファイル番号または問題文または答えが入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 新問題番号を取得しINSERT
      const res = await prisma.quiz.findFirst({
        select: {
          quiz_num: true,
        },
        where: {
          file_num,
        },
        orderBy: {
          quiz_num: 'desc',
        },
        take: 1,
      });
      const new_quiz_id: number = res && res.quiz_num ? res.quiz_num + 1 : 1;
      return await prisma.quiz.create({
        data: {
          file_num,
          quiz_num: new_quiz_id,
          quiz_sentense: question,
          answer,
          img_file,
          checked: false,
          quiz_category: {
            ...(category && {
              create: category.split(',').map((x) => {
                return {
                  category: x,
                };
              }),
            }),
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

  // 問題編集
  async edit(req: EditQuizAPIRequestDto) {
    try {
      const {
        format,
        file_num,
        quiz_num,
        question,
        answer,
        category,
        img_file,
        matched_basic_quiz_id,
        dummy1,
        dummy2,
        dummy3,
        explanation,
      } = req;

      //編集画面で入力した関連基礎問題番号取得・バリデーション
      const matched_basic_quiz_id_list: number[] = [];
      let id_list: string[] = [];
      if (matched_basic_quiz_id) {
        id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      // クエリ用意
      switch (format) {
        case 'basic':
          await prisma.$transaction(async (prisma) => {
            // 更新
            await prisma.quiz.update({
              data: {
                quiz_sentense: question,
                answer,
                img_file,
                checked: false,
              },
              where: {
                file_num_quiz_num: {
                  file_num,
                  quiz_num,
                },
              },
            });
            // カテゴリ更新
            await prisma.quiz_category.updateMany({
              where: {
                file_num,
                quiz_num,
              },
              data: {
                deleted_at: new Date(),
              },
            });
            const categories = category.split(',');
            for (const c of categories) {
              await prisma.quiz_category.upsert({
                where: {
                  file_num_quiz_num_category: {
                    file_num,
                    quiz_num,
                    category: c,
                  },
                },
                update: {
                  deleted_at: null,
                },
                create: {
                  file_num,
                  quiz_num,
                  category: c,
                },
              });
            }
            // ログ削除
            await prisma.answer_log.updateMany({
              data: {
                deleted_at: new Date(),
              },
              where: {
                quiz_format_id: 1,
                file_num,
                quiz_num,
              },
            });
          });
          break;
        case 'applied':
          await prisma.$transaction(async (prisma) => {
            // 更新
            const updatedAdvancedQuiz = await prisma.advanced_quiz.update({
              data: {
                quiz_sentense: question,
                answer,
                img_file,
              },
              where: {
                file_num_quiz_num: {
                  file_num,
                  quiz_num,
                },
                advanced_quiz_type_id: 1,
              },
            });
            // 関連問題更新
            if (
              matched_basic_quiz_id &&
              matched_basic_quiz_id_list.length > 0
            ) {
              // 一度削除
              await prisma.quiz_basis_advanced_linkage.updateMany({
                data: {
                  deleted_at: new Date(),
                },
                where: {
                  advanced_quiz_id: updatedAdvancedQuiz.id,
                },
              });
              // 削除後追加
              for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
                await prisma.quiz_basis_advanced_linkage.upsert({
                  update: {
                    deleted_at: null,
                  },
                  create: {
                    file_num,
                    basis_quiz_id: matched_basic_quiz_id_list[i],
                    advanced_quiz_id: updatedAdvancedQuiz.id,
                  },
                  where: {
                    basis_quiz_id_advanced_quiz_id: {
                      basis_quiz_id: matched_basic_quiz_id_list[i],
                      advanced_quiz_id: updatedAdvancedQuiz.id,
                    },
                  },
                });
              }
            }
            // ログ削除
            await prisma.answer_log.updateMany({
              data: {
                deleted_at: new Date(),
              },
              where: {
                quiz_format_id: 1,
                file_num,
                quiz_num,
              },
            });
          });
          break;
        case '4choice':
          await prisma.$transaction(async (prisma) => {
            // 更新
            const updatedAdvancedQuiz = await prisma.advanced_quiz.update({
              data: {
                quiz_sentense: question,
                answer,
                img_file,
                ...(explanation && {
                  advanced_quiz_explanation: {
                    upsert: {
                      create: {
                        explanation,
                      },
                      update: {
                        explanation,
                      },
                    },
                  },
                }),
              },
              where: {
                file_num_quiz_num: {
                  file_num,
                  quiz_num,
                },
                advanced_quiz_type_id: 2,
              },
            });
            // ダミー選択肢更新
            // TODO もっと効率いい方法ないか..
            const dummyChoices = [dummy1, dummy2, dummy3];
            for (let i = 0; i < dummyChoices.length; i++) {
              // ダミー選択肢のID取得
              const dummyChoiceId = await prisma.dummy_choice.findFirst({
                select: {
                  id: true,
                },
                where: {
                  advanced_quiz_id: updatedAdvancedQuiz.id,
                },
                orderBy: {
                  id: 'asc',
                },
                skip: i,
                take: 1,
              });
              // ダミー選択肢更新
              await prisma.dummy_choice.update({
                data: {
                  dummy_choice_sentense: dummyChoices[i],
                },
                where: {
                  id: dummyChoiceId.id,
                },
              });
            }
            // 関連問題更新
            if (
              matched_basic_quiz_id &&
              matched_basic_quiz_id_list.length > 0
            ) {
              // 一度削除
              await prisma.quiz_basis_advanced_linkage.updateMany({
                data: {
                  deleted_at: new Date(),
                },
                where: {
                  advanced_quiz_id: updatedAdvancedQuiz.id,
                },
              });
              // 削除後追加
              for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
                await prisma.quiz_basis_advanced_linkage.upsert({
                  update: {
                    deleted_at: null,
                  },
                  create: {
                    file_num,
                    basis_quiz_id: matched_basic_quiz_id_list[i],
                    advanced_quiz_id: updatedAdvancedQuiz.id,
                  },
                  where: {
                    basis_quiz_id_advanced_quiz_id: {
                      basis_quiz_id: matched_basic_quiz_id_list[i],
                      advanced_quiz_id: updatedAdvancedQuiz.id,
                    },
                  },
                });
              }
            }
            // ログ削除
            await prisma.answer_log.updateMany({
              data: {
                deleted_at: new Date(),
              },
              where: {
                quiz_format_id: 2,
                file_num,
                quiz_num,
              },
            });
          });
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return { result: 'Edited!' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題検索
  async search(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: boolean,
    query: string,
    queryOnlyInSentense: boolean,
    queryOnlyInAnswer: boolean,
    format: string,
  ) {
    try {
      switch (format) {
        case 'basic':
          return await prisma.quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              quiz_category: {
                select: {
                  category: true,
                  deleted_at: true,
                },
              },
              img_file: true,
              checked: true,
            },
            where: {
              file_num,
              deleted_at: null,
              quiz_statistics_view: {
                accuracy_rate: {
                  gte: min_rate || 0,
                  lte: max_rate || 100,
                },
              },
              ...(category && {
                quiz_category: {
                  some: {
                    category: {
                      contains: category,
                    },
                  },
                },
              }),
              ...(checked
                ? {
                    checked: true,
                  }
                : {}),
              OR: [
                queryOnlyInSentense
                  ? {
                      quiz_sentense: {
                        contains: query,
                      },
                    }
                  : {},
                queryOnlyInAnswer
                  ? {
                      answer: {
                        contains: query,
                      },
                    }
                  : {},
              ],
            },
            orderBy: {
              quiz_num: 'asc',
            },
          });
          break;
        case 'applied':
          return await prisma.advanced_quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              img_file: true,
              checked: true,
            },
            where: {
              file_num,
              deleted_at: null,
              ...(checked
                ? {
                    checked: true,
                  }
                : {}),
              ...(queryOnlyInSentense
                ? {
                    quiz_sentense: {
                      contains: query,
                    },
                  }
                : {}),
              ...(queryOnlyInAnswer
                ? {
                    answer: {
                      contains: query,
                    },
                  }
                : {}),
            },
          });
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
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

  // 問題削除
  async delete(req: DeleteQuizAPIRequestDto) {
    try {
      const { format, file_num, quiz_num } = req;
      switch (format) {
        case 'basic':
          return await prisma.quiz.update({
            data: {
              deleted_at: new Date(),
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
            },
          });
          break;
        case 'applied':
        case '4choice':
          return await prisma.advanced_quiz.update({
            data: {
              deleted_at: new Date(),
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
            },
          });
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
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

  // 問題統合（とりあえず基礎問題のみ）
  async integrate(req: IntegrateToQuizAPIRequestDto) {
    try {
      const { file_num, fromQuizInfo, toQuizInfo } = req;

      // 統合前の問題取得
      const pre_data = await prisma.quiz.findUnique({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          quiz_sentense: true,
          answer: true,
          quiz_category: {
            select: {
              category: true,
              deleted_at: true,
            },
          },
          img_file: true,
          checked: true,
          quiz_statistics_view: {
            select: {
              clear_count: true,
              fail_count: true,
              accuracy_rate: true,
            },
          },
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num: fromQuizInfo.quiz_num,
          },
          deleted_at: null,
        },
      });

      // 統合後の問題取得
      const post_data = await prisma.quiz.findUnique({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          quiz_sentense: true,
          answer: true,
          quiz_category: {
            select: {
              category: true,
              deleted_at: true,
            },
          },
          img_file: true,
          checked: true,
          quiz_statistics_view: {
            select: {
              clear_count: true,
              fail_count: true,
              accuracy_rate: true,
            },
          },
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num: toQuizInfo.quiz_num,
          },
          deleted_at: null,
        },
      });

      // 統合データ作成
      const pre_category = new Set(
        pre_data.quiz_category
          ? pre_data.quiz_category
              .filter((x) => {
                return !x.deleted_at;
              })
              .map((x) => {
                return x.category;
              })
          : [],
      );
      const post_category = new Set(
        post_data.quiz_category
          ? post_data.quiz_category
              .filter((x) => {
                return !x.deleted_at;
              })
              .map((x) => {
                return x.category;
              })
          : [],
      );
      const new_category = Array.from(
        new Set([...pre_category, ...post_category]),
      );

      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 問題統合(カテゴリのみ)
        //// 元問題のカテゴリ削除
        await prisma.quiz_category.updateMany({
          where: {
            file_num,
            quiz_num: fromQuizInfo.quiz_num,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        await prisma.quiz_category.updateMany({
          where: {
            file_num,
            quiz_num: toQuizInfo.quiz_num,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        //// 統合後問題にカテゴリ更新
        for (const c of new_category) {
          await prisma.quiz_category.upsert({
            where: {
              file_num_quiz_num_category: {
                file_num,
                quiz_num: toQuizInfo.quiz_num,
                category: c,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              file_num,
              quiz_num: toQuizInfo.quiz_num,
              category: c,
            },
          });
        }

        // 統合元データは削除、それまでの解答ログデータも削除
        await prisma.quiz.update({
          data: {
            deleted_at: new Date(),
          },
          where: {
            file_num_quiz_num: {
              file_num,
              quiz_num: fromQuizInfo.quiz_num,
            },
          },
        });
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            quiz_format_id: 1,
            file_num,
            quiz_num: fromQuizInfo.quiz_num,
          },
        });
      });

      return {
        result: 'OK!',
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

  // 問題にカテゴリ追加
  async addCategoryToQuiz(req: AddCategoryToQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, category } = req;
      const quiz_nums = quiz_num.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      const categories = category.split(',');
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        for (const quiz_num of quiz_nums) {
          // 更新
          for (const c of categories) {
            await prisma.quiz_category.upsert({
              where: {
                file_num_quiz_num_category: {
                  file_num,
                  quiz_num,
                  category: c,
                },
              },
              update: {
                deleted_at: null,
              },
              create: {
                file_num,
                quiz_num,
                category: c,
              },
            });
          }
        }
      });
      // TODO 問題追加系の返り値の扱い　なんか違う方がいい
      return {
        result: 'OK!',
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

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: AddCategoryToQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, category } = body;
      const quiz_nums = quiz_num.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      const categories = category.split(',');
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 更新
        for (const quiz_num of quiz_nums) {
          // 現在のカテゴリ取得
          const nowCategory = (
            await prisma.quiz_category.findMany({
              select: {
                category: true,
              },
              where: {
                file_num,
                quiz_num,
                deleted_at: null,
              },
            })
          ).map((x) => {
            return x.category;
          });

          for (const c of categories) {
            if (!nowCategory.includes(c)) {
              continue;
            }

            await prisma.quiz_category.update({
              data: {
                deleted_at: new Date(),
              },
              where: {
                file_num_quiz_num_category: {
                  file_num,
                  quiz_num,
                  category: c,
                },
              },
            });
          }
        }
      });
      return {
        result: 'OK!',
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

  // 問題にチェック追加
  async check(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num } = req;
      const quiz_nums = quiz_num.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 更新
        for (const quiz_num of quiz_nums) {
          await prisma.quiz.update({
            data: {
              checked: true,
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
            },
          });
        }
      });
      return {
        result: 'OK!',
      };
    } catch (error) {
      throw error;
    }
  }

  // 問題にチェック外す
  async uncheck(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num } = req;
      const quiz_nums = quiz_num.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 更新
        for (const quiz_num of quiz_nums) {
          await prisma.quiz.update({
            data: {
              checked: false,
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
            },
          });
        }
      });
      return {
        result: 'OK!',
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

  // 問題のチェック反転
  async reverseCheck(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
      if (isNaN(+quiz_num)) {
        throw new HttpException(
          `問題番号が不正です(${quiz_num})`,
          HttpStatus.BAD_REQUEST,
        );
      }
      let checked: boolean;
      switch (format) {
        case 'basic': // 基礎問題
          checked = (
            await prisma.quiz.findUnique({
              select: {
                checked: true,
              },
              where: {
                file_num_quiz_num: {
                  file_num,
                  quiz_num: +quiz_num,
                },
              },
            })
          ).checked;
          return await prisma.quiz.update({
            data: {
              checked: !checked,
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num: +quiz_num,
              },
            },
          });
          break;
        case 'applied': // 応用問題
          checked = (
            await prisma.advanced_quiz.findUnique({
              select: {
                checked: true,
              },
              where: {
                file_num_quiz_num: {
                  file_num,
                  quiz_num: +quiz_num,
                },
              },
            })
          ).checked;
          return await prisma.advanced_quiz.update({
            data: {
              checked: !checked,
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num: +quiz_num,
              },
            },
          });
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
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

  // 回答ログ削除(ファイル指定)
  async deleteAnswerLogByFile(req: DeleteAnswerLogOfFileApiRequestDto) {
    try {
      const { file_id } = req;
      // 指定ファイルの回答ログ削除
      await prisma.answer_log.updateMany({
        data: {
          deleted_at: new Date(),
        },
        where: {
          file_num: file_id,
          deleted_at: null,
        },
      });
      return {
        result: 'Deleted!',
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

  // 応用問題を１問追加
  async addAdvancedQuiz(req: AddQuizAPIRequestDto) {
    try {
      const {
        file_num,
        question,
        answer,
        img_file,
        matched_basic_quiz_id,
        explanation,
      } = req;
      if (!file_num || !question || !answer) {
        throw new HttpException(
          `ファイル番号または問題文,答えが入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 関連する基礎問題番号リストのバリデーション・取得
      const matched_basic_quiz_id_list: number[] = [];
      if (matched_basic_quiz_id) {
        const id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      // 新問題番号(ファイルごとの)を取得しINSERT
      const res = (
        await prisma.advanced_quiz.findFirst({
          select: {
            quiz_num: true,
          },
          where: {
            file_num,
          },
          orderBy: {
            quiz_num: 'desc',
          },
          take: 1,
        })
      ).quiz_num;
      const new_quiz_id: number = res ? res + 1 : 1;

      let advancedQuiz;
      await prisma.$transaction(async (prisma) => {
        advancedQuiz = await prisma.advanced_quiz.create({
          data: {
            file_num,
            quiz_num: new_quiz_id,
            advanced_quiz_type_id: 1,
            quiz_sentense: question,
            answer,
            img_file,
            checked: false,
          },
        });

        // 新問題番号(advanced_quiz全体での)を取得しINSERT
        const new_id: number = advancedQuiz.id;
        // 関連する基礎問題番号リストを追加
        for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
          await prisma.quiz_basis_advanced_linkage.create({
            data: {
              file_num,
              basis_quiz_id: matched_basic_quiz_id_list[i],
              advanced_quiz_id: new_id,
            },
          });
        }

        // 解説を登録
        if (explanation) {
          await prisma.advanced_quiz_explanation.create({
            data: {
              advanced_quiz_id: new_id,
              explanation,
            },
          });
        }
      });
      return advancedQuiz;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 四択問題を１問追加
  async addFourChoiceQuiz(req: AddQuizAPIRequestDto) {
    try {
      const {
        file_num,
        question,
        answer,
        img_file,
        matched_basic_quiz_id,
        dummy1,
        dummy2,
        dummy3,
        explanation,
      } = req;
      if (!file_num || !question || !answer) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!dummy1 || !dummy2 || !dummy3) {
        throw new HttpException(
          `ダミー選択肢が3つ入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 関連する基礎問題番号リストのバリデーション・取得
      const matched_basic_quiz_id_list: number[] = [];
      if (matched_basic_quiz_id) {
        const id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      let new_quiz_id: number;
      let advancedQuiz;
      await prisma.$transaction(async (prisma) => {
        // 新問題番号(ファイルごとの)を取得しINSERT
        const res = await prisma.advanced_quiz.findFirst({
          select: {
            quiz_num: true,
          },
          where: {
            file_num,
          },
          orderBy: {
            quiz_num: 'desc',
          },
          take: 1,
        });
        new_quiz_id = res ? res.quiz_num + 1 : 1;
        advancedQuiz = await prisma.advanced_quiz.create({
          data: {
            file_num,
            quiz_num: new_quiz_id,
            advanced_quiz_type_id: 2,
            quiz_sentense: question,
            answer,
            img_file,
            checked: false,
          },
        });

        // 新問題番号(advanced_quiz全体での)を取得しINSERT
        const new_id = advancedQuiz.id;

        // ダミー選択肢をINSERT
        await prisma.dummy_choice.createMany({
          data: [
            {
              advanced_quiz_id: new_id,
              dummy_choice_sentense: dummy1,
            },
            {
              advanced_quiz_id: new_id,
              dummy_choice_sentense: dummy2,
            },
            {
              advanced_quiz_id: new_id,
              dummy_choice_sentense: dummy3,
            },
          ],
        });

        // 関連する基礎問題番号リストを追加
        for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
          await prisma.quiz_basis_advanced_linkage.create({
            data: {
              file_num,
              basis_quiz_id: matched_basic_quiz_id_list[i],
              advanced_quiz_id: new_id,
            },
          });
        }

        // 解説を登録
        if (explanation) {
          await prisma.advanced_quiz_explanation.create({
            data: {
              advanced_quiz_id: new_id,
              explanation,
            },
          });
        }
      });
      return advancedQuiz;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 過去１週間各日の回答数取得
  async getAnswerLogStatisticsPastWeek() {
    try {
      const result = [];
      for (let i = 0; i < 7; i++) {
        result.push({
          date: getPastDate(i),
          count: await prisma.answer_log.count({
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
