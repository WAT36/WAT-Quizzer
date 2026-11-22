import { HttpException, HttpStatus } from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  prisma,
  getRandomElementFromArray,
  getRandomElementsFromArray,
  xor,
} from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    quiz: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      createManyAndReturn: jest.fn(),
    },
    quiz_explanation: {
      createMany: jest.fn(),
    },
    quiz_file: {
      findMany: jest.fn(),
    },
    answer_log: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    quiz_basis_advanced_linkage: {
      updateMany: jest.fn(),
      upsert: jest.fn(),
    },
    quiz_dummy_choice: {
      findMany: jest.fn(),
      update: jest.fn(),
      createMany: jest.fn(),
    },
    category: {
      createMany: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    category_quiz: {
      create: jest.fn(),
      createMany: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    category_parent_child: {
      findMany: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
    getRandomElementFromArray: jest.fn(),
    getRandomElementsFromArray: jest.fn(),
    getTodayStart: jest.fn(),
    xor: jest.fn(),
    MESSAGES: jest.requireActual('quizzer-lib').MESSAGES,
    containsAny: jest.requireActual('quizzer-lib').containsAny,
    SEARCH_LIMITS: {
      MAX_QUIZ_SEARCH_RESULTS: 200,
    },
  };
});

describe('QuizService', () => {
  let quizService: QuizService;

  const getQuizResultTest = [
    {
      id: 0,
      file_num: 0,
      quiz_num: 0,
      quiz_sentense: '品詞テスト',
      quiz_category: [
        {
          category: 'カテゴリ',
        },
      ],
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
      answer: '品詞テスト',
      img_file: 'img',
      checked: 0,
      clear_count: 0,
      fail_count: 0,
      created_at: '2000-01-01 00:00:00',
      updated_at: '2000-01-01 00:00:00',
      deleted_at: null,
    },
  ];

  beforeEach(() => {
    quizService = new QuizService();
  });

  // 問題取得 正常系
  it('getQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(await quizService.getQuiz({ file_num: 1, quiz_num: 1 })).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
  });

  // 問題取得 関連基礎問題・関連応用問題は、削除済みの関連付けを除いて取得する
  it('getQuiz - 削除済みの関連付けは取得しない', async () => {
    (prisma.quiz.findMany as jest.Mock).mockClear();
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    await quizService.getQuiz({ file_num: 1, quiz_num: 1 });
    const { select } = (prisma.quiz.findMany as jest.Mock).mock.calls[0][0];
    expect(select.quiz_advanced_linkage.where).toEqual({ deleted_at: null });
    expect(select.quiz_basis_linkage.where).toEqual({ deleted_at: null });
  });

  // 問題取得 format_idで形式を絞り込む（番号指定・条件指定とも）
  it('getQuiz - format_id', async () => {
    (prisma.quiz.findMany as jest.Mock).mockClear();
    (prisma.quiz.findMany as jest.Mock).mockResolvedValue(getQuizResultTest);
    (prisma.quiz.count as jest.Mock).mockResolvedValue(1);
    await quizService.getQuiz({ file_num: 1, quiz_num: 1, format_id: [1, 3] });
    await quizService.getQuiz({ file_num: 1, format_id: [2] }, 'worstRate');
    await quizService.getQuiz({ file_num: 1, quiz_num: 1 });
    const wheres = (prisma.quiz.findMany as jest.Mock).mock.calls.map(
      (call) => call[0].where,
    );
    expect(wheres[0].format_id).toEqual({ in: [1, 3] });
    expect(wheres[1].format_id).toEqual({ in: [2] });
    expect(wheres[2].format_id).toBeUndefined();
  });

  // 問題取得 異常系
  it('getQuiz - NG', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([]);
    await expect(
      quizService.getQuiz({ file_num: 1, quiz_num: 1 }),
    ).rejects.toMatchObject({
      message: '条件に合致するデータはありません',
    });
  });

  // 問題ランダム取得 正常系
  it('getRandomQuiz - OK', async () => {
    // 1回目: 条件に合う問題のID一覧、2回目: 抽選した問題の詳細
    (prisma.quiz.findMany as jest.Mock)
      .mockResolvedValueOnce([{ id: getQuizResultTest[0].id }])
      .mockResolvedValueOnce(getQuizResultTest);
    (getRandomElementFromArray as jest.Mock).mockReturnValueOnce({
      id: getQuizResultTest[0].id,
    });
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'random'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
  });

  // 最低正解率問題取得 正常系
  it('getWorstRateQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'worstRate'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
  });

  // 最小正解数問題取得 正常系
  it('getMinimumAnsweredQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'leastClear'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
  });

  // 最後に回答してから最も長い時間が経っている問題を取得 正常系
  it('getLRUQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'LRU'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
  });

  // 直近更新のあった問題を取得 正常系
  it('getRecentlyUpdatedQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz(
        { file_num: 1, quiz_num: 1 },
        'recentlyUpdated',
      ),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
    expect(prisma.quiz.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        orderBy: [{ updated_at: 'desc' }, { id: 'desc' }],
      }),
    );
  });

  // 昨日間違えた問題（reviewメソッド）の取得 正常系テスト
  it('getReviewQuiz - OK', async () => {
    // quiz_statistics_view.findFirstでlast_failed_answer_logを返すモック
    // quiz.service内部で quiz_statistics_view.findFirst を使いたいが、prisma.quiz_statistics_view.findFirst はmockされていないので追加
    (prisma.quiz_statistics_view as any) = {
      findFirst: jest
        .fn()
        .mockResolvedValueOnce({ last_failed_answer_log: new Date() }),
    };
    // getRandomElementFromArrayのモック
    (getRandomElementFromArray as jest.Mock).mockReturnValueOnce(
      getQuizResultTest[0],
    );
    // quiz.findManyのモック
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );

    const result = await quizService.getQuiz(
      { file_num: 1, quiz_num: 1 },
      'review',
    );
    expect(result).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
    });
  });

  // 出題数(count)指定時の複数件取得テスト用データ
  const getQuizResultTestBatch = [
    getQuizResultTest[0],
    {
      ...getQuizResultTest[0],
      id: 1,
      quiz_num: 1,
      quiz_sentense: '品詞テスト2',
      answer: '品詞テスト2',
    },
  ];

  // 最低正解率問題取得（出題数指定）正常系
  it('getWorstRateQuiz - count指定でN件取得', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTestBatch,
    );
    (prisma.quiz.count as jest.Mock).mockResolvedValueOnce(2);
    expect(
      await quizService.getQuiz({ file_num: 1, count: 2 }, 'worstRate'),
    ).toEqual({
      total: 2,
      quizzes: getQuizResultTestBatch.map((quiz) => ({
        ...quiz,
        quiz_statistics_view: {
          clear_count: 1,
          fail_count: 1,
          accuracy_rate: 50,
        },
      })),
    });
  });

  // ランダム問題取得（出題数指定）正常系
  it('getRandomQuiz - count指定でN件取得', async () => {
    // 1回目: 条件に合う問題のID一覧、2回目: 抽選した問題の詳細
    (prisma.quiz.findMany as jest.Mock)
      .mockResolvedValueOnce(getQuizResultTestBatch.map(({ id }) => ({ id })))
      .mockResolvedValueOnce(getQuizResultTestBatch);
    (getRandomElementsFromArray as jest.Mock).mockReturnValueOnce(
      getQuizResultTestBatch.map(({ id }) => ({ id })),
    );
    expect(
      await quizService.getQuiz({ file_num: 1, count: 2 }, 'random'),
    ).toEqual({
      total: 2,
      quizzes: getQuizResultTestBatch.map((quiz) => ({
        ...quiz,
        quiz_statistics_view: {
          clear_count: 1,
          fail_count: 1,
          accuracy_rate: 50,
        },
      })),
    });
  });

  // 忘却曲線に基づく復習問題取得（出題数指定）正常系
  it('getSpacedReviewQuiz - 期日超過の度合いが大きい順に、出題数分だけ詳細を取得する', async () => {
    // 1回目: 期日が来た問題のIDと期日超過の度合い、2回目: 選んだ問題の詳細（DBの返却順は不定）
    (prisma.quiz.findMany as jest.Mock)
      .mockResolvedValueOnce([
        { id: 0, quiz_review_schedule_view: { overdue_ratio: 1.5 } },
        { id: 2, quiz_review_schedule_view: { overdue_ratio: 1 } },
        { id: 1, quiz_review_schedule_view: { overdue_ratio: 30 } },
      ])
      .mockResolvedValueOnce(getQuizResultTestBatch);
    const result = await quizService.getQuiz(
      { file_num: 1, count: 2 },
      'spacedReview',
    );
    // 上位2件(id:1, id:0)だけ詳細を取得する
    expect(prisma.quiz.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: { id: { in: [1, 0] } } }),
    );
    // 総数は期日が来た問題すべての件数、並びは優先順
    expect(result).toEqual({
      total: 3,
      quizzes: [getQuizResultTestBatch[1], getQuizResultTestBatch[0]].map(
        (quiz) => ({
          ...quiz,
          quiz_statistics_view: {
            clear_count: 1,
            fail_count: 1,
            accuracy_rate: 50,
          },
        }),
      ),
    });
  });

  // 忘却曲線に基づく復習問題取得 期日が来た問題がない
  it('getSpacedReviewQuiz - 期日が来た問題がなければ404', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([]);
    await expect(
      quizService.getQuiz({ file_num: 1 }, 'spacedReview'),
    ).rejects.toThrow(
      new HttpException(
        '条件に合致するデータはありません',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  // 正解登録 正常系
  it('cleared - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.answer_log.create as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizService.cleared(req)).toEqual(testResult);
  });

  // 不正解登録 正常系
  it('failed - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.answer_log.create as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizService.failed(req)).toEqual(testResult);
  });

  // 問題を１問追加 正常系
  it('add - OK', async () => {
    // テストデータ
    const req = {
      file_num: 1,
      question: '問題文',
      answer: '答え',
      format_id: 2,
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        quiz_num: 1,
      },
    ];
    // 正解データ
    const correctData = [
      {
        result: `Added!! [0-2]:問題文,答え`,
      },
    ];
    (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(testResult);
    (prisma.quiz.create as jest.Mock).mockResolvedValue(correctData);
    (prisma.category as any).upsert.mockResolvedValue({ id: 1 });
    (prisma.category_quiz as any).create.mockResolvedValue({});
    (prisma.category_parent_child as any).findMany.mockResolvedValue([]);
    expect(await quizService.add(req)).toEqual(correctData);
  });

  // add 関連基礎問題は、応用問題・四択問題に紐付け、基礎問題には紐付けない
  it.each([
    [2, [{ basis_quiz_id: 3 }, { basis_quiz_id: 5 }]],
    [3, [{ basis_quiz_id: 3 }, { basis_quiz_id: 5 }]],
    [1, []],
  ])('add - 関連基礎問題 format_id=%i', async (format_id, expected) => {
    (prisma.quiz.findFirst as jest.Mock).mockResolvedValue({ quiz_num: 1 });
    (prisma.quiz.create as jest.Mock).mockClear();
    (prisma.quiz.create as jest.Mock).mockResolvedValue({ id: 99 });

    await quizService.add({
      file_num: 1,
      format_id,
      question: '問題文',
      answer: '答え',
      matched_basic_quiz_id: '3,5',
      dummyChoice:
        format_id === 3
          ? [1, 2, 3].map((i) => ({ sentense: `ダミー${i}`, isCorrect: false }))
          : undefined,
    });

    expect(
      (prisma.quiz.create as jest.Mock).mock.calls[0][0].data
        .quiz_advanced_linkage,
    ).toEqual({ createMany: { data: expected } });
  });

  // add 問題文と答えの前後の半角・全角スペースが削除されて登録されること
  it('add - 問題文と答えを前後トリムして登録', async () => {
    const req = {
      file_num: 1,
      question: ' 　問題　文 　',
      answer: '　 答え ',
      format_id: 2,
    };
    (prisma.quiz.findFirst as jest.Mock).mockResolvedValue({ quiz_num: 1 });
    (prisma.quiz.create as jest.Mock).mockResolvedValue({ id: 1 });
    await quizService.add(req);
    expect(prisma.quiz.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          quiz_sentense: '問題　文',
          answer: '答え',
        }),
      }),
    );
  });

  // add 問題文が空白のみの場合はエラー
  it('add - NG 問題文が空白のみ', async () => {
    const req = {
      file_num: 1,
      question: ' 　 ',
      answer: '答え',
      format_id: 2,
    };
    await expect(quizService.add(req)).rejects.toMatchObject({
      status: 400,
      message: 'ファイル番号または問題文または答えが入力されていません。',
    });
  });

  // 問題編集 正常系1
  it('edit - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
      format_id: 1,
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      explanation: '説明',
    };
    // テストデータ 正常時の返り値（更新後の問題）
    const testResult = {
      id: 22,
      file_num: 0,
      quiz_num: 0,
      format_id: 1,
      quiz_sentense: '問題文',
      answer: '答え',
    };
    (prisma.$transaction as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizService.edit(req)).toEqual(testResult);
  });

  // 問題編集 異常系１
  it('edit - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      explanation: '説明',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.edit(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題編集 正常系2 ダミー選択肢をid昇順の対応で更新する
  it('edit - OK2 dummyChoice', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
      format_id: 3,
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      dummyChoice: [
        { sentense: 'ダミー選択肢１', isCorrect: false },
        { sentense: 'ダミー選択肢２', isCorrect: true },
        { sentense: 'ダミー選択肢３', isCorrect: false },
      ],
    };
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.update as jest.Mock).mockResolvedValueOnce({ id: 22 });
    (prisma.quiz_dummy_choice.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 5 },
      { id: 6 },
      { id: 7 },
    ]);
    (prisma.category.upsert as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (prisma.quiz_dummy_choice.update as jest.Mock).mockClear();
    expect(await quizService.edit(req)).toEqual({ id: 22 });
    expect(
      (prisma.quiz_dummy_choice.update as jest.Mock).mock.calls.map(
        ([arg]) => arg,
      ),
    ).toEqual(
      [5, 6, 7].map((id, i) => ({
        data: {
          dummy_choice_sentense: req.dummyChoice[i].sentense,
          is_corrected: req.dummyChoice[i].isCorrect,
        },
        where: { id },
      })),
    );
  });

  // 問題編集 正常系3 カテゴリが空・未指定なら、紐付けを外すだけで空の名前のカテゴリは登録しない
  it.each([[''], [undefined]])('edit - OK3 category=%j', async (category) => {
    const req = {
      quiz_id: 22,
      format_id: 1,
      file_num: 1,
      quiz_num: 1,
      question: '問題文',
      answer: '答え',
      category,
    };
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.update as jest.Mock).mockResolvedValueOnce({ id: 22 });
    (prisma.category.upsert as jest.Mock).mockClear();
    (prisma.category_quiz.updateMany as jest.Mock).mockClear();

    expect(await quizService.edit(req)).toEqual({ id: 22 });
    expect(prisma.category_quiz.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { quiz_id: 22 } }),
    );
    expect(prisma.category.upsert).not.toHaveBeenCalled();
  });

  // 問題編集 関連基礎問題 空なら全部外し、項目がなければ変えない
  it.each([
    ['空なら、関連付けを全部外して新しく紐付けない', '', true],
    ['項目がなければ、関連付けは変えない', undefined, false],
  ])('edit - 関連基礎問題 %s', async (_, matched_basic_quiz_id, unlinked) => {
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.update as jest.Mock).mockResolvedValueOnce({ id: 22 });
    (prisma.quiz_basis_advanced_linkage.updateMany as jest.Mock).mockClear();
    (prisma.quiz_basis_advanced_linkage.upsert as jest.Mock).mockClear();

    await quizService.edit({
      quiz_id: 22,
      format_id: 2,
      file_num: 1,
      quiz_num: 1,
      question: '問題文',
      answer: '答え',
      matched_basic_quiz_id,
    });

    if (unlinked) {
      expect(
        prisma.quiz_basis_advanced_linkage.updateMany,
      ).toHaveBeenCalledWith({
        data: { deleted_at: expect.any(Date) },
        where: { advanced_quiz_id: 22 },
      });
    } else {
      expect(
        prisma.quiz_basis_advanced_linkage.updateMany,
      ).not.toHaveBeenCalled();
    }
    expect(prisma.quiz_basis_advanced_linkage.upsert).not.toHaveBeenCalled();
  });

  // 問題編集 異常系2 ダミー選択肢の件数が登録済みのものと異なる
  it('edit - NG2 dummyChoice count mismatch', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
      format_id: 3,
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      dummyChoice: [
        { sentense: 'ダミー選択肢１', isCorrect: false },
        { sentense: 'ダミー選択肢２', isCorrect: false },
        { sentense: 'ダミー選択肢３', isCorrect: false },
      ],
    };
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.update as jest.Mock).mockResolvedValueOnce({ id: 22 });
    (prisma.quiz_dummy_choice.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 5 },
      { id: 6 },
    ]);
    (prisma.quiz_dummy_choice.update as jest.Mock).mockClear();
    await expect(quizService.edit(req)).rejects.toMatchObject({
      message: 'エラー:ダミー選択肢の数が登録済みのものと一致しません',
    });
    expect(prisma.quiz_dummy_choice.update).not.toHaveBeenCalled();
  });

  // 問題検索 正常系1
  it('search - OK', async () => {
    // モックとして返すDBのクイズデータ（category_quizはネスト構造）
    const dbResult = [
      {
        id: 1,
        file_num: 1,
        format_id: 1,
        quiz_num: 1,
        quiz_sentense: '問題文',
        answer: '答え',
        category_quiz: [{ category: { name: 'カテゴリ' }, deleted_at: null }],
        quiz_format: { name: '四択' },
        quiz_statistics_view: {
          accuracy_rate: 80,
        },
        img_file: '画像.png',
        checked: true,
      },
    ];

    // 期待するsearchメソッドの返り値（accuracy_rateがstring化、quiz_categoryにマップされる）
    const expectedResult = [
      {
        id: 1,
        file_num: 1,
        format_id: 1,
        quiz_num: 1,
        quiz_sentense: '問題文',
        answer: '答え',
        quiz_category: [{ category: 'カテゴリ' }],
        quiz_format: { name: '四択' },
        quiz_statistics_view: {
          accuracy_rate: 80,
        },
        img_file: '画像.png',
        checked: true,
      },
    ];
    (prisma.quiz.findMany as jest.Mock).mockResolvedValue(dbResult);
    (prisma.quiz.count as jest.Mock).mockResolvedValue(1);
    (xor as jest.Mock).mockReturnValue({}); // モック関数としてxorを実装

    await expect(
      quizService.search({
        min_rate: 0,
        max_rate: 100,
        format_id: [1],
        category_and: ['カテゴリ'],
        checked: true,
        query: 'クエリ',
        searchInOnlySentense: true,
        searchInOnlyAnswer: true,
        file_num: 1,
      }),
    ).resolves.toEqual({ total: 1, quizzes: expectedResult });
  });

  // 問題検索 異常系1
  it('search - NG1', async () => {
    (prisma.quiz.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    (prisma.quiz.count as jest.Mock).mockResolvedValue(0);
    (xor as jest.Mock).mockResolvedValue({});
    await expect(
      quizService.search({
        min_rate: 0,
        max_rate: 100,
        format_id: [1],
        category_and: ['カテゴリ'],
        checked: true,
        query: 'クエリ',
        searchInOnlySentense: true,
        searchInOnlyAnswer: true,
        file_num: 1,
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  describe('search - カテゴリ条件', () => {
    const categoryQuizWhere = (names: string[]) => ({
      category: { name: { in: names }, file_num: 1, deleted_at: null },
      deleted_at: null,
    });
    // 直近のfindManyに渡されたwhere句を取得する
    const searchWhere = async (
      req: Partial<Parameters<QuizService['search']>[0]>,
    ) => {
      (prisma.quiz.findMany as jest.Mock).mockClear();
      (prisma.quiz.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.quiz.count as jest.Mock).mockResolvedValue(0);
      await quizService.search({ query: '', file_num: 1, ...req });
      return (prisma.quiz.findMany as jest.Mock).mock.calls[0][0].where;
    };

    it('format_idを指定すると形式で絞り込み、未指定なら絞り込まない', async () => {
      expect((await searchWhere({ format_id: [1, 3] })).format_id).toEqual({
        in: [1, 3],
      });
      expect((await searchWhere({})).format_id).toBeUndefined();
    });

    it('カテゴリ未指定ならカテゴリ条件を付けない', async () => {
      const where = await searchWhere({});
      expect(where.AND).toBeUndefined();
    });

    it('AND: 指定カテゴリそれぞれをすべて持つ', async () => {
      const where = await searchWhere({ category_and: ['A', 'B'] });
      expect(where.AND).toEqual([
        { category_quiz: { some: categoryQuizWhere(['A']) } },
        { category_quiz: { some: categoryQuizWhere(['B']) } },
      ]);
    });

    it('NOT: 指定カテゴリをどれも持たない', async () => {
      const where = await searchWhere({ category_not: ['C'] });
      expect(where.AND).toEqual([
        { category_quiz: { none: categoryQuizWhere(['C']) } },
      ]);
    });

    it('AND/NOTを組み合わせられる', async () => {
      const where = await searchWhere({
        category_and: ['A', 'B'],
        category_not: ['C', 'D'],
      });
      expect(where.AND).toEqual([
        { category_quiz: { some: categoryQuizWhere(['A']) } },
        { category_quiz: { some: categoryQuizWhere(['B']) } },
        { category_quiz: { none: categoryQuizWhere(['C', 'D']) } },
      ]);
    });

    it('onlyDirectCategory: AND指定カテゴリの子カテゴリ（選択済みを除く）を持たない', async () => {
      (prisma.category_parent_child.findMany as jest.Mock).mockResolvedValue([
        { child_category: { name: 'A-1' } },
        { child_category: { name: 'A-2' } },
        { child_category: { name: 'B' } },
      ]);
      const where = await searchWhere({
        category_and: ['A', 'B'],
        onlyDirectCategory: true,
      });
      expect(where.AND).toEqual([
        { category_quiz: { some: categoryQuizWhere(['A']) } },
        { category_quiz: { some: categoryQuizWhere(['B']) } },
        { category_quiz: { none: categoryQuizWhere(['A-1', 'A-2']) } },
      ]);
    });

    it('onlyDirectCategory: AND指定が無ければ無視する', async () => {
      (prisma.category_parent_child.findMany as jest.Mock).mockClear();
      const where = await searchWhere({
        category_not: ['B'],
        onlyDirectCategory: true,
      });
      expect(prisma.category_parent_child.findMany).not.toHaveBeenCalled();
      expect(where.AND).toEqual([
        { category_quiz: { none: categoryQuizWhere(['B']) } },
      ]);
    });
  });

  // 問題削除 正常系1
  it('delete - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.quiz.update as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.delete(req)).toEqual(testResult);
  });

  // 問題削除 異常系1
  it('delete - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
    };
    (prisma.quiz.update as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.delete(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題統合 正常系1
  it('integrate - OK', async () => {
    // テストデータ
    const req = {
      fromQuizId: 0,
      toQuizId: 1,
    };
    // テストデータ 正常時の返り値（統合後の統合先問題）
    const testResult = {
      id: 1,
      format_id: 1,
      category_quiz: [{ category: { name: 'カテゴリ1' } }],
    };
    (prisma.quiz.findUnique as jest.Mock).mockResolvedValue({
      file_num: 1,
      format_id: 1,
      category_quiz: [],
    });
    (prisma.$transaction as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.integrate(req)).toEqual(testResult);
  });

  // 問題統合 正常系2 統合元・統合先の有効なカテゴリをまとめて統合先に紐付ける
  it('integrate - OK2 categories', async () => {
    (prisma.quiz.findUnique as jest.Mock)
      .mockResolvedValueOnce({
        file_num: 1,
        format_id: 1,
        category_quiz: [
          { deleted_at: null, category: { name: 'A' } },
          { deleted_at: new Date(), category: { name: '削除済み' } },
        ],
      })
      .mockResolvedValueOnce({
        file_num: 1,
        format_id: 1,
        category_quiz: [
          { deleted_at: null, category: { name: 'A' } },
          { deleted_at: null, category: { name: 'B' } },
        ],
      });
    (prisma.$transaction as jest.Mock).mockImplementationOnce((fn) =>
      fn(prisma),
    );
    (prisma.quiz.update as jest.Mock).mockReset();
    (prisma.answer_log.updateMany as jest.Mock).mockReset();
    (prisma.category_quiz.updateMany as jest.Mock).mockClear();
    (prisma.category.upsert as jest.Mock)
      .mockClear()
      .mockResolvedValueOnce({ id: 10 })
      .mockResolvedValueOnce({ id: 11 });
    (prisma.category_quiz.upsert as jest.Mock).mockClear();

    await quizService.integrate({ fromQuizId: 0, toQuizId: 1 });

    expect(prisma.category_quiz.updateMany).toHaveBeenCalledWith({
      where: { quiz_id: { in: [0, 1] } },
      data: { deleted_at: expect.any(Date) },
    });
    expect(
      (prisma.category.upsert as jest.Mock).mock.calls.map(
        ([arg]) => arg.create,
      ),
    ).toEqual([
      { name: 'A', file_num: 1 },
      { name: 'B', file_num: 1 },
    ]);
    expect(
      (prisma.category_quiz.upsert as jest.Mock).mock.calls.map(
        ([arg]) => arg.create,
      ),
    ).toEqual([
      { quiz_id: 1, category_id: 10 },
      { quiz_id: 1, category_id: 11 },
    ]);
  });

  // 問題統合 異常系1
  it('integrate - NG1', async () => {
    // テストデータ
    const req = {
      fromQuizId: 0,
      toQuizId: 1,
    };
    (prisma.quiz.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.integrate(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題統合 異常系2 統合元の問題が存在しない
  it('integrate - NG2 fromQuiz not found', async () => {
    // テストデータ
    const req = {
      fromQuizId: 0,
      toQuizId: 1,
    };
    (prisma.quiz.findUnique as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ format_id: 1 });
    await expect(quizService.integrate(req)).rejects.toMatchObject({
      message: '統合元の問題が見つかりません(0)',
      status: 404,
    });
  });

  // 問題統合 異常系3 統合先の問題が存在しない
  it('integrate - NG3 toQuiz not found', async () => {
    // テストデータ
    const req = {
      fromQuizId: 0,
      toQuizId: 1,
    };
    (prisma.quiz.findUnique as jest.Mock)
      .mockResolvedValueOnce({ format_id: 1 })
      .mockResolvedValueOnce(null);
    await expect(quizService.integrate(req)).rejects.toMatchObject({
      message: '統合先の問題が見つかりません(1)',
      status: 404,
    });
  });

  // 問題統合 異常系4 統合元と統合先が同じ問題
  it('integrate - NG4 same quiz', async () => {
    // テストデータ
    const req = {
      fromQuizId: 1,
      toQuizId: 1,
    };
    await expect(quizService.integrate(req)).rejects.toMatchObject({
      message: '統合元と統合先に同じ問題は指定できません',
      status: 400,
    });
  });

  // 問題にカテゴリ追加 正常系1
  it('addCategoryToQuiz - OK', async () => {
    // テストデータ
    const req = {
      quiz_ids: [0],
      category: 'カテゴリ1',
    };
    // テストデータ 正常時の返り値（カテゴリ追加後の問題）
    const testResult = [
      { id: 0, category_quiz: [{ category: { name: 'カテゴリ1' } }] },
    ];
    (prisma.$transaction as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.addCategoryToQuiz(req)).toEqual(testResult);
  });

  // 問題にカテゴリ追加 異常系1
  it('addCategoryToQuiz - NG1', async () => {
    // テストデータ
    const req = {
      quiz_ids: [0],
      category: 'カテゴリ1',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.addCategoryToQuiz(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題からカテゴリ削除 正常系1
  it('removeCategoryFromQuiz - OK', async () => {
    // テストデータ
    const req = {
      quiz_ids: [0],
      category: 'カテゴリ1',
    };
    // テストデータ 正常時の返り値（カテゴリ削除後の問題）
    const testResult = [{ id: 0, category_quiz: [] }];
    (prisma.$transaction as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.removeCategoryFromQuiz(req)).toEqual(testResult);
  });

  // 問題からカテゴリ削除 正常系2 問題と同じファイルのカテゴリへの紐付けをまとめて削除する
  it('removeCategoryFromQuiz - OK2 updateMany', async () => {
    (prisma.$transaction as jest.Mock).mockImplementationOnce((fn) =>
      fn(prisma),
    );
    (prisma.quiz.findMany as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce([
        { id: 1, file_num: 1 },
        { id: 2, file_num: 2 },
        { id: 3, file_num: 1 },
      ])
      .mockResolvedValueOnce([]);
    (prisma.category_quiz.updateMany as jest.Mock).mockReset();
    await quizService.removeCategoryFromQuiz({
      quiz_ids: [1, 2, 3, 4],
      category: 'A,B',
    });
    expect(prisma.category_quiz.updateMany).toHaveBeenCalledWith({
      data: { deleted_at: expect.any(Date) },
      where: {
        deleted_at: null,
        OR: [
          {
            quiz_id: { in: [1, 3] },
            category: { file_num: 1, name: { in: ['A', 'B'] } },
          },
          {
            quiz_id: { in: [2] },
            category: { file_num: 2, name: { in: ['A', 'B'] } },
          },
        ],
      },
    });
  });

  // 問題からカテゴリ削除 正常系3 問題が1件も存在しなければ更新しない
  it('removeCategoryFromQuiz - OK3 no quiz', async () => {
    (prisma.$transaction as jest.Mock).mockImplementationOnce((fn) =>
      fn(prisma),
    );
    (prisma.quiz.findMany as jest.Mock).mockReset().mockResolvedValue([]);
    (prisma.category_quiz.updateMany as jest.Mock).mockReset();
    expect(
      await quizService.removeCategoryFromQuiz({
        quiz_ids: [9],
        category: 'A',
      }),
    ).toEqual([]);
    expect(prisma.category_quiz.updateMany).not.toHaveBeenCalled();
  });

  // 問題からカテゴリ削除 異常系1
  it('removeCategoryFromQuiz - NG1', async () => {
    // テストデータ
    const req = {
      quiz_ids: [0],
      category: 'カテゴリ1',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.removeCategoryFromQuiz(req)).rejects.toMatchObject(
      {
        message: 'error test by jest.',
      },
    );
  });

  // 問題にカテゴリ追加 異常系3 存在しない問題は500にせず404のまま返す
  it('addCategoryToQuiz - NG3', async () => {
    (prisma.$transaction as jest.Mock).mockRejectedValueOnce(
      new HttpException('問題が見つかりません(99)', HttpStatus.NOT_FOUND),
    );
    await expect(
      quizService.addCategoryToQuiz({ quiz_ids: [99], category: 'カテゴリ1' }),
    ).rejects.toMatchObject({ status: 404 });
  });

  // 問題にチェック追加 正常系1
  it('check - OK', async () => {
    // テストデータ
    const req = {
      quiz_ids: [1, 2],
    };
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1 },
      { id: 2 },
    ]);
    (prisma.quiz.update as jest.Mock)
      .mockResolvedValueOnce({ id: 1, checked: true })
      .mockResolvedValueOnce({ id: 2, checked: true });
    // 更新後の問題が指定順に返る
    expect(await quizService.check(req)).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: true },
    ]);
  });

  // 問題にチェック追加 異常系1
  it('check - NG1', async () => {
    // テストデータ
    const req = {
      quiz_ids: [1],
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.check(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題にチェック追加・外す 異常系3 存在しない問題があれば更新せず404
  it.each(['check', 'uncheck'] as const)(
    '%s - NG3 not found',
    async (method) => {
      (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
        callback(prisma),
      );
      (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([{ id: 2 }]);
      (prisma.quiz.update as jest.Mock).mockClear();
      await expect(
        quizService[method]({ quiz_ids: [1, 2, 3, 1] }),
      ).rejects.toMatchObject({
        status: 404,
        message: '問題が見つかりません(1,3)',
      });
      expect(prisma.quiz.update).not.toHaveBeenCalled();
    },
  );

  // 問題にチェック外す 正常系1
  it('uncheck - OK', async () => {
    // テストデータ
    const req = {
      quiz_ids: [1, 2],
    };
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1 },
      { id: 2 },
    ]);
    (prisma.quiz.update as jest.Mock)
      .mockResolvedValueOnce({ id: 1, checked: false })
      .mockResolvedValueOnce({ id: 2, checked: false });
    // 更新後の問題が指定順に返る
    expect(await quizService.uncheck(req)).toEqual([
      { id: 1, checked: false },
      { id: 2, checked: false },
    ]);
  });

  // 問題にチェック外す 異常系1
  it('uncheck - NG1', async () => {
    // テストデータ
    const req = {
      quiz_ids: [1],
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.uncheck(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題のチェック反転 正常系1
  it('reverseCheck - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: 1,
    };
    const testResult = {
      result: 'OK!',
    };
    (prisma.quiz.findUnique as jest.Mock).mockResolvedValue({ checked: true });
    (prisma.quiz.update as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.reverseCheck(req)).toEqual(testResult);
  });

  // 問題のチェック反転 異常系1
  it('reverseCheck - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: 1,
    };
    (prisma.quiz.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.reverseCheck(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題のチェック反転 異常系3 問題が存在しなければ更新せず404
  it('reverseCheck - NG3 not found', async () => {
    (prisma.quiz.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.quiz.update as jest.Mock).mockClear();
    await expect(
      quizService.reverseCheck({ quiz_id: 999 }),
    ).rejects.toMatchObject({
      status: 404,
      message: '問題が見つかりません(999)',
    });
    expect(prisma.quiz.update).not.toHaveBeenCalled();
  });

  // 回答ログ削除 正常系1
  it('deleteAnswerLogByFile - OK', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    (prisma.answer_log.updateMany as jest.Mock).mockResolvedValue({
      count: 3,
    });
    expect(await quizService.deleteAnswerLogByFile(req)).toEqual({
      count: 3,
    });
  });

  // 回答ログ削除 異常系1
  it('deleteAnswerLogByFile - NG1', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    (prisma.answer_log.updateMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.deleteAnswerLogByFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
