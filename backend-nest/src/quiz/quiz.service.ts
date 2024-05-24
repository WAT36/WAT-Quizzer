import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  IntegrateQuizAPIRequestDto,
  UpdateCategoryOfQuizAPIRequestDto,
  RemoveCategoryOfQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteAnswerLogAPIRequestDto,
  getPrismaYesterdayRange,
  getRandomElementFromArray,
  getPrismaPastDayRange,
  getPastDate,
} from 'quizzer-lib';
import { parseStrToBool } from 'lib/str';
import { PrismaClient } from '@prisma/client';
export const prisma: PrismaClient = new PrismaClient();

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type FormatType = 'basic' | 'applied';

@Injectable()
export class QuizService {
  // 問題取得
  // TODO 問題取得系API（これとランダム、ワースト、LRUなど）は全部１つにまとめたい englishbotの方も同様
  async getQuiz(file_num: number, quiz_num: number, format = 'basic') {
    if (file_num <= 0 || quiz_num <= 0) {
      throw new HttpException(
        `ファイル番号または問題番号が入力されていません`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      switch (format) {
        case 'basic':
          const basicResult = await prisma.quiz.findUnique({
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
              deleted_at: null,
            },
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
          });
          if (!basicResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const appliedResult = await prisma.advanced_quiz.findUnique({
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
              advanced_quiz_type_id: 1,
              deleted_at: null,
            },
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
          });
          if (!appliedResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const fcResult = await prisma.advanced_quiz.findUnique({
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
              },
              advanced_quiz_type_id: 2,
              deleted_at: null,
            },
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
          });
          if (!fcResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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

  // 問題ランダム取得
  async getRandomQuiz(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: string,
    format = 'basic',
  ) {
    try {
      switch (format) {
        case 'basic':
          const basicResults = await prisma.quiz.findMany({
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
              file_num,
              deleted_at: null,
              quiz_statistics_view: {
                accuracy_rate: {
                  gte: min_rate || 0,
                  lte: max_rate || 100,
                },
              },
              ...(category && {
                category: {
                  contains: category,
                },
              }),
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
          });
          if (basicResults.length === 0) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
          const basicResult = getRandomElementFromArray(basicResults);
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
            },
            where: {
              file_num,
              advanced_quiz_type_id: 1,
              deleted_at: null,
              advanced_quiz_statistics_view: {
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
            },
          });
          if (appliedResults.length === 0) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
          const appliedResult = getRandomElementFromArray(appliedResults);
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
            },
            where: {
              file_num,
              advanced_quiz_type_id: 2,
              deleted_at: null,
              advanced_quiz_statistics_view: {
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
            },
          });
          if (fcResults.length === 0) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
          const fcResult = getRandomElementFromArray(fcResults);
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

  // 最低正解率問題取得
  async getWorstRateQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      switch (format) {
        case 'basic':
          const basicResult = await prisma.quiz.findFirst({
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
              file_num,
              deleted_at: null,
              ...(category && {
                category: {
                  contains: category,
                },
              }),
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: {
              quiz_statistics_view: {
                accuracy_rate: 'asc',
              },
            },
          });
          if (!basicResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const appliedResult = await prisma.advanced_quiz.findFirst({
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
            },
            where: {
              file_num,
              advanced_quiz_type_id: 1,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: {
              advanced_quiz_statistics_view: {
                accuracy_rate: 'asc',
              },
            },
          });
          if (!appliedResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const fcResult = await prisma.advanced_quiz.findFirst({
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
            },
            where: {
              file_num,
              advanced_quiz_type_id: 2,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: {
              advanced_quiz_statistics_view: {
                accuracy_rate: 'asc',
              },
            },
          });
          if (!fcResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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

  // 最小正解数問題取得
  // TODO 最小正解数ではなく最小回答数にした 関係事項は諸々修正
  async getMinimumAnsweredQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      switch (format) {
        case 'basic':
          const basicResult = await prisma.quiz.findFirst({
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
              file_num,
              deleted_at: null,
              ...(category && {
                category: {
                  contains: category,
                },
              }),
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: [
              {
                quiz_statistics_view: {
                  answer_count: 'asc',
                },
              },
              {
                quiz_statistics_view: {
                  fail_count: 'desc',
                },
              },
            ],
          });
          if (!basicResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const appliedResult = await prisma.advanced_quiz.findFirst({
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
            },
            where: {
              file_num,
              advanced_quiz_type_id: 1,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: [
              {
                advanced_quiz_statistics_view: {
                  answer_count: 'asc',
                },
              },
              {
                advanced_quiz_statistics_view: {
                  fail_count: 'desc',
                },
              },
            ],
          });
          if (!appliedResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const fcResult = await prisma.advanced_quiz.findFirst({
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
            },
            where: {
              file_num,
              advanced_quiz_type_id: 2,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: [
              {
                advanced_quiz_statistics_view: {
                  answer_count: 'asc',
                },
              },
              {
                advanced_quiz_statistics_view: {
                  fail_count: 'desc',
                },
              },
            ],
          });
          if (!fcResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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

  // 最後に回答してから最も長い時間が経っている問題を取得
  async getLRUQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      switch (format) {
        case 'basic':
          const basicResult = await prisma.quiz.findFirst({
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
                  last_answer_log: true,
                },
              },
            },
            where: {
              file_num,
              deleted_at: null,
              ...(category && {
                category: {
                  contains: category,
                },
              }),
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: {
              quiz_statistics_view: {
                last_answer_log: 'desc',
              },
            },
          });
          if (!basicResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const appliedResult = await prisma.advanced_quiz.findFirst({
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
                  last_answer_log: true,
                },
              },
            },
            where: {
              advanced_quiz_type_id: 1,
              file_num,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: {
              advanced_quiz_statistics_view: {
                last_answer_log: 'desc',
              },
            },
          });
          if (!appliedResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const fcResult = await prisma.advanced_quiz.findFirst({
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
                  last_answer_log: true,
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
            },
            where: {
              advanced_quiz_type_id: 2,
              file_num,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
            },
            orderBy: {
              advanced_quiz_statistics_view: {
                last_answer_log: 'desc',
              },
            },
          });
          if (!fcResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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

  // 昨日間違えた問題を取得
  async getReviewQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      switch (format) {
        case 'basic':
          const basicResult = await prisma.quiz.findFirst({
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
                  last_answer_log: true,
                },
              },
            },
            where: {
              file_num,
              deleted_at: null,
              ...(category && {
                category: {
                  contains: category,
                },
              }),
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
              quiz_statistics_view: {
                last_failed_answer_log: getPrismaYesterdayRange(),
              },
            },
          });
          if (!basicResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const appliedResult = await prisma.advanced_quiz.findFirst({
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
                  last_answer_log: true,
                },
              },
            },
            where: {
              advanced_quiz_type_id: 1,
              file_num,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
              advanced_quiz_statistics_view: {
                last_failed_answer_log: getPrismaYesterdayRange(),
              },
            },
          });
          if (!appliedResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
          const fcResult = await prisma.advanced_quiz.findFirst({
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
                  last_answer_log: true,
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
            },
            where: {
              advanced_quiz_type_id: 2,
              file_num,
              deleted_at: null,
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
              advanced_quiz_statistics_view: {
                last_failed_answer_log: getPrismaYesterdayRange(),
              },
            },
          });
          if (!fcResult) {
            throw new HttpException(
              `条件に合致するデータはありません`,
              HttpStatus.NOT_FOUND,
            );
          }
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
      const { file_num, input_data } = req;
      if (!file_num && !input_data) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。(file_num:${file_num},input_data:${JSON.stringify(
            input_data,
          )})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { question, answer, quiz_category, img_file } = input_data;

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
            ...(quiz_category && {
              create: quiz_category.split(',').map((x) => {
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
                updated_at: new Date(),
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
                  updated_at: new Date(),
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
                updated_at: new Date(),
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
                    updated_at: new Date(),
                  },
                  create: {
                    file_num,
                    basis_quiz_id: matched_basic_quiz_id_list[i],
                    advanced_quiz_id: updatedAdvancedQuiz.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null,
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
                updated_at: new Date(),
                ...(explanation && {
                  advanced_quiz_explanation: {
                    upsert: {
                      create: {
                        explanation,
                        created_at: new Date(),
                        updated_at: new Date(),
                      },
                      update: {
                        explanation,
                        updated_at: new Date(),
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
                    updated_at: new Date(),
                  },
                  create: {
                    file_num,
                    basis_quiz_id: matched_basic_quiz_id_list[i],
                    advanced_quiz_id: updatedAdvancedQuiz.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null,
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
    checked: string,
    query: string,
    queryOnlyInSentense: string,
    queryOnlyInAnswer: string,
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
                category: {
                  contains: category,
                },
              }),
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
              ...(parseStrToBool(queryOnlyInSentense)
                ? {
                    quiz_sentense: {
                      contains: query,
                    },
                  }
                : {}),
              ...(parseStrToBool(queryOnlyInAnswer)
                ? {
                    answer: {
                      contains: query,
                    },
                  }
                : {}),
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
              ...(parseStrToBool(checked)
                ? {
                    checked: true,
                  }
                : {}),
              ...(parseStrToBool(queryOnlyInSentense)
                ? {
                    quiz_sentense: {
                      contains: query,
                    },
                  }
                : {}),
              ...(parseStrToBool(queryOnlyInAnswer)
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
              updated_at: new Date(),
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
              updated_at: new Date(),
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
  async integrate(req: IntegrateQuizAPIRequestDto) {
    try {
      const { pre_file_num, pre_quiz_num, post_file_num, post_quiz_num } = req;
      if (pre_file_num !== post_file_num) {
        throw (
          '統合前後のファイル番号は同じにしてください (' +
          pre_file_num +
          ' != ' +
          post_file_num +
          ')'
        );
      }

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
            file_num: pre_file_num,
            quiz_num: pre_quiz_num,
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
            file_num: post_file_num,
            quiz_num: post_quiz_num,
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
            file_num: pre_file_num,
            quiz_num: pre_quiz_num,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        await prisma.quiz_category.updateMany({
          where: {
            file_num: post_file_num,
            quiz_num: post_quiz_num,
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
                file_num: post_file_num,
                quiz_num: post_quiz_num,
                category: c,
              },
            },
            update: {
              updated_at: new Date(),
              deleted_at: null,
            },
            create: {
              file_num: post_file_num,
              quiz_num: post_quiz_num,
              category: c,
            },
          });
        }

        // 統合元データは削除、それまでの解答ログデータも削除
        await prisma.quiz.update({
          data: {
            updated_at: new Date(),
            deleted_at: new Date(),
          },
          where: {
            file_num_quiz_num: {
              file_num: pre_file_num,
              quiz_num: pre_quiz_num,
            },
          },
        });
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            quiz_format_id: 1,
            file_num: pre_file_num,
            quiz_num: pre_quiz_num,
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
  async addCategoryToQuiz(req: UpdateCategoryOfQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, category } = req;
      const categories = category.split(',');
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

      const new_category = Array.from(new Set([...nowCategory, ...categories]));

      // 更新
      await prisma.quiz_category.updateMany({
        where: {
          file_num,
          quiz_num,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      for (const c of new_category) {
        await prisma.quiz_category.upsert({
          where: {
            file_num_quiz_num_category: {
              file_num,
              quiz_num,
              category: c,
            },
          },
          update: {
            updated_at: new Date(),
            deleted_at: null,
          },
          create: {
            file_num,
            quiz_num,
            category: c,
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

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: RemoveCategoryOfQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, category } = body;
      const categories = category.split(',');
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

      // 更新
      for (const c of categories) {
        if (!nowCategory.includes(c)) {
          continue;
        }

        await prisma.quiz_category.update({
          data: {
            updated_at: new Date(),
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
      // 更新
      return await prisma.quiz.update({
        data: {
          checked: true,
          updated_at: new Date(),
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // 問題にチェック外す
  async uncheck(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num } = req;
      // 更新
      return await prisma.quiz.update({
        data: {
          checked: false,
          updated_at: new Date(),
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num,
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

  // 問題のチェック反転
  async reverseCheck(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
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
                  quiz_num,
                },
              },
            })
          ).checked;
          return await prisma.quiz.update({
            data: {
              checked: !checked,
              updated_at: new Date(),
            },
            where: {
              file_num_quiz_num: {
                file_num,
                quiz_num,
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
                  quiz_num,
                },
              },
            })
          ).checked;
          return await prisma.advanced_quiz.update({
            data: {
              checked: !checked,
              updated_at: new Date(),
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

  // 回答ログ削除(ファイル指定)
  async deleteAnswerLogByFile(req: DeleteAnswerLogAPIRequestDto) {
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
      const { file_num, input_data } = req;
      if (!file_num && !input_data) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。(file_num:${file_num},input_data:${JSON.stringify(
            input_data,
          )})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { question, answer, img_file, matched_basic_quiz_id, explanation } =
        input_data;

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
      const { file_num, input_data } = req;
      if (!file_num && !input_data) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。(req:${JSON.stringify(
            req,
          )},file_num:${file_num},input_data:${JSON.stringify(input_data)})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const {
        question,
        answer,
        img_file,
        matched_basic_quiz_id,
        dummy1,
        dummy2,
        dummy3,
        explanation,
      } = input_data;

      if (!dummy1 && !dummy2 && !dummy3) {
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
