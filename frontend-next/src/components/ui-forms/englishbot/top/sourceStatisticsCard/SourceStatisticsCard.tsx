import { Card } from '@/components/ui-elements/card/Card';
import { PullDownOptionDto, SourceStatisticsApiResponse } from 'quizzer-lib';
import { getSourceStatisticsDataAPI } from '@/utils/api-wrapper';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useChartAriaLabel } from '@/hooks/useChartAriaLabel';
import { useChartThemeColors } from '@/hooks/useChartThemeColors';

interface SourceStatisticsCardProps {}
ChartJS.register(ArcElement, Tooltip, Legend);

export const SourceStatisticsCard = ({}: SourceStatisticsCardProps) => {
  const chartRef = useChartAriaLabel('出典別正答率グラフ');
  const { textColor } = useChartThemeColors();
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionDto[]>([]);
  const [selectedSource, setSelectedSource] = useState<number>(1);
  const [sourceStatisticsData, setSourceStatisticsData] = useState<SourceStatisticsApiResponse[]>([]);
  const selectedSourceStaticsData = sourceStatisticsData.find((x) => x.id === selectedSource);

  useEffect(() => {
    (async () => {
      const result = await getSourceStatisticsDataAPI({});
      result.result && setSourceStatisticsData(result.result as SourceStatisticsApiResponse[]);
      // 出典プルダウン作成
      result.result &&
        setSourcelistoption(
          (result.result as SourceStatisticsApiResponse[]).map((x) => {
            return {
              value: String(x.id),
              label: x.name
            } as PullDownOptionDto;
          })
        );
    })();
  }, []);

  const labels = ['正解数', '不正解数', '未解答数'];
  const datasets = selectedSourceStaticsData
    ? [
        {
          label: '正答率分布',
          data: [
            selectedSourceStaticsData.clear_count || 0,
            selectedSourceStaticsData.fail_count || 0,
            selectedSourceStaticsData.not_answered || 0
          ],
          backgroundColor: ['crimson', 'black', 'dimgray']
        }
      ]
    : [];
  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left' as const,
        labels: { color: textColor }
      },
      title: {
        display: true,
        text: `出典統計(${selectedSourceStaticsData ? selectedSourceStaticsData.name : 'null'}): ${
          selectedSourceStaticsData ? selectedSourceStaticsData.count : '0'
        }問中`,
        color: textColor
      }
    }
  };

  return (
    <>
      <Card variant="outlined" attr={['margin-vertical']}>
        {/*TODO quizzer形式のプルダウン結構使うから　あらかじめquizzerのファイル値が入った状態のプルダウンをコンポーネントとして用意したほうがいい気した */}
        <PullDown label={'出典'} optionList={sourcelistoption} onChange={(e) => setSelectedSource(+e.target.value)} />
        <Card variant="outlined" attr={['rect-600', 'margin-vertical']}>
          {sourceStatisticsData.length > 0 ? (
            <Doughnut ref={chartRef} data={data} options={options} />
          ) : (
            <CircularProgress aria-label="読み込み中" />
          )}
        </Card>
      </Card>
    </>
  );
};
