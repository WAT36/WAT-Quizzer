import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  ReverseCheckQuizAPIRequestDto,
  DeleteAnswerLogOfFileApiRequestDto,
  getRandomElementFromArray,
  getRandomElementsFromArray,
  AddCategoryToQuizAPIRequestDto,
  DeleteCategoryOfQuizAPIRequestDto,
  IntegrateToQuizAPIRequestDto,
  GetQuizAPIRequestParsedDto,
  GetQuizMethod,
  SearchQuizAPIRequestParsedDto,
  prisma,
  MESSAGES,
} from 'quizzer-lib';
import {
  activeCategoryNames,
  includeActiveCategories,
  linkCategories,
  linkNewQuizCategoriesWithAncestors,
} from './quizCategory';
import {
  assertQuizIds,
  parseMatchedBasicQuizIds,
  trimSpaces,
} from './quizRequest';
import {
  getQuizOrderBy,
  getQuizSelect,
  getQuizWhere,
  searchQuizRange,
  searchQuizSelect,
  searchQuizWhere,
} from './quizQuery';

@Injectable()
export class QuizService {
  // 問題取得
  async getQuiz(req: GetQuizAPIRequestParsedDto, method?: GetQuizMethod) {
    const { count } = req;
    // countはmethod指定時（条件検索）のみ有効。件数指定がなければ従来通り1件取得
    const isBatchRequest = !!method && !!count && count > 0;
    const where = getQuizWhere(req, method);
    // ランダム系メソッド（条件に合う全件から抽選する）
    const isRandomMethod = method === 'random' || method === 'todayNotAnswered';
    // データ取得
    // ランダム系は全件の詳細を取得するとLambdaのメモリ・実行時間の上限を超えるため、
    // 条件に合う問題のIDだけ全件取得 → 抽選 → 抽選した問題の詳細だけ取得する
    // それ以外は必要件数のみ取得してDBからの転送量を削減（method無し=問題番号指定は元々1件）
    const fetchRandomQuizzes = async () => {
      const ids = await prisma.quiz.findMany({ select: { id: true }, where });
      const pickedIds = (
        isBatchRequest
          ? getRandomElementsFromArray(ids, count)
          : [getRandomElementFromArray(ids)]
      )
        .filter((x) => x !== undefined)
        .map((x) => x.id);
      const picked =
        pickedIds.length > 0
          ? await prisma.quiz.findMany({
              select: getQuizSelect,
              where: { id: { in: pickedIds } },
            })
          : [];
      // 抽選した順に並べ直す
      const shuffled = pickedIds
        .map((id) => picked.find((quiz) => quiz.id === id))
        .filter((quiz) => quiz !== undefined);
      return [shuffled, ids.length] as const;
    };
    const [results, totalCount] = isRandomMethod
      ? await fetchRandomQuizzes()
      : await Promise.all([
          prisma.quiz.findMany({
            select: getQuizSelect,
            where,
            orderBy: getQuizOrderBy(method),
            ...(method ? { take: isBatchRequest ? count : 1 } : {}),
          }),
          method ? prisma.quiz.count({ where }) : Promise.resolve(null),
        ]);
    if (results.length === 0) {
      throw new HttpException(
        `条件に合致するデータはありません`,
        HttpStatus.NOT_FOUND,
      );
    }
    // 1件分の結果を返却用の形に整形する
    const shapeResult = (result: (typeof results)[number]) => ({
      ...result,
      category_quiz: undefined,
      ...(result.category_quiz && {
        quiz_category: activeCategoryNames(result.category_quiz).map(
          (category) => ({ category }),
        ),
      }),
      ...(result.quiz_statistics_view && {
        quiz_statistics_view: {
          clear_count: Number(result.quiz_statistics_view.clear_count),
          fail_count: Number(result.quiz_statistics_view.fail_count),
          accuracy_rate: Number(result.quiz_statistics_view.accuracy_rate),
        },
      }),
    });
    // count指定時（出題数分まとめて取得）は複数件返却する
    if (isBatchRequest) {
      return {
        total: totalCount ?? results.length,
        quizzes: results.map(shapeResult),
      };
    }
    return {
      ...shapeResult(results[0]),
      count: totalCount ?? results.length,
    };
  }

