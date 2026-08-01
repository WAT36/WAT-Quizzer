import { Card } from '@/components/ui-elements/card/Card';
import { WordSummaryApiResponse } from 'quizzer-lib';
import { CircularProgress } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
interface WordSummaryChartProps {
  wordSummaryData: WordSummaryApiResponse[];
}

export const WordSummaryChart = ({ wordSummaryData }: WordSummaryChartProps) => {
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
        <Doughnut data={data} options={options} aria-label="単熟語登録数グラフ" />
      ) : (
        <CircularProgress aria-label="読み込み中" />
      )}
    </Card>
  );
};
