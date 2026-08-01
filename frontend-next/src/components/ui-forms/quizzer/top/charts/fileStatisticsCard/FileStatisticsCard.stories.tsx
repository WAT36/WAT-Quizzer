import type { Meta, StoryObj } from '@storybook/nextjs';
import { FileStatisticsCard } from './FileStatisticsCard';

const meta = {
  title: 'Organisms/Quizzer/Top/FileStatisticsCard',
  component: FileStatisticsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof FileStatisticsCard>;

export default meta;

// api-wrapper.ts の NEXT_PUBLIC_MOCK_MODE=true 設定（.storybook/main.ts）により
// getQuizFileStatisticsDataAPI は自動的にモックデータへ差し替わる
export const Mock: StoryObj<typeof meta> = {
  args: {
    file_num: 1
  }
};
