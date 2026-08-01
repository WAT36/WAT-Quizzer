import type { Meta, StoryObj } from '@storybook/nextjs';
import { Header } from './Header';

const meta = {
  title: 'Molecules/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quizzer: Story = {
  args: {
    bgColor: '#006494',
    onClick: () => {}
  }
};

export const EnglishBot: Story = {
  args: {
    bgColor: 'midnightblue',
    onClick: () => {}
  }
};
