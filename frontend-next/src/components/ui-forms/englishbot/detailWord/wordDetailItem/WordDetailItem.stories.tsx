import type { Meta, StoryObj } from '@storybook/nextjs';
import { WordDetailItem } from './WordDetailItem';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/WordDetailItem',
  component: WordDetailItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof WordDetailItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: {
    title: 'desert'
  }
};

// 意味：上に品詞を出して編集できる
export const WithTopCaptionAndEdit: Story = {
  args: {
    title: '捨てる、見捨てる',
    topCaption: '[動詞]',
    onEdit: () => {}
  }
};

// サブ出典：下に登録日を出して編集できる
export const WithBottomCaptionAndEdit: Story = {
  args: {
    title: '公式問題集 Part5',
    bottomCaption: '[2024/01/01]',
    onEdit: () => {}
  }
};
