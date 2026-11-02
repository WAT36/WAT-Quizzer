import type { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';

interface AccuracyChartProps {
  accuracyData: GetAccuracyRateByCategoryAPIResponseDto;
  order: string;
}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 1データ(1行)あたりの高さ(px)
const ROW_HEIGHT = 50;
// 横軸の目盛りとその余白の高さ(px)
const X_AXIS_HEIGHT = 40;

export const AccuracyChart = ({ accuracyData, order }: AccuracyChartProps) => {
  const chartRef = useChartAriaLabel('カテゴリ別正答率グラフ');
  const { gridColor, textColor } = useChartThemeColors();

  // データがない場合は何もしない
  if (accuracyData.result.length === 0 && accuracyData.checked_result.length === 0) {
    return <></>;
  }

  const data = {
    labels: [
      ...accuracyData.checked_result.map((x) => '(チェック済問題)'),
      ...accuracyData.result
        .sort((a, b) => (order === 'Name' ? a.category.localeCompare(b.category) : +a.accuracy_rate - +b.accuracy_rate))
        .map((x) => x.category),
      ...accuracyData.all_result.map((x) => '(全問題)')
    ],
    datasets: [
      {
        data: [
          ...accuracyData.checked_result.map((x) => +x.accuracy_rate),
          ...accuracyData.result
            .sort((a, b) =>
              order === 'Name' ? a.category.localeCompare(b.category) : +a.accuracy_rate - +b.accuracy_rate
            )
            .map((x) => +x.accuracy_rate),
          ...accuracyData.all_result.map((x) => +x.accuracy_rate)
        ],
        backgroundColor: [
          ...accuracyData.checked_result.map((x) => 'lime'),
          ...accuracyData.result.map((x) => 'royalblue'),
          ...accuracyData.all_result.map((x) => 'mediumblue')
        ],
        categoryPercentage: 1, // **カテゴリごとの間隔**
        barPercentage: 0.5 // **棒の太さ**
      }
    ]
  };

  // グラフ領域の縦の長さ（＝横軸の目盛り部分 + 1行の高さ * データの個数）
  // 横軸の目盛り部分はデータの個数によらず一定なので別に足し、データが少なくても1行の高さが変わらないようにする
  const graph_height = X_AXIS_HEIGHT + ROW_HEIGHT * data.datasets[0].data.length;

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false // **凡例を非表示**
      }
    },
    scales: {
      // 正解率(%)なので、データによらず常に0〜100で表示する
      x: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: textColor } },
      // カテゴリ名を間引かずにすべて表示する
      y: { grid: { color: gridColor }, ticks: { color: textColor, autoSkip: false } }
    },
    maintainAspectRatio: false
  };
  return (
    <div style={{ height: `${graph_height}px` }} className="mb-10">
      <Bar ref={chartRef} options={options} data={data} />
    </div>
  );
};
