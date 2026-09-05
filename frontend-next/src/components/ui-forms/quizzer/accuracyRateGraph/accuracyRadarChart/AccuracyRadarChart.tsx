import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';

interface AccuracyRadarChartProps {
  accuracyData: GetAccuracyRateByCategoryAPIResponseDto;
  order: string;
}
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const AccuracyRadarChart = ({ accuracyData, order }: AccuracyRadarChartProps) => {
  const chartRef = useChartAriaLabel('カテゴリ別正答率レーダーチャート');
  const { gridColor, textColor } = useChartThemeColors();

  // データがない場合は何もしない
  if (accuracyData.result.length === 0 && accuracyData.checked_result.length === 0) {
    return <></>;
  }
  // Radarチャート用のラベルとデータを作成
  const labels = [
    ...accuracyData.result
      .sort((a, b) => (order === 'Name' ? a.category.localeCompare(b.category) : +a.accuracy_rate - +b.accuracy_rate))
      .map((x) => x.category)
  ];
  // 各データセットのデータをラベル順に揃える
  const resultData = [
    ...accuracyData.result
      .sort((a, b) => (order === 'Name' ? a.category.localeCompare(b.category) : +a.accuracy_rate - +b.accuracy_rate))
      .map((x) => +x.accuracy_rate)
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'カテゴリ別',
        data: resultData,
        backgroundColor: 'rgba(65, 105, 225, 0.2)', // royalblue
        borderColor: 'royalblue',
        pointBackgroundColor: 'royalblue',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'royalblue'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: true, // Radarでは凡例を表示
        labels: { color: textColor }
      }
    },
    scales: {
      r: {
        // レーダーチャートを常に最小値0、最大値100で表示させる
        min: 0, // 強制的に最小値を 0 に
        max: 100, // 強制的に最大値を 100 に
        grid: { color: gridColor },
        angleLines: { color: gridColor },
        ticks: {
          stepSize: 10, // 目盛り間隔
          color: textColor,
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: {
            size: 14
          },
          color: textColor
        }
      }
    },
    maintainAspectRatio: false
  };

  // Radarチャートは正方形が見やすいので高さを幅に合わせる
  return (
    <div className="w-full h-[800px]">
      <Radar ref={chartRef} options={options} data={data} />
    </div>
  );
};
