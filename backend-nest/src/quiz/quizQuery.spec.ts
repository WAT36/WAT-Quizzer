import {
  getQuizOrderBy,
  getQuizWhere,
  searchQuizRange,
  searchQuizWhere,
  sortBySpacedReviewPriority,
} from './quizQuery';

jest.mock('quizzer-lib', () => ({
  getTodayStart: () => new Date('2026-01-01T00:00:00Z'),
  SEARCH_LIMITS: { MAX_QUIZ_SEARCH_RESULTS: 200 },
}));

describe('quizQuery', () => {
  describe('getQuizOrderBy', () => {
    it('取得方法ごとの並び順を返し、ランダム系・指定なしは並び順なし', () => {
      expect(getQuizOrderBy('LRU')).toEqual({
        quiz_statistics_view: {
          last_answer_log: { sort: 'asc', nulls: 'first' },
        },
      });
      expect(getQuizOrderBy('random')).toEqual({});
      expect(getQuizOrderBy(undefined)).toEqual({});
    });
  });

  describe('getQuizWhere', () => {
    it('取得方法の指定がなければ問題番号で取得する', () => {
      expect(getQuizWhere({ file_num: 1, quiz_num: 2 })).toEqual({
        file_num: 1,
        quiz_num: 2,
        deleted_at: null,
      });
    });

    it('今日まだ解いていない問題は、今日の解答履歴がないものに絞り込む', () => {
      expect(
        getQuizWhere({ file_num: 1 }, 'todayNotAnswered').quiz_statistics_view,
      ).toEqual({
        accuracy_rate: { gte: 0, lte: 100 },
        OR: [
          { last_answer_log: { lt: new Date('2026-01-01T00:00:00Z') } },
          { last_answer_log: null },
        ],
      });
    });

    it('忘却曲線に基づく復習は、復習期日が来た(経過日数÷間隔が1以上の)問題に絞り込む', () => {
      const where = getQuizWhere({ file_num: 1 }, 'spacedReview');
      expect(where.quiz_review_schedule_view).toEqual({
        overdue_ratio: { gte: 1 },
      });
      // 正解率などの統計の絞り込みはそのまま併用できる
      expect(where.quiz_statistics_view).toEqual({
        accuracy_rate: { gte: 0, lte: 100 },
      });
      // 並び替えはDBでは行わない（sortBySpacedReviewPriorityで行う）
      expect(getQuizOrderBy('spacedReview')).toEqual({});
    });

    it('忘却曲線に基づく復習以外では、復習スケジュールで絞り込まない', () => {
      expect(
        getQuizWhere({ file_num: 1 }, 'random').quiz_review_schedule_view,
      ).toBeUndefined();
    });
  });

  describe('sortBySpacedReviewPriority', () => {
    const quiz = (id: number, overdue_ratio: number | null) => ({
      id,
      quiz_review_schedule_view: { overdue_ratio },
    });

    it('期日超過の度合いが大きい順に並べ、同じならID順にする', () => {
      expect(
        sortBySpacedReviewPriority([
          quiz(3, 1),
          quiz(2, 5.5),
          quiz(4, 2),
          quiz(1, 2),
        ]).map((q) => q.id),
      ).toEqual([2, 1, 4, 3]);
    });

    it('渡した配列は並べ替えない', () => {
      const quizzes = [quiz(1, 1), quiz(2, 3)];
      sortBySpacedReviewPriority(quizzes);
      expect(quizzes.map((q) => q.id)).toEqual([1, 2]);
    });
  });

  describe('getQuizWhere - カテゴリとキーワードの同時指定', () => {
    const categoryCondition = {
      OR: [
        {
          category_quiz: {
            some: { category: { name: 'A' }, deleted_at: null },
          },
        },
        {
          category_quiz: {
            some: { category: { name: 'B' }, deleted_at: null },
          },
        },
      ],
    };

    it('問題文+解答のキーワードを指定しても、カテゴリの絞り込みが残る', () => {
      const where = getQuizWhere(
        { file_num: 1, category: 'A,B', keyword: 'k' },
        'random',
      );
      expect(where.AND).toEqual([
        categoryCondition,
        {
          OR: [
            { quiz_sentense: { contains: 'k' } },
            { answer: { contains: 'k' } },
          ],
        },
      ]);
      expect(where.OR).toBeUndefined();
    });

    it('解説のキーワードとカテゴリを同時に指定できる', () => {
      const where = getQuizWhere(
        {
          file_num: 1,
          category: 'A,B',
          keyword: 'k',
          keywordTarget: 'explanation',
        },
        'random',
      );
      expect(where.AND).toEqual([
        categoryCondition,
        { quiz_explanation: { explanation: { contains: 'k' } } },
      ]);
    });

    it('カテゴリ・キーワードともに指定がなければ絞り込まない', () => {
      const where = getQuizWhere({ file_num: 1 }, 'random');
      expect(where.AND).toBeUndefined();
      expect(where.OR).toBeUndefined();
    });
  });

  describe('getQuizWhere - 回答数の範囲指定', () => {
    it('以上・以下の両方を指定すると、回答数をその範囲で絞り込む', () => {
      const where = getQuizWhere(
        { file_num: 1, min_answer_count: 3, max_answer_count: 10 },
        'random',
      );
      expect(where.quiz_statistics_view).toMatchObject({
        answer_count: { gte: 3, lte: 10 },
      });
    });

    it('片方だけ指定すると、指定した側だけで絞り込む', () => {
      expect(
        getQuizWhere({ file_num: 1, min_answer_count: 5 }, 'random')
          .quiz_statistics_view,
      ).toMatchObject({ answer_count: { gte: 5 } });
      expect(
        getQuizWhere({ file_num: 1, max_answer_count: 0 }, 'random')
          .quiz_statistics_view,
      ).toMatchObject({ answer_count: { lte: 0 } });
    });

    it('指定がなければ回答数で絞り込まない', () => {
      const where = getQuizWhere({ file_num: 1 }, 'random');
      expect(where.quiz_statistics_view).not.toHaveProperty('answer_count');
    });

    it('出題方法ごとの解答履歴の条件と同時に指定できる', () => {
      const where = getQuizWhere(
        { file_num: 1, min_answer_count: 1 },
        'todayNotAnswered',
      );
      expect(where.quiz_statistics_view).toMatchObject({
        answer_count: { gte: 1 },
        OR: [
          { last_answer_log: { lt: expect.any(Date) } },
          { last_answer_log: null },
        ],
      });
    });
  });

  describe('searchQuizRange', () => {
    it('result_from〜result_to件目を取得し、上限件数を超えない', () => {
      expect(searchQuizRange({ result_from: 3, result_to: 10 })).toEqual({
        skip: 2,
        take: 8,
      });
      expect(searchQuizRange({ result_from: 1, result_to: 999 })).toEqual({
        skip: 0,
        take: 200,
      });
      expect(searchQuizRange({})).toEqual({ skip: 0, take: 200 });
    });
  });

  describe('searchQuizWhere', () => {
    it('検索対象の指定がなければ問題文・答え・解説すべてを対象にする', () => {
      expect(searchQuizWhere({ file_num: 1, query: 'q' }).OR).toEqual([
        { quiz_sentense: { contains: 'q' } },
        { answer: { contains: 'q' } },
        { quiz_explanation: { explanation: { contains: 'q' } } },
      ]);
    });

    it('除外する子カテゴリを渡すと、それらを持たない問題に絞り込む', () => {
      expect(searchQuizWhere({ file_num: 1, query: '' }, ['C1']).AND).toEqual([
        {
          category_quiz: {
            none: {
              category: { name: { in: ['C1'] }, file_num: 1, deleted_at: null },
              deleted_at: null,
            },
          },
        },
      ]);
    });
  });
});
