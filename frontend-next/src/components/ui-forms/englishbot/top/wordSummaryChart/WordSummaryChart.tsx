import { Card } from '@/components/ui-elements/card/Card';
import type { WordSummaryApiResponse } from 'quizzer-lib';
import { CircularProgress } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';
import { useEffect, useState } from 'react';
import { getWordSummaryDataAPI } from '@/utils/api-wrapper';
ChartJS.register(ArcElement, Tooltip, Legend);

export const WordSummaryChart = () => {
  const chartRef = useChartAriaLabel('単熟語登録数グラフ');
  const { textColor } = useChartThemeColors();
  const [wordSummaryData, setWordSummaryData] = useState<WordSummaryApiResponse[]>([]);

  useEffect(() => {
    void (async () => {
      const result = await getWordSummaryDataAPI();
      Array.isArray(result.result) && setWordSummaryData(result.result as WordSummaryApiResponse[]);
    })();
  }, []);

  const data = {
    labels: wordSummaryData.filter((x) => x.name !== 'all').map((x) => x.name),
    datasets: [
      {
        label: '個数',
        data: wordSummaryData.filter((x) => x.name !== 'all').map((x) => +x.count),
        backgroundColor: ['red', 'blue'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor }
      },
      title: {
        display: true,
        text: '単熟語登録数',
        color: textColor
      }
    }
  };

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      {wordSummaryData.length > 0 ? (
        <Doughnut ref={chartRef} data={data} options={options} />
      ) : (
        <CircularProgress aria-label="読み込み中" />
      )}
    </Card>
  );
};
