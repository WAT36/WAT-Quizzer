import type { Meta, StoryObj } from '@storybook/nextjs';
import { SourceStatisticsCard } from './SourceStatisticsCard';

const meta = {
  title: 'Organisms/EnglishBot/Top/SourceStatisticsCard',
  component: SourceStatisticsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof SourceStatisticsCard>;

export default meta;

// api-wrapper.ts の NEXT_PUBLIC_MOCK_MODE=true 設定（.storybook/main.ts）により
// getSourceStatisticsDataAPI は自動的にモックデータへ差し替わる
export const Mock: StoryObj<typeof meta> = {};
