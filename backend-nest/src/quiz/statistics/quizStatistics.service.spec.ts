import { Prisma } from '@prisma/client';
import { prisma } from 'quizzer-lib';
import { QuizStatisticsService } from './quizStatistics.service';

jest.mock('quizzer-lib', () => ({
  prisma: { $queryRaw: jest.fn() },
  getStartDateForStatistics:
    jest.requireActual('quizzer-lib').getStartDateForStatistics,
}));

// $queryRawに渡されたSQLとパラメータ
const queriedSql = (call: unknown[]) => {
  const [strings, ...values] = call as [TemplateStringsArray, ...unknown[]];
  return Prisma.sql(strings, ...values);
};

describe('QuizStatisticsService', () => {
  let service: QuizStatisticsService;
  const queryRaw = prisma.$queryRaw as unknown as jest.Mock;

  beforeEach(() => {
    service = new QuizStatisticsService();
    queryRaw.mockReset();
  });

  describe('getAnswerLogStatistics', () => {
    it('全ファイル指定時はファイルで絞り込まず、ファイルごとに分けずに集計する', async () => {
      queryRaw.mockResolvedValue([{ count: BigInt(4), clear: BigInt(3) }]);
      const result = await service.getAnswerLogStatistics({
        file_num: -1,
        date_unit: 'day',
      });

      expect(queryRaw).toHaveBeenCalledTimes(10);
      const { sql, values } = queriedSql(queryRaw.mock.calls[0]);
      expect(sql).not.toMatch(/file_num/);
      expect(sql).not.toMatch(/group by/i);
      expect(values).toHaveLength(2); // 期間の始値・終値のみ
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        count: 4,
        accuracy_rate: 75,
      });
    });

    it('ファイル指定時はそのファイルの解答のみ集計する', async () => {
      queryRaw.mockResolvedValue([{ count: BigInt(2), clear: BigInt(1) }]);
      await service.getAnswerLogStatistics({ file_num: 3, date_unit: 'week' });

      const { sql, values } = queriedSql(queryRaw.mock.calls[0]);
      expect(sql).toMatch(/and q\.file_num = \?/);
      expect(values[2]).toBe(3);
    });

    it('削除済みの解答ログ・削除済みの問題の解答ログは集計しない', async () => {
      queryRaw.mockResolvedValue([{ count: BigInt(0), clear: null }]);
      await service.getAnswerLogStatistics({ file_num: 3, date_unit: 'day' });
      const { sql } = queriedSql(queryRaw.mock.calls[0]);
      expect(sql).toMatch(/al\.deleted_at is null/);
      expect(sql).toMatch(/q\.deleted_at is null/);
    });

    it('期間内の解答が無ければ回答数・正解率とも0にする', async () => {
      queryRaw.mockResolvedValue([{ count: BigInt(0), clear: null }]);
      const result = await service.getAnswerLogStatistics({
        file_num: -1,
        date_unit: 'month',
      });
      expect(result.every((r) => r.count === 0 && r.accuracy_rate === 0)).toBe(
        true,
      );
    });

    it('期間は新しい順に、前の期間の始値を次の期間の終値にして区切る', async () => {
      queryRaw.mockResolvedValue([{ count: BigInt(0), clear: null }]);
      await service.getAnswerLogStatistics({ file_num: -1, date_unit: 'day' });
      const ranges = queryRaw.mock.calls.map(
        (call) => queriedSql(call).values as Date[],
      );
      for (let i = 1; i < ranges.length; i++) {
        expect(ranges[i][1]).toEqual(ranges[i - 1][0]);
        expect(ranges[i][0].getTime()).toBeLessThan(ranges[i][1].getTime());
      }
    });
  });
});
