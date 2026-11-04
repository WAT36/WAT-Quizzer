import type { Meta, StoryObj } from '@storybook/nextjs';
import { SettingsCardItem } from './SettingsCardItem';

const meta = {
  title: 'Molecules/Quizzer/Settings/SettingsCardItem',
  component: SettingsCardItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof SettingsCardItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    subheader: 'ファイル選択',
    className: 'flex w-full',
    children: '内容'
  }
};
