import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccuracyRateHistgramCard } from './AccuracyRateHistgramCard';

// API呼び出しは .storybook/main.ts の NEXT_PUBLIC_MOCK_MODE=true 設定により
// api-wrapper.ts 経由で自動的にモックデータ（quizzer-lib）へ差し替わる

const meta = {
  title: 'Quizzer/AccuracyRateHistgramCard',
  component: AccuracyRateHistgramCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof AccuracyRateHistgramCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    file_num: 1
  }
};
