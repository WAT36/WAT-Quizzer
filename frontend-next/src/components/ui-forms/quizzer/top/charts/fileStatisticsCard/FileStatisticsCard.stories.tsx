import type { Meta, StoryObj } from '@storybook/nextjs';
import { FileStatisticsCard } from './FileStatisticsCard';
import { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DOUGHNUT_CHART_COLOR, DOUGHNUT_CHART_LABEL, DOUGHNUT_CHART_TITLE } from '@/constants/contents/chart';

ChartJS.register(ArcElement, Tooltip, Legend);

// モックデータ
const mockFileStatisticsDataList = [
  {
    file_num: 1,
    file_name: 'file1.csv',
    file_nickname: '英単語ファイル',
    count: 50,
    clear: 30,
    fail: 10,
    not_answered: 10,
    accuracy_rate: 0.6,
    process_rate: 80.0
  },
  {
    file_num: 2,
    file_name: 'file2.csv',
    file_nickname: '熟語ファイル',
    count: 40,
    clear: 10,
    fail: 20,
    not_answered: 10,
    accuracy_rate: 0.25,
    process_rate: 50.0
  }
];

const FileStatisticsCardWithMock = () => {
  const [selectedFileNum, setSelectedFileNum] = useState<number>(1);
  const selectedData = mockFileStatisticsDataList.find((x) => x.file_num === selectedFileNum);

  const datasets = selectedData
    ? [
        {
          label: DOUGHNUT_CHART_TITLE,
          data: [selectedData.clear, selectedData.fail, selectedData.not_answered],
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
        position: 'left' as const
      },
      title: {
        display: true,
        text: `問題ファイル統計(${selectedData ? selectedData.file_nickname : 'null'}): ${
          selectedData ? selectedData.count : '0'
        }問中`
      }
    }
  };

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="file-statistics-select">ファイル</label>
        <select
          id="file-statistics-select"
          value={selectedFileNum}
          onChange={(e) => setSelectedFileNum(Number(e.target.value))}
          style={{ marginLeft: 8 }}
        >
          {mockFileStatisticsDataList.map((option) => (
            <option key={option.file_num} value={option.file_num}>
              {option.file_nickname}
            </option>
          ))}
        </select>
      </div>
      <p>{selectedData?.process_rate ? `進捗率:${selectedData.process_rate.toFixed(2)}%` : ''}</p>
      <Card variant="outlined" attr={['margin-vertical']}>
        <Doughnut data={data} options={options} />
      </Card>
    </Card>
  );
};

const meta = {
  title: 'Organisms/Quizzer/Top/FileStatisticsCard',
  component: FileStatisticsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof FileStatisticsCard>;

export default meta;

export const Mock: StoryObj = {
  render: () => <FileStatisticsCardWithMock />
};
