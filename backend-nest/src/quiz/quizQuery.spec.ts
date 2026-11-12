import {
  getQuizOrderBy,
  getQuizWhere,
  searchQuizRange,
  searchQuizWhere,
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
