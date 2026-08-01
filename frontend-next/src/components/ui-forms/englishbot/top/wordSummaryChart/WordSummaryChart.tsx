import { Card } from '@/components/ui-elements/card/Card';
import { WordSummaryApiResponse } from 'quizzer-lib';
import { CircularProgress } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
ChartJS.register(ArcElement, Tooltip, Legend);
interface WordSummaryChartProps {
  wordSummaryData: WordSummaryApiResponse[];
}

export const WordSummaryChart = ({ wordSummaryData }: WordSummaryChartProps) => {
  const chartRef = useChartAriaLabel('単熟語登録数グラフ');
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
        position: 'top' as const
      },
      title: {
        display: true,
        text: '単熟語登録数'
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
