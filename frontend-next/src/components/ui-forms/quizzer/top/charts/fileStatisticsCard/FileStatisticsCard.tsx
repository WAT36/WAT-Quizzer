import { Card } from '@/components/ui-elements/card/Card';
import { QuizFileStatisticsApiResponse } from 'quizzer-lib';
import { getQuizFileStatisticsDataAPI } from '@/utils/api-wrapper';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DOUGHNUT_CHART_COLOR, DOUGHNUT_CHART_LABEL, DOUGHNUT_CHART_TITLE } from '@/constants/contents/chart';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';

interface FileStatisticsCardProps {
  file_num: number;
}
ChartJS.register(ArcElement, Tooltip, Legend);

export const FileStatisticsCard = ({ file_num }: FileStatisticsCardProps) => {
  const chartRef = useChartAriaLabel('問題ファイル統計グラフ');
  const { textColor } = useChartThemeColors();
  const [quizFileStatisticsData, setQuizFileStatisticsData] = useState<QuizFileStatisticsApiResponse>();

  useEffect(() => {
    (async () => {
      const result = await getQuizFileStatisticsDataAPI({ file_num });
      result.result && setQuizFileStatisticsData(result.result as QuizFileStatisticsApiResponse);
    })();
  }, [file_num]);

  const datasets = quizFileStatisticsData
    ? [
        {
          label: DOUGHNUT_CHART_TITLE,
          data: [
            quizFileStatisticsData.clear || 0,
            quizFileStatisticsData.fail || 0,
            quizFileStatisticsData.not_answered || 0
          ],
          backgroundColor: DOUGHNUT_CHART_COLOR
        }
      ]
    : [];
  const data = {
    labels: DOUGHNUT_CHART_LABEL,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `問題ファイル統計(${quizFileStatisticsData ? quizFileStatisticsData.file_nickname : 'null'}): ${
          quizFileStatisticsData ? quizFileStatisticsData.count : '0'
        }問中`,
        color: textColor
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return (
    <>
      <Card variant="outlined" attr={['margin-vertical']}>
        <p>
          {quizFileStatisticsData?.process_rate ? `進捗率:${quizFileStatisticsData?.process_rate.toFixed(2)}%` : ''}
        </p>
        <Card variant="outlined" attr={['margin-vertical']}>
          {quizFileStatisticsData ? (
            <Doughnut ref={chartRef} data={data} options={options} />
          ) : (
            <CircularProgress aria-label="読み込み中" />
          )}
        </Card>
      </Card>
    </>
  );
};
