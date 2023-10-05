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

export const messageCard: Story = {
  args: {
    message: '(メッセージ)',
    messageColor: 'common.black'
  }
};

export const errorMessage: Story = {
  args: {
    message: '(エラー)',
    messageColor: 'error'
  }
};

export const successMessage: Story = {
  args: {
    message: '(成功！)',
    messageColor: 'success.light'
  }
};

export const loadingMessage: Story = {
  args: {
    message: '(通信中...)',
    messageColor: '#d3d3d3'
  }
};
