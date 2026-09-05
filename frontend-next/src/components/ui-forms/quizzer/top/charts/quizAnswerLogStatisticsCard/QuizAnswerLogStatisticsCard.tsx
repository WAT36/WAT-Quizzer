import { Card } from '@/components/ui-elements/card/Card';
import { useEffect, useState, useMemo } from 'react';
import { AnswerLogStatisticsApiResponse, GetAnswerLogStatisticsAPIRequestDto, DateUnit } from 'quizzer-lib';
import { getAnswerLogStatisticsDataAPI } from '@/utils/api-wrapper';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  LineElement,
  PointElement,
  LineController
} from 'chart.js';
import { CircularProgress } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';
import { ANSWER_LOG_HISTGRAM_LABEL, ANSWER_LOG_HISTGRAM_COLOR, DATE_UNIT_OPTION } from '@/constants/contents/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);
interface QuizAnswerLogStatisticsCardProps {
  file_num: number;
}

export const QuizAnswerLogStatisticsCard = ({ file_num }: QuizAnswerLogStatisticsCardProps) => {
  const chartRef = useChartAriaLabel('回答数推移グラフ');
  const { gridColor, textColor } = useChartThemeColors();
  const [answerLogStatisticsData, setAnswerLogStatisticsData] = useState<AnswerLogStatisticsApiResponse[]>([]);
  const [dateUnit, setDateUnit] = useState<DateUnit | undefined>(undefined);

  const getAnswerLogStatisticsData = useMemo<GetAnswerLogStatisticsAPIRequestDto>(() => {
    return {
      ...(file_num !== undefined && { file_num }),
      ...(dateUnit !== undefined && { date_unit: dateUnit })
    };
  }, [file_num, dateUnit]);

  useEffect(() => {
    (async () => {
      const result = await getAnswerLogStatisticsDataAPI({ getAnswerLogStatisticsData });
      result.result && setAnswerLogStatisticsData(result.result as AnswerLogStatisticsApiResponse[]);
    })();
  }, [getAnswerLogStatisticsData]);

  const data: ChartData<'bar' | 'line', number[], string> = {
    labels: answerLogStatisticsData.map((x) => {
      return x.date;
    }),
    datasets: [
      {
        label: ANSWER_LOG_HISTGRAM_LABEL[0],
        data: answerLogStatisticsData.map((x) => {
          return x.count;
        }),
        backgroundColor: ANSWER_LOG_HISTGRAM_COLOR[0],
        type: 'bar',
        order: 2,
        yAxisID: 'y'
      },
      {
        label: ANSWER_LOG_HISTGRAM_LABEL[1],
        data: answerLogStatisticsData.map((x) => {
          return x.accuracy_rate;
        }),
        backgroundColor: ANSWER_LOG_HISTGRAM_COLOR[1],
        type: 'line',
        order: 1,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor }
      },
      title: {
        display: true,
        text: `過去${answerLogStatisticsData.length}${
          getAnswerLogStatisticsData.date_unit === 'month'
            ? 'ヶ月'
            : getAnswerLogStatisticsData.date_unit === 'week'
              ? '週'
              : '日'
        }間の回答数`,
        color: textColor
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor }
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        grid: { color: gridColor },
        ticks: { color: textColor },
        title: {
          display: true,
          text: ANSWER_LOG_HISTGRAM_LABEL[0],
          color: textColor
        }
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 0,
        max: 100,
        ticks: { color: textColor },
        title: {
          display: true,
          text: ANSWER_LOG_HISTGRAM_LABEL[1] + '(%)',
          color: textColor
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <PullDown
        label={'日付単位'}
        optionList={DATE_UNIT_OPTION}
        onChange={(e) => setDateUnit(e.target.value as DateUnit)}
      />
      <div className="h-[300px]">
        {answerLogStatisticsData.length > 0 ? (
          <Chart ref={chartRef} type="bar" options={options} data={data} />
        ) : (
          <CircularProgress aria-label="読み込み中" />
        )}
      </div>
    </Card>
  );
};
