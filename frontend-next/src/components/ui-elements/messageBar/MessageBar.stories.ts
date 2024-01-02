import type { Meta, StoryObj } from '@storybook/react';
import { MessageBar } from './MessageBar';

const meta = {
  title: 'Atom/MessageBar',
  component: MessageBar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  }
} satisfies Meta<typeof MessageBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    messageState: {
      message: 'メッセージテスト',
      messageColor: 'common.black',
      isDisplay: true
    }
  }
};