  // 正解登録
  async cleared(req: ClearQuizAPIRequestDto) {
    return this.createAnswerLog(req.quiz_id, true);
  }

  // 不正解登録
  async failed(req: FailQuizAPIRequestDto) {
    return this.createAnswerLog(req.quiz_id, false);
  }

  // 解答ログを登録
  private async createAnswerLog(quiz_id: number, is_corrected: boolean) {
    return prisma.answer_log.create({ data: { quiz_id, is_corrected } });
  }

  // 問題を１問追加
  async add(req: AddQuizAPIRequestDto) {
    const {
      file_num,
      category,
      img_file,
      format_id,
      matched_basic_quiz_id,
      dummyChoice,
      explanation,
    } = req;
    // 問題文と答えは前後の半角・全角スペースを削除して登録
    const question = trimSpaces(req.question);
    const answer = trimSpaces(req.answer);
    if (!file_num || !question || !answer || !format_id) {
      throw new HttpException(
        `ファイル番号または問題文または答えが入力されていません。`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 関連する基礎問題番号リストのバリデーション・取得
    const matched_basic_quiz_id_list = parseMatchedBasicQuizIds(
      matched_basic_quiz_id,
    );

    // 四択問題の場合　ダミー選択肢全部ない場合エラー
    if (
      format_id === 3 &&
      dummyChoice &&
      dummyChoice.length < 3 &&
      dummyChoice.reduce((accummulate, currentValue) => {
        return accummulate || currentValue.sentense === '';
      }, false)
    ) {
      throw new HttpException(MESSAGES.ERROR.MSG00018, HttpStatus.BAD_REQUEST);
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

    // カテゴリとその祖先カテゴリを問題に紐付ける
    if (category) {
      await linkNewQuizCategoriesWithAncestors(
        prisma,
        createdQuiz.id,
        file_num,
        category.split(','),
      );
    }

    return createdQuiz;
  }

  // 問題編集
  async edit(req: EditQuizAPIRequestDto) {
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
    const matched_basic_quiz_id_list = parseMatchedBasicQuizIds(
      matched_basic_quiz_id,
    );

    // クエリ用意
    const updatedQuiz = await prisma.$transaction(async (prisma) => {
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
      // ダミー選択肢更新（id昇順で取得し、画面の並び順と対応させて更新する）
      if (dummyChoice) {
        const dummyChoiceIds = await prisma.quiz_dummy_choice.findMany({
          select: {
            id: true,
          },
          where: {
            quiz_id: updatedQuiz.id,
          },
          orderBy: {
            id: 'asc',
          },
        });
        // 登録済みのダミー選択肢と件数が異なる場合はエラー
        if (dummyChoiceIds.length !== dummyChoice.length) {
          throw new HttpException(
            MESSAGES.ERROR.MSG00019,
            HttpStatus.BAD_REQUEST,
          );
        }
        for (const [i, { id }] of dummyChoiceIds.entries()) {
          await prisma.quiz_dummy_choice.update({
            data: {
              dummy_choice_sentense: dummyChoice[i].sentense,
              is_corrected: dummyChoice[i].isCorrect,
            },
            where: {
              id,
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
      await linkCategories(prisma, quiz_id, file_num, category.split(','));
      // ログ削除
      await prisma.answer_log.updateMany({
        data: {
          deleted_at: new Date(),
        },
        where: {
          quiz_id,
        },
      });
      return updatedQuiz;
    });
    // 更新後の問題を返す
    return updatedQuiz;
  }

  // 問題検索
  async search(req: SearchQuizAPIRequestParsedDto) {
    const { file_num, category_and, onlyDirectCategory } = req;
    // onlyDirectCategory: AND指定カテゴリの子カテゴリ（ANDで選択済みのものを除く）を一切持たない問題のみに絞り込む
    const excludedChildCategories =
      onlyDirectCategory && category_and && category_and.length > 0
        ? await this.findChildCategoryNames(file_num, category_and)
        : [];
    const where = searchQuizWhere(req, excludedChildCategories);
    const [result, total] = await Promise.all([
      prisma.quiz.findMany({
        select: searchQuizSelect,
        where,
        orderBy: { quiz_num: 'asc' },
        ...searchQuizRange(req),
      }),
      prisma.quiz.count({ where }),
    ]);
    const quizzes = result.map((x) => ({
      ...x,
      category_quiz: undefined,
      quiz_category: activeCategoryNames(x.category_quiz).map((category) => ({
        category,
      })),
      quiz_statistics_view: {
        accuracy_rate: Number(x.quiz_statistics_view.accuracy_rate),
      },
    }));
    return { total, quizzes };
  }

  // 指定カテゴリの子カテゴリ名（指定カテゴリ自身は除く）
  private async findChildCategoryNames(file_num: number, names: string[]) {
    const childRelations = await prisma.category_parent_child.findMany({
      where: {
        parent_category: { name: { in: names }, file_num, deleted_at: null },
        deleted_at: null,
      },
      include: { child_category: { select: { name: true } } },
    });
    const selected = new Set(names);
    return Array.from(
      new Set(childRelations.map((r) => r.child_category.name)),
    ).filter((name) => !selected.has(name));
  }

  // 問題削除
  async delete(req: DeleteQuizAPIRequestDto) {
    const { file_num, quiz_num } = req;
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
  }

  // 問題統合（とりあえず基礎問題のみ）
  async integrate(req: IntegrateToQuizAPIRequestDto) {
    const { fromQuizId, toQuizId } = req;

    // 同じ問題同士は統合させない（統合先の問題が削除されてしまうため）
    if (fromQuizId === toQuizId) {
      throw new HttpException(
        `統合元と統合先に同じ問題は指定できません`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 統合元・統合先の問題取得（統合に必要な項目のみ）
    const findQuiz = (id: number) =>
      prisma.quiz.findUnique({
        select: {
          file_num: true,
          format_id: true,
          category_quiz: {
            select: { deleted_at: true, category: { select: { name: true } } },
          },
        },
        where: { id, deleted_at: null },
      });
    const [pre_data, post_data] = await Promise.all([
      findQuiz(fromQuizId),
      findQuiz(toQuizId),
    ]);

    // 統合元・統合先の問題が存在しない場合はエラー
    if (!pre_data || !post_data) {
      throw new HttpException(
        `統合${!pre_data ? '元' : '先'}の問題が見つかりません(${!pre_data ? fromQuizId : toQuizId})`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 問題形式違う場合は統合させない
    if (pre_data.format_id !== post_data.format_id) {
      throw new HttpException(
        `入力した問題は違う形式同士のため統合できません`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 統合データ作成
    const new_category = Array.from(
      new Set([
        ...activeCategoryNames(pre_data.category_quiz),
        ...activeCategoryNames(post_data.category_quiz),
      ]),
    );

    // トランザクション
    const integratedQuiz = await prisma.$transaction(async (prisma) => {
      // 問題統合(カテゴリのみ)
      //// 統合元・統合先のカテゴリを一度削除し、統合後のカテゴリを統合先に紐付ける
      await prisma.category_quiz.updateMany({
        where: { quiz_id: { in: [fromQuizId, toQuizId] } },
        data: { deleted_at: new Date() },
      });
      await linkCategories(prisma, toQuizId, post_data.file_num, new_category);

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

      // 統合後の統合先問題を返す
      return prisma.quiz.findUnique({
        include: includeActiveCategories,
        where: {
          id: toQuizId,
        },
      });
    });

    return integratedQuiz;
  }

  // 問題にカテゴリ追加
  async addCategoryToQuiz(req: AddCategoryToQuizAPIRequestDto) {
    const { quiz_ids, category } = req;
    assertQuizIds(quiz_ids);
    const categories = category.split(',');
    // トランザクション
    const updatedQuizzes = await prisma.$transaction(async (prisma) => {
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
        await linkCategories(prisma, quiz_id, quiz.file_num, categories);
      }

      // カテゴリ追加後の問題を返す
      return prisma.quiz.findMany({
        include: includeActiveCategories,
        where: {
          id: { in: quiz_ids },
        },
        orderBy: {
          id: 'asc',
        },
      });
    });
    return updatedQuizzes;
  }

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: DeleteCategoryOfQuizAPIRequestDto) {
    const { quiz_ids, category } = body;
    assertQuizIds(quiz_ids);
    const categories = category.split(',');
    // トランザクション
    const updatedQuizzes = await prisma.$transaction(async (prisma) => {
      // 問題と同じファイルの指定カテゴリへの紐付けを削除する（存在しない問題・カテゴリは無視）
      const quizzes = await prisma.quiz.findMany({
        select: { id: true, file_num: true },
        where: { id: { in: quiz_ids } },
      });
      const fileNums = [...new Set(quizzes.map((q) => q.file_num))];
      if (fileNums.length > 0) {
        await prisma.category_quiz.updateMany({
          data: { deleted_at: new Date() },
          where: {
            deleted_at: null,
            OR: fileNums.map((file_num) => ({
              quiz_id: {
                in: quizzes
                  .filter((q) => q.file_num === file_num)
                  .map((q) => q.id),
              },
              category: { file_num, name: { in: categories } },
            })),
          },
        });
      }

      // カテゴリ削除後の問題を返す（存在しない問題は含まない）
      return prisma.quiz.findMany({
        include: includeActiveCategories,
        where: {
          id: { in: quiz_ids },
        },
        orderBy: {
          id: 'asc',
        },
      });
    });
    return updatedQuizzes;
  }

  // 問題にチェック追加
  async check(req: CheckQuizAPIRequestDto) {
    return await this.updateChecked(req.quiz_ids, true);
  }

  // 問題にチェック外す
  async uncheck(req: CheckQuizAPIRequestDto) {
    return await this.updateChecked(req.quiz_ids, false);
  }

  // 指定した問題のチェック状態をまとめて更新する
  // 存在しない問題が含まれていたら、どれも更新せずに404にする
  private async updateChecked(quiz_ids: unknown, checked: boolean) {
    assertQuizIds(quiz_ids);
    return await prisma.$transaction(async (prisma) => {
      const existingIds = new Set(
        (
          await prisma.quiz.findMany({
            select: { id: true },
            where: { id: { in: quiz_ids } },
          })
        ).map(({ id }) => id),
      );
      const missingIds = [
        ...new Set(quiz_ids.filter((id) => !existingIds.has(id))),
      ];
      if (missingIds.length > 0) {
        throw new HttpException(
          `問題が見つかりません(${missingIds.join(',')})`,
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedQuizzes = [];
      for (const quiz_id of quiz_ids) {
        updatedQuizzes.push(
          await prisma.quiz.update({
            data: { checked },
            where: { id: quiz_id },
          }),
        );
      }
      return updatedQuizzes;
    });
  }

  // 問題のチェック反転
  async reverseCheck(req: ReverseCheckQuizAPIRequestDto) {
    const { quiz_id } = req;
    if (!Number.isInteger(quiz_id)) {
      throw new HttpException(
        `問題番号が不正です(${quiz_id})`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const quiz = await prisma.quiz.findUnique({
      select: { checked: true },
      where: { id: quiz_id },
    });
    if (!quiz) {
      throw new HttpException(
        `問題が見つかりません(${quiz_id})`,
        HttpStatus.NOT_FOUND,
      );
    }
    return await prisma.quiz.update({
      data: { checked: !quiz.checked },
      where: { id: quiz_id },
    });
  }

  // 回答ログ削除(ファイル指定)
  async deleteAnswerLogByFile(req: DeleteAnswerLogOfFileApiRequestDto) {
    const { file_id } = req;
    // 指定ファイルの回答ログ削除
    const { count } = await prisma.answer_log.updateMany({
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
    // 削除した回答ログの件数を返す
    return { count };
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
}
