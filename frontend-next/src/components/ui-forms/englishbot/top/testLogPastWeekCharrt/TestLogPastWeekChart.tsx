import { Card } from '@/components/ui-elements/card/Card';
import type { GetPastWeekTestStatisticsAPIResponseDto } from 'quizzer-lib';
import { CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';
import { useEffect, useState } from 'react';
import { getWordTestStatisticsWeekDataAPI } from '@/utils/api-wrapper';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const TestLogPastWeekChart = () => {
  const chartRef = useChartAriaLabel('過去１週間の回答数グラフ');
  const { gridColor, textColor } = useChartThemeColors();
  const [wordTestPastWeekStatisticsData, setWordTestPastWeekStatisticsData] = useState<
    GetPastWeekTestStatisticsAPIResponseDto[]
  >([]);

  useEffect(() => {
    void (async () => {
      const result = await getWordTestStatisticsWeekDataAPI({});
      Array.isArray(result.result) &&
        setWordTestPastWeekStatisticsData(result.result as GetPastWeekTestStatisticsAPIResponseDto[]);
    })();
  }, []);

  const data = {
    labels: wordTestPastWeekStatisticsData.map((x) => {
      return x.date;
    }),
    datasets: [
      {
        label: '解答数',
        data: wordTestPastWeekStatisticsData.map((x) => {
          return x.count;
        }),
        backgroundColor: 'royalblue'
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor }
      },
      title: {
        display: true,
        text: '過去１週間の回答数',
        color: textColor
      }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } }
    }
  };

  return (
    <Card variant="outlined" attr={['h-full', 'w-full', 'margin-vertical']}>
      {wordTestPastWeekStatisticsData.length > 0 ? (
        <Bar ref={chartRef} options={options} data={data} />
      ) : (
        <CircularProgress aria-label="読み込み中" />
      )}
    </Card>
  );
};
