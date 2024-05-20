import Chart from 'react-google-charts';
import styles from '../../../../Chart.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { QuizFileStatisticsApiResponse } from 'quizzer-lib';

interface FileStatisticsCardProps {
  quizFileStatisticsData: QuizFileStatisticsApiResponse[];
}

export const FileStatisticsCard = ({ quizFileStatisticsData }: FileStatisticsCardProps) => {
  const data: [string, string | number, string | number, string | number][] = quizFileStatisticsData.map((x) => {
    return [x.file_nickname, x.basic_quiz_count, x.basic_clear, x.basic_fail];
  });
  data.unshift(['問題ファイル名', '問題数', '正解数', '不正解数']);
  const options = {
    chart: {
      title: '問題ファイル統計',
      subtitle: '(基礎)問題数,正解不正解数'
    }
  };

  return (
    <Card variant="outlined" attr="margin-vertical">
      <Chart chartType="Bar" data={data} options={options} className={styles.quiz_file} />
    </Card>
  );
};
