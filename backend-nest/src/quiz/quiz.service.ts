import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteAnswerLogOfFileApiRequestDto,
  getRandomElementFromArray,
  AddCategoryToQuizAPIRequestDto,
  IntegrateToQuizAPIRequestDto,
  GetQuizAPIRequestDto,
  SearchQuizAPIRequestDto,
  xor,
  prisma,
  GetAnswerLogStatisticsAPIRequestDto,
  getStartDateForStatistics,
  uploadQuizImageToS3,
  getQuizImageFromS3,
  MESSAGES,
  AnswerLogStatisticsApiResponse,
  getTodayStart,
  SEARCH_LIMITS,
} from 'quizzer-lib';
import { Readable } from 'stream';
import { parse, ParseResult } from 'papaparse';

export interface QueryType {
  query: string;
  value: (string | number)[];
}

@Injectable()
export class QuizService {
  // 問題取得
  async getQuiz(
    req: GetQuizAPIRequestDto,
    // TODO ここの型をlibに持っていく　フロント側でも同じの使っている箇所あるため
    method?:
      | 'random'
      | 'worstRate'
      | 'leastClear'
      | 'LRU'
      | 'review'
      | 'todayNotAnswered',
  ) {
    try {
      const {
        file_num,
        quiz_num,
        min_rate,
        max_rate,
        category,
        checked,
        format_id,
        keyword,
      } = req;
      // カテゴリは複数選択でカンマ区切りされてるので分割する
      const categories = category && category.split(',').map((s) => s.trim());
      // 取得条件
      const where =
        // methodがある時は条件指定
        method
          ? {
              file_num,
              // TODO 問題取得 format_idチェックボックス化による条件対応、、画面・pipe含めなんかやり方ややこしいのよな・・　もっと効率いいやり方模索したい
              ...(format_id && {
                format_id: {
                  in: Object.entries(format_id)
                    .filter((x) => x[1])
                    .map((x) => +x[0]),
                },
              }),
              deleted_at: null,
              quiz_statistics_view: {
                accuracy_rate: {
                  gte: min_rate || 0,
                  lte: max_rate || 100,
                },
                ...(method === 'review' && {
                  last_failed_answer_log: {
                    lt: getTodayStart(),
                  },
                  last_answer_log: {
                    lt: getTodayStart(),
                  },
                }),
                ...(method === 'todayNotAnswered' && {
                  OR: [
                    {
                      last_answer_log: {
                        lt: getTodayStart(),
                      },
                    },
                    {
                      last_answer_log: null,
                    },
                  ],
                }),
              },
              ...(categories && {
                OR: categories.map((category) => ({
                  category_quiz: {
                    some: {
                      category: {
                        name: {
                          contains: category,
                        },
                      },
                      deleted_at: null,
                    },
                  },
                })),
              }),
              ...(checked
                ? {
                    checked: true,
                  }
                : {}),
              ...(keyword && {
                OR: [
                  {
                    quiz_sentense: {
                      contains: keyword,
                    },
                  },
                  {
                    answer: {
                      contains: keyword,
                    },
                  },
                ],
              }),
            }
          : {
              file_num,
              quiz_num,
              ...(format_id && {
                format_id: {
                  in: Object.entries(format_id)
                    .filter((x) => x[1])
                    .map((x) => +x[0]),
                },
              }),
              deleted_at: null,
              ...(keyword && {
                OR: [
                  {
                    quiz_sentense: {
                      contains: keyword,
                    },
                  },
                  {
                    answer: {
                      contains: keyword,
                    },
                  },
                ],
              }),
            };
      const orderBy =
        method === 'worstRate'
          ? [
              {
                quiz_statistics_view: {
                  accuracy_rate: 'asc' as const,
                },
              },
              {
                quiz_statistics_view: {
                  fail_count: 'desc' as const,
                },
              },
              {
                id: 'asc' as const,
              },
            ]
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
                    last_answer_log: {
                      sort: 'asc' as const,
                      nulls: 'first' as const,
                    },
                  },
                }
              : method === 'review'
                ? {
                    quiz_statistics_view: {
                      last_failed_answer_log: 'desc' as const,
                    },
                  }
                : {};
      // 順位確定メソッド（全件ではなく先頭1件のみ取得すればよい）
      const needsAllResults =
        !method || method === 'random' || method === 'todayNotAnswered';
      const selectFields = {
        id: true,
        file_num: true,
        quiz_num: true,
        format_id: true,
        quiz_sentense: true,
        answer: true,
        img_file: true,
        checked: true,
        category_quiz: {
          select: {
            deleted_at: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        quiz_statistics_view: {
          select: {
            clear_count: true,
            fail_count: true,
            accuracy_rate: true,
          },
        },
        quiz_explanation: {
          select: {
            explanation: true,
          },
        },
        quiz_dummy_choice: {
          select: {
            dummy_choice_sentense: true,
            is_corrected: true,
          },
        },
        quiz_basis_linkage: {
          select: {
            basis_quiz_id: true,
            advanced_quiz_id: true,
          },
        },
        quiz_advanced_linkage: {
          select: {
            basis_quiz_id: true,
            advanced_quiz_id: true,
          },
        },
      };
      // データ取得
      // needsAllResults=false の場合は先頭1件のみ取得してDBからの転送量を削減
      const [results, totalCount] = await Promise.all([
        prisma.quiz.findMany({
          select: selectFields,
          where,
          orderBy,
          ...(needsAllResults ? {} : { take: 1 }),
        }),
        needsAllResults ? Promise.resolve(null) : prisma.quiz.count({ where }),
      ]);
      if (results.length === 0) {
        throw new HttpException(
          `条件に合致するデータはありません`,
          HttpStatus.NOT_FOUND,
        );
      }
      const result =
        method === 'random' || method === 'todayNotAnswered'
          ? getRandomElementFromArray(results)
          : results[0];
      return {
        ...result,
        category_quiz: undefined,
        ...(result.category_quiz && {
          quiz_category: result.category_quiz
            .filter((x) => {
              return !x.deleted_at;
            })
            .map((x) => {
              return {
                category: x.category.name,
              };
            }),
        }),
        ...(result.quiz_statistics_view && {
          quiz_statistics_view: {
            clear_count: result.quiz_statistics_view.clear_count.toString(),
            fail_count: result.quiz_statistics_view.fail_count.toString(),
            accuracy_rate: result.quiz_statistics_view.accuracy_rate.toString(),
          },
        }),
        count: totalCount ?? results.length,
      };
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
      const { quiz_id } = req;
      return prisma.answer_log.create({
        data: {
          quiz_id,
          is_corrected: true,
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
  async failed(req: FailQuizAPIRequestDto) {
    try {
      const { quiz_id } = req;
      return prisma.answer_log.create({
        data: {
          quiz_id,
          is_corrected: false,
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

  // 問題を１問追加
  async add(req: AddQuizAPIRequestDto) {
    try {
      const {
        file_num,
        question,
        answer,
        category,
        img_file,
        format_id,
        matched_basic_quiz_id,
        dummyChoice,
        explanation,
      } = req;
      if (!file_num || !question || !answer || !format_id) {
        throw new HttpException(
          `ファイル番号または問題文または答えが入力されていません。`,
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

      // 四択問題の場合　ダミー選択肢全部ない場合エラー
      if (
        format_id === 3 &&
        dummyChoice &&
        dummyChoice.length < 3 &&
        dummyChoice.reduce((accummulate, currentValue) => {
          return accummulate || currentValue.sentense === '';
        }, false)
      ) {
        throw new HttpException(
          MESSAGES.ERROR.MSG00018,
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
      const new_quiz_num: number = res && res.quiz_num ? res.quiz_num + 1 : 1;
      const createdQuiz = await prisma.quiz.create({
        data: {
          format_id,
          file_num,
          quiz_num: new_quiz_num,
          quiz_sentense: question,
          answer,
          img_file,
          checked: false,
          quiz_explanation: {
            ...(explanation && {
              create: {
                explanation,
              },
            }),
          },
          quiz_advanced_linkage: {
            createMany: {
              data:
                matched_basic_quiz_id && format_id === 1
                  ? matched_basic_quiz_id_list.map((x) => {
                      return { basis_quiz_id: x };
                    })
                  : [],
            },
          },
          quiz_dummy_choice: {
            createMany: {
              data:
                format_id === 3
                  ? dummyChoice.map((x) => {
                      return {
                        dummy_choice_sentense: x.sentense,
                        is_corrected: x.isCorrect,
                      };
                    })
                  : [],
            },
          },
        },
      });

      // カテゴリをcategoryマスター + category_quizに登録
      // 登録済みカテゴリIDを追跡して重複を防ぐ
      if (category) {
        const categories = category.split(',');
        const registeredCategoryIds = new Set<number>();

        // カテゴリ名からカテゴリをupsertしてquizに紐付ける関数
        const upsertAndLinkCategory = async (name: string) => {
          const cat = await prisma.category.upsert({
            where: { name_file_num: { name, file_num } },
            update: { deleted_at: null },
            create: { name, file_num },
          });
          if (!registeredCategoryIds.has(cat.id)) {
            registeredCategoryIds.add(cat.id);
            await prisma.category_quiz.create({
              data: { quiz_id: createdQuiz.id, category_id: cat.id },
            });
          }
          return cat.id;
        };

        // 入力カテゴリを登録し、その後キューで親カテゴリを再帰的に辿る
        const queue: number[] = [];
        for (const c of categories) {
          const catId = await upsertAndLinkCategory(c);
          queue.push(catId);
        }

        // BFSで祖先カテゴリをすべて登録
        while (queue.length > 0) {
          const childId = queue.shift();
          const parentRelations = await prisma.category_parent_child.findMany({
            where: { child_category_id: childId, deleted_at: null },
            include: { parent_category: true },
          });
          for (const rel of parentRelations) {
            const parentCat = rel.parent_category;
            if (!registeredCategoryIds.has(parentCat.id)) {
              // 親カテゴリをupsert（削除済みなら復元）してquizに紐付ける
              await prisma.category.update({
                where: { id: parentCat.id },
                data: { deleted_at: null },
              });
              registeredCategoryIds.add(parentCat.id);
              await prisma.category_quiz.create({
                data: { quiz_id: createdQuiz.id, category_id: parentCat.id },
              });
              queue.push(parentCat.id);
            }
          }
        }
      }

      return createdQuiz;
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
        quiz_id,
        format_id,
        file_num,
        quiz_num,
        question,
        answer,
        category,
        img_file,
        matched_basic_quiz_id,
        dummyChoice,
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
      await prisma.$transaction(async (prisma) => {
        // 更新
        const updatedQuiz = await prisma.quiz.update({
          data: {
            quiz_sentense: question,
            answer,
            img_file,
            ...(explanation && {
              quiz_explanation: {
                upsert: {
                  create: {
                    explanation,
                  },
                  update: {
                    explanation,
                  },
                  where: {
                    quiz_id,
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
            format_id,
          },
        });
        // 関連問題更新
        if (
          matched_basic_quiz_id &&
          matched_basic_quiz_id_list.length > 0 &&
          format_id > 1 // 応用問題
        ) {
          // 一度削除
          await prisma.quiz_basis_advanced_linkage.updateMany({
            data: {
              deleted_at: new Date(),
            },
            where: {
              advanced_quiz_id: updatedQuiz.id,
            },
          });
          // 削除後追加
          for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
            await prisma.quiz_basis_advanced_linkage.upsert({
              update: {
                deleted_at: null,
              },
              create: {
                basis_quiz_id: matched_basic_quiz_id_list[i],
                advanced_quiz_id: updatedQuiz.id,
              },
              where: {
                basis_quiz_id_advanced_quiz_id: {
                  basis_quiz_id: matched_basic_quiz_id_list[i],
                  advanced_quiz_id: updatedQuiz.id,
                },
              },
            });
          }
        }
        // ダミー選択肢更新
        // TODO もっと効率いい方法ないか..
        if (dummyChoice) {
          for (let i = 0; i < dummyChoice.length; i++) {
            // ダミー選択肢のID取得
            const dummyChoiceId = await prisma.quiz_dummy_choice.findFirst({
              select: {
                id: true,
              },
              where: {
                quiz_id: updatedQuiz.id,
              },
              orderBy: {
                id: 'asc',
              },
              skip: i,
              take: 1,
            });
            // ダミー選択肢更新
            await prisma.quiz_dummy_choice.update({
              data: {
                dummy_choice_sentense: dummyChoice[i].sentense,
                is_corrected: dummyChoice[i].isCorrect,
              },
              where: {
                id: dummyChoiceId.id,
              },
            });
          }
        }
        // カテゴリ更新（category_quizを使用）
        await prisma.category_quiz.updateMany({
          where: {
            quiz_id,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        const categories = category.split(',');
        for (const c of categories) {
          const cat = await prisma.category.upsert({
            where: {
              name_file_num: {
                name: c,
                file_num,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              name: c,
              file_num,
            },
          });
          await prisma.category_quiz.upsert({
            where: {
              quiz_id_category_id: {
                quiz_id,
                category_id: cat.id,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              quiz_id,
              category_id: cat.id,
            },
          });
        }
        // ログ削除
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            quiz_id,
          },
        });
      });
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
  async search(req: SearchQuizAPIRequestDto) {
    try {
      const {
        query,
        file_num,
        format_id,
        min_rate,
        max_rate,
        category,
        checked,
        searchInOnlySentense,
        searchInOnlyAnswer,
        searchInExplanation,
        onlyDirectCategory,
        result_from,
        result_to,
      } = req;

      const skip = result_from ? result_from - 1 : 0;
      const rangeCount =
        result_from !== undefined && result_to !== undefined
          ? result_to - result_from + 1
          : SEARCH_LIMITS.MAX_QUIZ_SEARCH_RESULTS;
      const take = Math.min(rangeCount, SEARCH_LIMITS.MAX_QUIZ_SEARCH_RESULTS);

      // onlyDirectCategory が true の場合、選択カテゴリの子カテゴリ名を取得
      let childCategoryNames: string[] = [];
      if (onlyDirectCategory && category) {
        const parentCategory = await prisma.category.findFirst({
          where: { name: category, file_num, deleted_at: null },
          select: { id: true },
        });
        if (parentCategory) {
          const childRelations = await prisma.category_parent_child.findMany({
            where: { parent_category_id: parentCategory.id, deleted_at: null },
            include: { child_category: { select: { name: true } } },
          });
          childCategoryNames = childRelations.map((r) => r.child_category.name);
        }
      }

      const whereClause = {
        // TODO 問題取得 format_idチェックボックス化による条件対応、、画面・pipe含めなんかやり方ややこしいのよな・・　もっと効率いいやり方模索したい
        ...(format_id && {
          format_id: {
            in: Object.entries(format_id)
              .filter((x) => x[1])
              .map((x) => +x[0]),
          },
        }),
        file_num,
        deleted_at: null,
        quiz_statistics_view: {
          accuracy_rate: {
            gte: min_rate || 0,
            lte: max_rate || 100,
          },
        },
        ...(category && {
          category_quiz: {
            some: {
              category: {
                name: {
                  contains: category,
                },
              },
              deleted_at: null,
            },
          },
        }),
        ...(checked
          ? {
              checked: true,
            }
          : {}),
        // onlyDirectCategory: 子カテゴリを一切持たない問題のみに絞り込む
        ...(onlyDirectCategory && childCategoryNames.length > 0
          ? {
              NOT: {
                category_quiz: {
                  some: {
                    category: { name: { in: childCategoryNames } },
                    deleted_at: null,
                  },
                },
              },
            }
          : {}),
        ...(query &&
          query !== '' &&
          (() => {
            const noneChecked =
              !searchInOnlySentense &&
              !searchInOnlyAnswer &&
              !searchInExplanation;
            const conditions = [
              ...(noneChecked || searchInOnlySentense
                ? [{ quiz_sentense: { contains: query } }]
                : []),
              ...(noneChecked || searchInOnlyAnswer
                ? [{ answer: { contains: query } }]
                : []),
              ...(noneChecked || searchInExplanation
                ? [
                    {
                      quiz_explanation: {
                        explanation: { contains: query },
                      },
                    },
                  ]
                : []),
            ];
            return conditions.length === 1
              ? conditions[0]
              : { OR: conditions };
          })()),
      };

      const [result, total] = await Promise.all([
        prisma.quiz.findMany({
          select: {
            id: true,
            file_num: true,
            quiz_num: true,
            quiz_sentense: true,
            answer: true,
            category_quiz: {
              select: {
                deleted_at: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            quiz_format: {
              select: {
                name: true,
              },
            },
            quiz_statistics_view: {
              select: {
                accuracy_rate: true,
              },
            },
            img_file: true,
            checked: true,
            quiz_explanation: {
              select: {
                explanation: true,
              },
            },
          },
          where: whereClause,
          orderBy: {
            quiz_num: 'asc',
          },
          skip,
          take,
        }),
        prisma.quiz.count({ where: whereClause }),
      ]);
      const quizzes = result.map((x) => {
        return {
          ...x,
          category_quiz: undefined,
          quiz_category: x.category_quiz
            .filter((cq) => !cq.deleted_at)
            .map((cq) => ({
              category: cq.category.name,
            })),
          quiz_statistics_view: {
            accuracy_rate: x.quiz_statistics_view.accuracy_rate.toString(),
          },
        };
      });
      return { total, quizzes };
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
      const { format_id, file_num, quiz_num } = req;
      return await prisma.quiz.update({
        data: {
          deleted_at: new Date(),
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num,
          },
          format_id,
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

  // 問題統合（とりあえず基礎問題のみ）
  async integrate(req: IntegrateToQuizAPIRequestDto) {
    try {
      // TODO ここがfile_num,quiz_numなので　quiz_idを送る形式に変更したい
      const { fromQuizId, toQuizId } = req;

      // 統合前の問題取得
      const pre_data = await prisma.quiz.findUnique({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          format_id: true,
          quiz_sentense: true,
          answer: true,
          category_quiz: {
            select: {
              deleted_at: true,
              category: {
                select: {
                  name: true,
                },
              },
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
          id: fromQuizId,
          deleted_at: null,
        },
      });

      // 統合後の問題取得
      const post_data = await prisma.quiz.findUnique({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          format_id: true,
          quiz_sentense: true,
          answer: true,
          category_quiz: {
            select: {
              deleted_at: true,
              category: {
                select: {
                  name: true,
                },
              },
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
          id: toQuizId,
          deleted_at: null,
        },
      });

      // 問題形式違う場合は統合させない
      if (pre_data.format_id !== post_data.format_id) {
        throw new HttpException(
          `入力した問題は違う形式同士のため統合できません`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 統合データ作成
      const pre_category = new Set(
        pre_data.category_quiz
          ? pre_data.category_quiz
              .filter((x) => {
                return !x.deleted_at;
              })
              .map((x) => {
                return x.category.name;
              })
          : [],
      );
      const post_category = new Set(
        post_data.category_quiz
          ? post_data.category_quiz
              .filter((x) => {
                return !x.deleted_at;
              })
              .map((x) => {
                return x.category.name;
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
        await prisma.category_quiz.updateMany({
          where: {
            quiz_id: fromQuizId,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        await prisma.category_quiz.updateMany({
          where: {
            quiz_id: toQuizId,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        //// 統合後問題にカテゴリ更新
        const file_num = post_data.file_num;
        for (const c of new_category) {
          const cat = await prisma.category.upsert({
            where: {
              name_file_num: {
                name: c,
                file_num,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              name: c,
              file_num,
            },
          });
          await prisma.category_quiz.upsert({
            where: {
              quiz_id_category_id: {
                quiz_id: toQuizId,
                category_id: cat.id,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              quiz_id: toQuizId,
              category_id: cat.id,
            },
          });
        }

        // 統合元データは削除、それまでの解答ログデータも削除
        await prisma.quiz.update({
          data: {
            deleted_at: new Date(),
          },
          where: {
            id: fromQuizId,
          },
        });
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            quiz_id: fromQuizId,
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
      const { quiz_id, category } = req;
      const quiz_ids = quiz_id.split(',').map((x) => {
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
        for (const quiz_id of quiz_ids) {
          // quiz_idからfile_numを取得
          const quiz = await prisma.quiz.findUnique({
            select: { file_num: true },
            where: { id: quiz_id },
          });
          if (!quiz) {
            throw new HttpException(
              `問題が見つかりません(${quiz_id})`,
              HttpStatus.NOT_FOUND,
            );
          }
          // 更新
          for (const c of categories) {
            const cat = await prisma.category.upsert({
              where: {
                name_file_num: {
                  name: c,
                  file_num: quiz.file_num,
                },
              },
              update: {
                deleted_at: null,
              },
              create: {
                name: c,
                file_num: quiz.file_num,
              },
            });
            await prisma.category_quiz.upsert({
              where: {
                quiz_id_category_id: {
                  quiz_id,
                  category_id: cat.id,
                },
              },
              update: {
                deleted_at: null,
              },
              create: {
                quiz_id,
                category_id: cat.id,
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
      const { quiz_id, category } = body;
      const quiz_ids = quiz_id.split(',').map((x) => {
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
        for (const quiz_id of quiz_ids) {
          // quiz_idからfile_numを取得
          const quiz = await prisma.quiz.findUnique({
            select: { file_num: true },
            where: { id: quiz_id },
          });
          if (!quiz) {
            continue;
          }

          for (const c of categories) {
            // categoryマスターからIDを取得
            const cat = await prisma.category.findUnique({
              where: {
                name_file_num: {
                  name: c,
                  file_num: quiz.file_num,
                },
              },
            });
            if (!cat) {
              continue;
            }

            // category_quizをsoft-delete
            const existing = await prisma.category_quiz.findUnique({
              where: {
                quiz_id_category_id: {
                  quiz_id,
                  category_id: cat.id,
                },
              },
            });
            if (existing && !existing.deleted_at) {
              await prisma.category_quiz.update({
                data: {
                  deleted_at: new Date(),
                },
                where: {
                  quiz_id_category_id: {
                    quiz_id,
                    category_id: cat.id,
                  },
                },
              });
            }
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
      const { quiz_id } = req;
      const quiz_ids = quiz_id.split(',').map((x) => {
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
        for (const quiz_id of quiz_ids) {
          await prisma.quiz.update({
            data: {
              checked: true,
            },
            where: {
              id: quiz_id,
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
      const { quiz_id } = req;
      const quiz_ids = quiz_id.split(',').map((x) => {
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
        for (const quiz_id of quiz_ids) {
          await prisma.quiz.update({
            data: {
              checked: false,
            },
            where: {
              id: quiz_id,
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
      const { quiz_id } = req;
      if (isNaN(+quiz_id)) {
        throw new HttpException(
          `問題番号が不正です(${quiz_id})`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const checked = (
        await prisma.quiz.findUnique({
          select: {
            checked: true,
          },
          where: {
            id: +quiz_id,
          },
        })
      ).checked;
      return await prisma.quiz.update({
        data: {
          checked: !checked,
        },
        where: {
          id: +quiz_id,
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
          quiz: {
            file_num: file_id,
          },
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

  // 過去のデータから回答数統計データ取得
  async getAnswerLogStatistics(req: GetAnswerLogStatisticsAPIRequestDto) {
    try {
      const { file_num, date_unit } = req;
      //実行時の日付
      const nowDate = new Date();
      //実行時の次の日の日付
      const tomorrowDate = new Date(nowDate);
      tomorrowDate.setDate(nowDate.getDate() + 1);
      tomorrowDate.setHours(0, 0, 0, 0);

      // DB検索で使用する始値と終値
      let startDate = getStartDateForStatistics(nowDate, date_unit);
      let endDate = tomorrowDate;
      const result: AnswerLogStatisticsApiResponse[] = [];
      for (let i = 0; i < 10; i++) {
        const answerLogStat =
          file_num && file_num !== -1
            ? await prisma.$queryRaw<
                { file_num: number; count: number; clear: number }[]
              >`
        select
        	q.file_num ,
        	COUNT(*) as count,
        	SUM(CASE WHEN al.is_corrected  THEN 1 ELSE 0 END) as clear
        from
        answer_log al 
        inner join
        quiz q 
        on
        al.quiz_id = q.id  
        where 
        q.file_num = ${file_num} 
        and
        al.created_at >= ${startDate} 
        and
        al.created_at < ${endDate}
        group by
        q.file_num 
      `
            : await prisma.$queryRaw<
                { file_num: number; count: number; clear: number }[]
              >`
    select
      q.file_num ,
      COUNT(*) as count,
      SUM(CASE WHEN al.is_corrected  THEN 1 ELSE 0 END) as clear
    from
    answer_log al 
    inner join
    quiz q 
    on
    al.quiz_id = q.id  
    where 
    al.created_at >= ${startDate} 
    and
    al.created_at < ${endDate}
    group by
    q.file_num 
  `;

        result.push({
          date: startDate
            .toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\//g, '-'),
          count: Number(answerLogStat[0]?.count) || 0,
          accuracy_rate: answerLogStat[0]?.count
            ? (100 * Number(answerLogStat[0]?.clear || 0)) /
              Number(answerLogStat[0]?.count)
            : 0,
        });

        // 始値の1日前の日付を取得
        const oneDayAgo = new Date(startDate);
        oneDayAgo.setDate(startDate.getDate() - 1);

        endDate = startDate;
        startDate = getStartDateForStatistics(oneDayAgo, date_unit);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 問題形式リスト取得
  async getQuizFormatList() {
    return await prisma.quiz_format.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  parseCsv = async <T>(file: Express.Multer.File): Promise<ParseResult<T>> => {
    const stream = Readable.from(file.buffer);
    return new Promise((resolve, reject) => {
      parse(stream, {
        header: false,
        skipEmptyLines: true,
        transform: (value: string): string => {
          return value.trim();
        },
        complete: (results: ParseResult<T>) => {
          return resolve(results);
        },
        error: (error: Error) => {
          return reject(error);
        },
      });
    });
  };

  // アップロードされた問題CSV(基礎・応用)を登録
  // TODO csvのバリデーション処理
  async uploadFile(file: Express.Multer.File) {
    try {
      const csvData = await this.parseCsv<string>(file);
      // トランザクション
      await prisma.$transaction(
        async (prisma) => {
          // csvデータ１行ずつ読み込み
          for (const [index, row] of csvData.data.entries()) {
            // (問題形式,問題ファイル番号,問題文,答え文,解説,カテゴリ,画像ファイル名) でない場合終了
            if (row.length !== 7) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row.length}列)`,
                HttpStatus.BAD_REQUEST,
              );
            }
            const [
              format_id,
              file_num,
              question,
              answer,
              explanation,
              categories,
              img_file,
            ] = row;
            // バリデーション
            if (isNaN(+file_num)) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row})`,
                HttpStatus.BAD_REQUEST,
              );
            }
            if (+format_id < 1 || +format_id > 2) {
              throw new HttpException(
                `問題形式が正しくありません(${format_id})`,
                HttpStatus.BAD_REQUEST,
              );
            }
            // カテゴリあれば複数個に分けておく
            const category =
              categories && categories !== ''
                ? categories.split(':')
                : undefined;
            // 問題データ登録
            // 新問題番号を取得しINSERT
            const res = await prisma.quiz.findFirst({
              select: {
                quiz_num: true,
              },
              where: {
                file_num: +file_num,
              },
              orderBy: {
                quiz_num: 'desc',
              },
              take: 1,
            });
            const new_quiz_num: number =
              res && res.quiz_num ? res.quiz_num + 1 : 1;
            const createdQuiz = await prisma.quiz.create({
              data: {
                format_id: +format_id, // 問題形式
                file_num: +file_num,
                quiz_num: new_quiz_num,
                quiz_sentense: question,
                answer,
                img_file,
                checked: false,
                quiz_explanation: {
                  ...(explanation && {
                    create: {
                      explanation,
                    },
                  }),
                },
              },
            });
            // カテゴリをcategoryマスター + category_quizに登録
            if (category) {
              for (const c of category) {
                const cat = await prisma.category.upsert({
                  where: {
                    name_file_num: {
                      name: c,
                      file_num: +file_num,
                    },
                  },
                  update: {
                    deleted_at: null,
                  },
                  create: {
                    name: c,
                    file_num: +file_num,
                  },
                });
                await prisma.category_quiz.create({
                  data: {
                    quiz_id: createdQuiz.id,
                    category_id: cat.id,
                  },
                });
              }
            }
            console.log(`OK: ${index + 1}行目`);
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );
      return { result: 'All Registered!!' };
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // アップロードされた四択問題CSVを登録
  // TODO csvのバリデーション処理
  async uploadFourChoiceFile(file: Express.Multer.File) {
    try {
      const csvData = await this.parseCsv<string>(file);
      // トランザクション
      await prisma.$transaction(
        async (prisma) => {
          // csvデータ１行ずつ読み込み
          for (const [index, row] of csvData.data.entries()) {
            // (問題ファイル番号,答えの数,問題文,答え文,ダミー選択肢1,ダミー選択肢2,ダミー選択肢3,解説,カテゴリ) でない場合終了
            if (row.length !== 9) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row.length}列)`,
                HttpStatus.BAD_REQUEST,
              );
            }
            const [
              file_num,
              answer_num,
              question,
              answer,
              dummy1,
              dummy2,
              dummy3,
              explanation,
              categories,
            ] = row;
            // バリデーション
            if (isNaN(+file_num)) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row})`,
                HttpStatus.BAD_REQUEST,
              );
            }
            // ダミー選択肢のデータ作成
            const dummyChoiceData = [dummy1, dummy2, dummy3].map((d, index) => {
              return {
                dummy_choice_sentense: d,
                is_corrected: index + 2 <= +answer_num ? true : false,
              };
            });
            // カテゴリあれば複数個に分けておく
            const category =
              categories && categories !== ''
                ? categories.split(':')
                : undefined;
            // 問題データ登録
            // 新問題番号を取得しINSERT
            const res = await prisma.quiz.findFirst({
              select: {
                quiz_num: true,
              },
              where: {
                file_num: +file_num,
              },
              orderBy: {
                quiz_num: 'desc',
              },
              take: 1,
            });
            const new_quiz_num: number =
              res && res.quiz_num ? res.quiz_num + 1 : 1;
            const createdQuiz = await prisma.quiz.create({
              data: {
                format_id: 3, // 四択問題
                file_num: +file_num,
                quiz_num: new_quiz_num,
                quiz_sentense: question,
                answer,
                // img_file,
                checked: false,
                quiz_explanation: {
                  ...(explanation && {
                    create: {
                      explanation,
                    },
                  }),
                },
                //  関連問題設定もとりあえず今は無しで
                quiz_dummy_choice: {
                  createMany: {
                    data: dummyChoiceData,
                  },
                },
              },
            });
            // カテゴリをcategoryマスター + category_quizに登録
            if (category) {
              for (const c of category) {
                const cat = await prisma.category.upsert({
                  where: {
                    name_file_num: {
                      name: c,
                      file_num: +file_num,
                    },
                  },
                  update: {
                    deleted_at: null,
                  },
                  create: {
                    name: c,
                    file_num: +file_num,
                  },
                });
                await prisma.category_quiz.create({
                  data: {
                    quiz_id: createdQuiz.id,
                    category_id: cat.id,
                  },
                });
              }
            }
            console.log(`OK: ${index + 1}行目`);
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );
      return { result: 'All Registered!!' };
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題用の画像をS3にアップロードする
  async uploadQuizImage(file: Express.Multer.File): Promise<string> {
    return uploadQuizImageToS3(file);
  }

  // 問題用の画像をS3からダウンロードする
  async downloadQuizImage(fileName: string): Promise<Buffer> {
    return getQuizImageFromS3(fileName);
  }

  // ファイルごとの正解率ヒストグラムデータ取得
  async getAccuracyRateHistgramData(file_num: number) {
    try {
      // 指定ファイルの回答ログ削除
      const result: number[] = Array(11).fill(0);
      const rates = await prisma.quiz_view.findMany({
        select: {
          id: true,
          accuracy_rate: true,
        },
        where: {
          ...(file_num &&
            file_num !== -1 && {
              file_num,
            }),
          deleted_at: null,
        },
      });
      rates.forEach((num) => {
        if (Number(num.accuracy_rate) === 100) {
          result[10]++; // 100ちょうど
        } else {
          const index = Math.floor(Number(num.accuracy_rate) / 10);
          result[index]++;
        }
      });
      return { result };
    } catch (error) {
      throw error; //
    }
  }

  // おすすめカテゴリ取得
  async getRecommendedCategories(file_num: number) {
    const RECENT_DAYS = 30;
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - RECENT_DAYS);

    // カテゴリとそのquiz_idを取得
    const categories = await prisma.category.findMany({
      where: { file_num, deleted_at: null },
      select: {
        id: true,
        name: true,
        category_quiz: {
          where: { deleted_at: null },
          select: { quiz_id: true },
        },
      },
    });

    if (categories.length === 0) return [];

    // 全カテゴリに紐づくquiz_idをまとめて取得
    const allQuizIds = [
      ...new Set(
        categories.flatMap((c) => c.category_quiz.map((cq) => cq.quiz_id)),
      ),
    ];

    // 対象quizの解答履歴を一括取得
    const answerLogs = await prisma.answer_log.findMany({
      where: {
        quiz_id: { in: allQuizIds },
        deleted_at: null,
      },
      select: {
        quiz_id: true,
        is_corrected: true,
        created_at: true,
      },
    });

    // quiz_id → 解答ログのマップを作成
    const logsByQuizId = new Map<number, { is_corrected: boolean | null; created_at: Date }[]>();
    for (const log of answerLogs) {
      if (!logsByQuizId.has(log.quiz_id)) logsByQuizId.set(log.quiz_id, []);
      logsByQuizId.get(log.quiz_id)!.push(log);
    }

    const scored = categories
      // 問題が一件も紐づいていないカテゴリは除外
      .filter((cat) => cat.category_quiz.length > 0)
      .map((cat) => {
        const quizIds = cat.category_quiz.map((cq) => cq.quiz_id);
        const catLogs = quizIds.flatMap((qid) => logsByQuizId.get(qid) ?? []);

        if (catLogs.length === 0) {
          return {
            category_name: cat.name,
            reason: 'neverAnswered' as const,
            days_since_last_answered: null,
            recent_accuracy_rate: null,
            _daysSinceLast: Infinity,
            _recentAccuracy: null as number | null,
          };
        }

        // 最終解答日
        const lastAnsweredAt = catLogs.reduce(
          (max, log) => (log.created_at > max ? log.created_at : max),
          catLogs[0].created_at,
        );
        const daysSinceLast = Math.floor(
          (Date.now() - lastAnsweredAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        // 直近30日の正解率
        const recentLogs = catLogs.filter((log) => log.created_at >= recentDate);
        const recentAccuracy =
          recentLogs.length > 0
            ? recentLogs.filter((log) => log.is_corrected).length / recentLogs.length
            : null;

        const reason: 'notRecent' | 'lowAccuracy' =
          recentAccuracy !== null && recentAccuracy < 0.5
            ? 'lowAccuracy'
            : 'notRecent';

        return {
          category_name: cat.name,
          reason,
          days_since_last_answered: daysSinceLast,
          recent_accuracy_rate:
            recentAccuracy !== null
              ? Math.round(recentAccuracy * 1000) / 1000
              : null,
          _daysSinceLast: daysSinceLast,
          _recentAccuracy: recentAccuracy,
        };
      });

    // 低正解率: 直近正解率が50%未満のカテゴリを正解率昇順で上位2件
    const lowAccuracyItems = scored
      .filter((c) => c._recentAccuracy !== null && c._recentAccuracy < 0.5)
      .sort((a, b) => (a._recentAccuracy ?? 1) - (b._recentAccuracy ?? 1))
      .slice(0, 2);

    const lowAccuracyNames = new Set(lowAccuracyItems.map((c) => c.category_name));

    // 放置気味: lowAccuracyで選ばれたものを除き、最終解答日が古い順で上位3件（未解答は最優先）
    const notRecentItems = scored
      .filter((c) => !lowAccuracyNames.has(c.category_name))
      .sort((a, b) => b._daysSinceLast - a._daysSinceLast)
      .slice(0, 3);

    return [...lowAccuracyItems, ...notRecentItems].map(
      ({ _daysSinceLast: _d, _recentAccuracy: _r, ...rest }) => rest,
    );
  }
}
