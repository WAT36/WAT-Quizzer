import Chart from 'react-google-charts';
import styles from '../../../../Chart.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { WordSummaryApiResponse } from 'quizzer-lib';

interface WordSummaryChartProps {
  wordSummaryData: WordSummaryApiResponse[];
}

export const WordSummaryChart = ({ wordSummaryData }: WordSummaryChartProps) => {
  const data: [string, string | number][] = wordSummaryData
    .filter((x) => {
      return x.name !== 'all';
    })
    .map((x) => {
      return [x.name, +x.count];
    });
  const sum = data.reduce((accumulator, currentValue) => accumulator + +currentValue[1], 0);
  data.unshift(['word/idiom', 'num']);
  const options = {
    title: `単熟語登録数:${sum}`,
    pieHole: 0.4,
    is3D: false
  };

  return (
    <Card variant="outlined" attr="rect-400 margin-vertical">
      <Chart chartType="PieChart" data={data} options={options} className={styles.chart} />
    </Card>
  );
};
