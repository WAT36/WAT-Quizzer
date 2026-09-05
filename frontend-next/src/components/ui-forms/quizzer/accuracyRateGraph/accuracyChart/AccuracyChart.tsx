import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
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

  // グラフ領域の縦の長さ（＝50 * データの個数）
  // TODO データたくさんある場合は見やすいが　１個の時は逆に見にくかった　ここの計算式を策定してほしい
  const graph_height = 50 * data.datasets[0].data.length;

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
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } }
    },
    maintainAspectRatio: false
  };
  return (
    <div style={{ height: `${graph_height}px` }} className="mb-10">
      <Bar ref={chartRef} options={options} data={data} />
    </div>
  );
};
