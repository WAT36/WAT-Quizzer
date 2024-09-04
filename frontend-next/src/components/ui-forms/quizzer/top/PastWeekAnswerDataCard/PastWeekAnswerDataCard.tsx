import Chart from 'react-google-charts';
import styles from '../../../../Chart.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { useEffect, useState } from 'react';
import { getQuizStatisticsWeekDataAPI, QuizStatisticsWeekApiResponse } from 'quizzer-lib';

interface PastWeekAnswerDataCardProps {}

export const PastWeekAnswerDataCard = ({}: PastWeekAnswerDataCardProps) => {
  const [quizStatisticsWeekData, setQuizStatisticsWeekData] = useState<QuizStatisticsWeekApiResponse[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getQuizStatisticsWeekDataAPI({});
      result.result && setQuizStatisticsWeekData(result.result as QuizStatisticsWeekApiResponse[]);
    })();
  }, []);

  const data: [string, string | number][] = quizStatisticsWeekData.map((x) => {
    return [x.date, x.count];
  });
  data.unshift(['日', '解答数']);
  const options = {
    chart: {
      title: 'quizzer過去１週間解答数統計',
      subtitle: '日,解答数'
    },
    vAxis: {
      viewWindow: {
        min: 0
      }
    }
  };

  return (
    <Card variant="outlined" attr="margin-vertical">
      <Chart chartType="Bar" data={data} options={options} className={styles.quiz_stat_week} />
    </Card>
  );
};
