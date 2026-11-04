import type { Meta, StoryObj } from '@storybook/nextjs';
import { SettingsCard } from './SettingsCard';
import { SettingsCardItem } from '../settingsCardItem/SettingsCardItem';

const meta = {
  title: 'Molecules/Quizzer/Settings/SettingsCard',
  component: SettingsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof SettingsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    title: '問題ファイル',
    children: (
      <>
        <SettingsCardItem subheader="ファイル新規追加">内容1</SettingsCardItem>
        <SettingsCardItem subheader="ファイル削除">内容2</SettingsCardItem>
      </>
    )
  }
};
