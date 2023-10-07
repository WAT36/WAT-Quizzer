import type { Meta, StoryObj } from '@storybook/react';
import { PullDown } from './PullDown';

const meta = {
  title: 'Atom/PullDown',
  component: PullDown,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof PullDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'プルダウンテスト',
    fileListOption: [
      {
        value: 0,
        label: '選択肢テスト０'
      },
      {
        value: 1,
        label: '選択肢テスト１'
      },
      {
        value: 2,
        label: '選択肢テスト２'
      }
    ]
  }
};
