import type { Meta, StoryObj } from '@storybook/react';
import { MessageCard } from './MessageCard';

const meta = {
  title: 'Molecules/MessageCard',
  component: MessageCard,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof MessageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    messageState: {
      message: '(メッセージ)',
      messageColor: 'common.black'
    }
  }
};

export const ErrorMessage: Story = {
  args: {
    messageState: {
      message: '(エラー)',
      messageColor: 'error'
    }
  }
};

export const SuccessMessage: Story = {
  args: {
    messageState: {
      message: '(成功！)',
      messageColor: 'success.light'
    }
  }
};

export const LoadingMessage: Story = {
  args: {
    messageState: {
      message: '(通信中...)',
      messageColor: 'dimgray'
    }
  }
};
