import type { Meta, StoryObj } from '@storybook/nextjs';
import { TestLogPastWeekChart } from './TestLogPastWeekChart';

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

// api-wrapper.ts の NEXT_PUBLIC_MOCK_MODE=true 設定（.storybook/main.ts）により
// getWordTestStatisticsWeekDataAPI は自動的にモックデータへ差し替わる
export const Main: Story = {};
