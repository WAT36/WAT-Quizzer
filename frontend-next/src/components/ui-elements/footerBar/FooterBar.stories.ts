import type { Meta, StoryObj } from '@storybook/react';
import { FooterBar } from './FooterBar';

const meta = {
  title: 'Atom/FooterBar',
  component: FooterBar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FooterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quizzer: Story = {
  args: {
    bgColor: '#0077B6'
  }
};

export const EnglishBot: Story = {
  args: {
    bgColor: 'midnightblue'
  }
};
