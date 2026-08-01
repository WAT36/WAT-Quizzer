import type { Meta, StoryObj } from '@storybook/nextjs';
import { QuizAnswerLogStatisticsCard } from './QuizAnswerLogStatisticsCard';

const meta = {
  title: 'Organisms/Quizzer/Top/QuizAnswerLogStatisticsCard',
  component: QuizAnswerLogStatisticsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof QuizAnswerLogStatisticsCard>;

export default meta;

// api-wrapper.ts の NEXT_PUBLIC_MOCK_MODE=true 設定（.storybook/main.ts）により
// getAnswerLogStatisticsDataAPI は自動的にモックデータへ差し替わる
export const Mock: StoryObj<typeof meta> = {
  args: {
    file_num: 1
  }
};
