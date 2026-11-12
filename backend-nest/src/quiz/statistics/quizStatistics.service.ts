import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  AnswerLogStatisticsApiResponse,
  GetAnswerLogStatisticsAPIRequestDto,
  getStartDateForStatistics,
  prisma,
} from 'quizzer-lib';

// 解答状況の統計・おすすめカテゴリ
@Injectable()
export class QuizStatisticsService {
  // 過去のデータから回答数統計データ取得
  async getAnswerLogStatistics(req: GetAnswerLogStatisticsAPIRequestDto) {
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
    // ファイル指定時のみファイル番号で絞り込む
    const fileNumCondition =
      file_num && file_num !== -1
        ? Prisma.sql`and q.file_num = ${file_num}`
        : Prisma.empty;
    for (let i = 0; i < 10; i++) {
      const answerLogStat = await prisma.$queryRaw<
        { file_num: number; count: number; clear: number }[]
      >`
        select
          q.file_num,
          COUNT(*) as count,
          SUM(CASE WHEN al.is_corrected THEN 1 ELSE 0 END) as clear
        from answer_log al
        inner join quiz q on al.quiz_id = q.id
        where al.created_at >= ${startDate}
          and al.created_at < ${endDate}
          ${fileNumCondition}
        group by q.file_num
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
  }

  // ファイルごとの正解率ヒストグラムデータ取得
  async getAccuracyRateHistgramData(file_num: number) {
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
    const logsByQuizId = new Map<
      number,
      { is_corrected: boolean | null; created_at: Date }[]
    >();
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
        const recentLogs = catLogs.filter(
          (log) => log.created_at >= recentDate,
        );
        const recentAccuracy =
          recentLogs.length > 0
            ? recentLogs.filter((log) => log.is_corrected).length /
              recentLogs.length
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

    const lowAccuracyNames = new Set(
      lowAccuracyItems.map((c) => c.category_name),
    );

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
