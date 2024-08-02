import { Card } from '@/components/ui-elements/card/Card';
import { GetPastWeekTestStatisticsAPIResponseDto } from 'quizzer-lib';
import { CircularProgress } from '@mui/material';
import { Chart } from 'react-google-charts';

interface TestLogPastWeekChartProps {
  wordTestPastWeekStatisticsData: GetPastWeekTestStatisticsAPIResponseDto[];
}

export const TestLogPastWeekChart = ({ wordTestPastWeekStatisticsData }: TestLogPastWeekChartProps) => {
  const data = [
    ['Day', 'count'],
    ...wordTestPastWeekStatisticsData.map((x) => {
      return [x.date, x.count];
    })
  ];

  const options = {
    title: '過去１週間の回答数',
    legend: { position: 'top' }
  };

  return (
    <Card variant="outlined" attr="rect-400 margin-vertical">
      {wordTestPastWeekStatisticsData.length > 0 ? (
        <Chart chartType="BarChart" width="100%" height="100%" data={data} options={options} />
      ) : (
        <CircularProgress />
      )}
    </Card>
  );
};
