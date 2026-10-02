import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Card } from '@/components/ui-elements/card/Card';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';
import type { QuizAnswerResult } from '@/hooks/quizSession/reducer';
import {
  analyzeQuizSession,
  CategoryAnalysis,
  CATEGORY_JUDGE_MIN_COUNT,
  STRONG_CATEGORY_MIN_RATE,
  WEAK_CATEGORY_MAX_RATE
} from '@/hooks/quizSession/analysis';
import {
  SESSION_RESULT_CATEGORY_COLOR,
  SESSION_RESULT_CATEGORY_LABEL,
  SESSION_RESULT_CATEGORY_TITLE,
  SESSION_RESULT_DOUGHNUT_COLOR,
  SESSION_RESULT_DOUGHNUT_LABEL,
  SESSION_RESULT_DOUGHNUT_TITLE
} from '@/constants/contents/chart';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface QuizSessionResultProps {
  results: QuizAnswerResult[];
  // 出題予定だった問題数（途中で終了した場合に「N問中M問で終了」と表示するため）
  totalCount?: number;
}

const formatRate = (rate: number) => `${rate.toFixed(1)}%`;

const CategoryList = ({
  title,
  categories,
  emptyText
}: {
  title: string;
  categories: CategoryAnalysis[];
  emptyText: string;
}) => (
  <div className="min-w-[240px] flex-1">
    <Typography variant="subtitle2">{title}</Typography>
    {categories.length > 0 ? (
      <ul className="list-disc pl-6">
        {categories.map((c) => (
          <li key={c.category}>
            <Typography variant="body2">{`${c.category}：${formatRate(c.accuracyRate)}（${c.total}問中${c.correct}問正解）`}</Typography>
          </li>
        ))}
      </ul>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    )}
  </div>
);

// 出題セッション終了後に、全体の正解率・グラフ・カテゴリ別の得意/苦手を表示する
export const QuizSessionResult = ({ results, totalCount }: QuizSessionResultProps) => {
  const analysis = useMemo(() => analyzeQuizSession(results), [results]);
  const doughnutRef = useChartAriaLabel(SESSION_RESULT_DOUGHNUT_TITLE);
  const barRef = useChartAriaLabel(SESSION_RESULT_CATEGORY_TITLE);
  const { gridColor, textColor } = useChartThemeColors();

  const strongSet = new Set(analysis.strongCategories.map((c) => c.category));
  const weakSet = new Set(analysis.weakCategories.map((c) => c.category));

  const doughnutData = {
    labels: SESSION_RESULT_DOUGHNUT_LABEL,
    datasets: [
      {
        label: SESSION_RESULT_DOUGHNUT_TITLE,
        data: [analysis.correct, analysis.total - analysis.correct],
        backgroundColor: SESSION_RESULT_DOUGHNUT_COLOR
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: textColor } },
      title: { display: true, text: SESSION_RESULT_DOUGHNUT_TITLE, color: textColor }
    }
  };

  const barData = {
    labels: analysis.categories.map((c) => c.category),
    datasets: [
      {
        label: SESSION_RESULT_CATEGORY_LABEL,
        data: analysis.categories.map((c) => Number(c.accuracyRate.toFixed(1))),
        backgroundColor: analysis.categories.map((c) =>
          strongSet.has(c.category)
            ? SESSION_RESULT_CATEGORY_COLOR.strong
            : weakSet.has(c.category)
              ? SESSION_RESULT_CATEGORY_COLOR.weak
              : SESSION_RESULT_CATEGORY_COLOR.other
        )
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: SESSION_RESULT_CATEGORY_TITLE, color: textColor },
      tooltip: {
        callbacks: {
          // ツールチップに「正解数/出題数」も出す
          afterLabel: (ctx: { dataIndex: number }) => {
            const c = analysis.categories[ctx.dataIndex];
            return c ? `${c.total}問中${c.correct}問正解` : '';
          }
        }
      }
    },
    scales: {
      x: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } }
    }
  };

  // カテゴリ数に応じて棒グラフの高さを確保する
  const barHeight = Math.max(200, analysis.categories.length * 28 + 80);

  return (
    <div>
      {totalCount !== undefined && totalCount > results.length && (
        <Typography variant="body2" color="text.secondary">
          {`途中で終了しました（${totalCount}問中${results.length}問で終了）`}
        </Typography>
      )}
      <Typography variant="subtitle1">{`${analysis.total}問中${analysis.correct}問正解でした`}</Typography>
      <Typography variant="h6">{`正解率：${formatRate(analysis.accuracyRate)}`}</Typography>

      <div className="flex flex-wrap gap-4">
        <Card variant="outlined" attr={['margin-vertical', 'padding']}>
          <div className="h-[260px] w-[260px] max-w-full">
            <Doughnut ref={doughnutRef} data={doughnutData} options={doughnutOptions} />
          </div>
        </Card>
        {analysis.categories.length > 0 && (
          <Card variant="outlined" attr={['margin-vertical', 'padding']}>
            <div className="w-[480px] max-w-full" style={{ height: barHeight }}>
              <Bar ref={barRef} data={barData} options={barOptions} />
            </div>
          </Card>
        )}
      </div>

      {analysis.categories.length > 0 ? (
        <Card variant="outlined" attr={['margin-vertical', 'padding']}>
          <div className="flex flex-wrap gap-4">
            <CategoryList
              title={`得意なカテゴリ（正解率${STRONG_CATEGORY_MIN_RATE}%以上）`}
              categories={analysis.strongCategories}
              emptyText="該当するカテゴリはありません"
            />
            <CategoryList
              title={`苦手なカテゴリ（正解率${WEAK_CATEGORY_MAX_RATE}%未満）`}
              categories={analysis.weakCategories}
              emptyText="該当するカテゴリはありません"
            />
          </div>
          <Typography variant="caption" color="text.secondary">
            {`※得意・苦手は今回${CATEGORY_JUDGE_MIN_COUNT}問以上出題されたカテゴリのみ判定しています`}
          </Typography>
        </Card>
      ) : (
        <Typography variant="body2" color="text.secondary">
          カテゴリが付いた問題がないため、カテゴリ別の分析はありません
        </Typography>
      )}
    </div>
  );
};
