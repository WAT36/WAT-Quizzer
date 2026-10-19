import type { Meta, StoryObj } from '@storybook/nextjs';
import { TestLogPastWeekChart } from './TestLogPastWeekChart';
import type { GetPastWeekTestStatisticsAPIResponseDto } from 'quizzer-lib';

const meta = {
  title: 'Organisms/EnglishBot/Top/TestLogPastWeekChart',
  component: TestLogPastWeekChart,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof TestLogPastWeekChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// モックデータ：過去7日間のテストログ
const mockData: GetPastWeekTestStatisticsAPIResponseDto[] = [
  { date: '2024-01-01', count: 15 },
  { date: '2024-01-02', count: 23 },
  { date: '2024-01-03', count: 8 },
  { date: '2024-01-04', count: 31 },
  { date: '2024-01-05', count: 19 },
  { date: '2024-01-06', count: 12 },
  { date: '2024-01-07', count: 27 }
];

// データありのストーリー
export const WithData: Story = {
  args: {
    wordTestPastWeekStatisticsData: mockData
  }
};

// データなしのストーリー（ローディング状態）
export const NoData: Story = {
  args: {
    wordTestPastWeekStatisticsData: []
  }
};

// 高スコアのデータ
export const HighScoreData: Story = {
  args: {
    wordTestPastWeekStatisticsData: [
      { date: '2024-01-01', count: 50 },
      { date: '2024-01-02', count: 75 },
      { date: '2024-01-03', count: 60 },
      { date: '2024-01-04', count: 90 },
      { date: '2024-01-05', count: 85 },
      { date: '2024-01-06', count: 70 },
      { date: '2024-01-07', count: 95 }
    ]
  }
};

// 低スコアのデータ
export const LowScoreData: Story = {
  args: {
    wordTestPastWeekStatisticsData: [
      { date: '2024-01-01', count: 1 },
      { date: '2024-01-02', count: 0 },
      { date: '2024-01-03', count: 2 },
      { date: '2024-01-04', count: 1 },
      { date: '2024-01-05', count: 0 },
      { date: '2024-01-06', count: 3 },
      { date: '2024-01-07', count: 1 }
    ]
  }
};
