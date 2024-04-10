import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../config/sql';
import { execQuery, execTransaction } from '../../lib/db/dao';
import { TransactionQuery } from '../../interfaces/db';
import { getDifferenceArray } from '../../lib/array';
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
  GetQuizApiResponseDto,
  GetQuizNumResponseDto,
  GetIdDto,
  GetLinkedBasisIdDto,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';
import { parseStrToBool } from 'lib/str';

const prisma = new PrismaClient();

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type FormatType = 'basic' | 'applied';

@Injectable()
export class QuizService {
  // 問題取得
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
          return await prisma.quiz.findMany({
            where: {
              file_num,
              quiz_num,
              deleted_at: null,
            },
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              category: true,
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
            orderBy: {
              id: 'asc',
            },
          });
          break;
        case 'applied':
          return await prisma.advanced_quiz.findMany({
            where: {
              file_num,
              quiz_num,
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
              quiz_basis_advanced_linkage: {
                select: {
                  basis_quiz_id: true,
                },
              },
            },
            orderBy: {
              id: 'asc',
            },
          });
          break;
        case '4choice':
          return await await prisma.advanced_quiz.findMany({
            where: {
              file_num,
              quiz_num,
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
            orderBy: {
              id: 'asc',
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
          return await prisma.quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              category: true,
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
            // skip: // TODO ランダム
            take: 1,
          });
          break;
        case 'applied':
          return await prisma.advanced_quiz.findMany({
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
            // skip: // TODO ランダム
            take: 1,
          });
          break;
        case '4choice':
          return await prisma.advanced_quiz.findMany({
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
            // skip: // TODO ランダム
            take: 1,
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
          return await prisma.quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              category: true,
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
            take: 1,
          });
          break;
        case 'applied':
          return await prisma.advanced_quiz.findMany({
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
            take: 1,
          });
          break;
        case '4choice':
          return await prisma.advanced_quiz.findMany({
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
            take: 1,
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
          return await prisma.quiz.findMany({
            select: {
              id: true,
              file_num: true,
              quiz_num: true,
              quiz_sentense: true,
              answer: true,
              category: true,
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
                answer_count: 'asc',
                fail_count: 'desc',
              },
            },
            take: 1,
          });
          break;
        case 'applied':
          return await prisma.advanced_quiz.findMany({
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
                answer_count: 'asc',
                fail_count: 'desc',
              },
            },
            take: 1,
          });
          break;
        case '4choice':
          return await prisma.advanced_quiz.findMany({
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
                answer_count: 'asc',
                fail_count: 'desc',
              },
            },
            take: 1,
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

  // 最後に回答してから最も長い時間が経っている問題を取得
  // TODO LRUのprisma化　これは基礎応用問題を一体テーブル化しないとできない
  async getLRUQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.LRU(file_num, category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.LRU(2, file_num, checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.LRU(file_num, checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      const result: GetQuizApiResponseDto[] = await execQuery(sql, []);
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

  // 昨日間違えた問題を取得
  // TODO 復習問題のprisma化　これは基礎応用問題を一体テーブル化して解答ログを関連付けしないとできない
  async getReviewQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.REVIEW(file_num, category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.REVIEW(2, file_num, checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.REVIEW(file_num, checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      const result: GetQuizApiResponseDto[] = await execQuery(sql, []);
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

      const { question, answer, category, img_file } = input_data;

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
      await prisma.quiz.create({
        data: {
          file_num,
          quiz_num: new_quiz_id,
          quiz_sentense: question,
          answer,
          category,
          img_file,
          checked: false,
        },
      });
      return [
        {
          result:
            'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer,
        },
      ];
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
                category,
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
              category: true,
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
          category: true,
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
          category: true,
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
      const pre_category = new Set(pre_data.category.split(':'));
      const post_category = new Set(post_data.category.split(':'));
      const new_category = Array.from(
        new Set([...pre_category, ...post_category]),
      ).join(':');

      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 問題統合
        await prisma.quiz.update({
          data: {
            category: new_category,
            updated_at: new Date(),
          },
          where: {
            file_num_quiz_num: {
              file_num: post_file_num,
              quiz_num: post_quiz_num,
            },
          },
        });

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
      // 現在のカテゴリ取得
      const nowCategory: string = (
        await prisma.quiz.findUnique({
          select: {
            category: true,
          },
          where: {
            file_num_quiz_num: {
              file_num,
              quiz_num,
            },
            deleted_at: null,
          },
        })
      ).category;

      if (nowCategory.includes(category)) {
        return {
          message: ` カテゴリ'${category}'は既に[${file_num}-${quiz_num}]に含まれています `,
        };
      }

      // カテゴリ追加
      let newCategory = nowCategory + ':' + category;
      while (newCategory.includes('::')) {
        newCategory = newCategory.replace('::', ':');
      }

      // 更新
      return await prisma.quiz.update({
        data: {
          category: newCategory,
          updated_at: new Date(),
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num,
          },
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

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: RemoveCategoryOfQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, category } = body;
      // 現在のカテゴリ取得
      const nowCategory: string = (
        await prisma.quiz.findUnique({
          select: {
            category: true,
          },
          where: {
            file_num_quiz_num: {
              file_num,
              quiz_num,
            },
            deleted_at: null,
          },
        })
      ).category;

      // 指定カテゴリが含まれているか確認、含まれていなければ終了
      if (!nowCategory.includes(category)) {
        return {
          result: null,
        };
      }

      // カテゴリ削除
      let newCategory: string = nowCategory.replace(category, '');
      if (newCategory[0] === ':') {
        newCategory = newCategory.slice(1);
      }
      if (newCategory.slice(-1) === ':') {
        newCategory = newCategory.slice(0, -1);
      }
      while (newCategory.includes('::')) {
        newCategory = newCategory.replace('::', ':');
      }

      // 更新
      return await prisma.quiz.update({
        data: {
          category: newCategory,
          updated_at: new Date(),
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num,
          },
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
      return await execQuery(SQL.QUIZ.UNCHECK, [file_num, quiz_num]);
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
      let infoSql: string;
      let checkSql: string;
      let uncheckSql: string;
      switch (format) {
        case 'basic': // 基礎問題
          infoSql = SQL.QUIZ.INFO;
          checkSql = SQL.QUIZ.CHECK;
          uncheckSql = SQL.QUIZ.UNCHECK;
          break;
        case 'applied': // 応用問題
          infoSql = SQL.ADVANCED_QUIZ.INFO;
          checkSql = SQL.ADVANCED_QUIZ.CHECK;
          uncheckSql = SQL.ADVANCED_QUIZ.UNCHECK;
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }

      // チェック取得
      const result: GetQuizApiResponseDto[] = await execQuery(infoSql, [
        file_num,
        quiz_num,
      ]);
      const checked = result[0].checked;

      await execQuery(checked ? uncheckSql : checkSql, [file_num, quiz_num]);

      // チェックしたらtrue、チェック外したらfalseを返す
      return [{ result: !checked }];
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
      const result = await execQuery(SQL.ANSWER_LOG.FILE.RESET, [file_id]);

      return {
        result,
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

      const { question, answer, img_file, matched_basic_quiz_id } = input_data;

      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

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
      let res: GetQuizNumResponseDto[] = await execQuery(
        SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.BYFILE,
        [file_num],
      );
      const new_quiz_id: number =
        res && res.length > 0 ? res[0]['quiz_num'] + 1 : 1;
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.ADD,
        value: [file_num, new_quiz_id, 1, question, answer, img_file],
      });

      // 新問題番号(advanced_quiz全体での)を取得しINSERT
      res = await execQuery(SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.ALL, []);
      const new_id: number = res && res.length > 0 ? res[0]['id'] + 1 : 1;
      // 関連する基礎問題番号リストを追加
      for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
        transactionQuery.push({
          query: SQL.QUIZ_BASIS_ADVANCED_LINKAGE.ADD,
          value: [file_num, matched_basic_quiz_id_list[i], new_id],
        });
      }

      // トランザクション処理実行
      await execTransaction(transactionQuery);
      return [
        {
          result:
            'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer +
            ',関連基礎問題:' +
            JSON.stringify(matched_basic_quiz_id_list),
        },
      ];
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
      } = input_data;

      if (!dummy1 && !dummy2 && !dummy3) {
        throw new HttpException(
          `ダミー選択肢が3つ入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

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
      let res: GetQuizNumResponseDto[] = await execQuery(
        SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.BYFILE,
        [file_num],
      );
      const new_quiz_id: number =
        res && res.length > 0 ? res[0]['quiz_num'] + 1 : 1;
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.ADD,
        value: [file_num, new_quiz_id, 2, question, answer, img_file],
      });

      // 新問題番号(advanced_quiz全体での)を取得しINSERT
      res = await execQuery(SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.ALL, []);
      const new_id: number = res && res.length > 0 ? res[0]['id'] + 1 : 1;

      // ダミー選択肢をINSERT
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.DUMMY_CHOICE.ADD,
        value: [new_id, dummy1],
      });
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.DUMMY_CHOICE.ADD,
        value: [new_id, dummy2],
      });
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.DUMMY_CHOICE.ADD,
        value: [new_id, dummy3],
      });

      // 関連する基礎問題番号リストを追加
      for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
        transactionQuery.push({
          query: SQL.QUIZ_BASIS_ADVANCED_LINKAGE.ADD,
          value: [file_num, matched_basic_quiz_id_list[i], new_id],
        });
      }

      // トランザクション処理実行
      await execTransaction(transactionQuery);
      return [
        {
          result:
            'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer +
            ',関連基礎問題:' +
            JSON.stringify(matched_basic_quiz_id_list),
        },
      ];
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
