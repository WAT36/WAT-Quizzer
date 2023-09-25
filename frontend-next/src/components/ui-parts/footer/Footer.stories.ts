import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta = {
  title: 'Footer',
  component: Footer,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quizzer: Story = {
  args: {
    bgColor: '#0077B6',
    topHref: process.env.NEXT_PUBLIC_URL_END || ''
  }
};

export const EnglishBot: Story = {
  args: {
    bgColor: 'midnightblue',
    topHref: process.env.NEXT_PUBLIC_URL_END || ''
  }
};
