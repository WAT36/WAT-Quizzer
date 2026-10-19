import type { Meta, StoryObj } from '@storybook/nextjs';

import { WordTestSection } from './WordTestSection';
import type { PullDownOptionDto } from 'quizzer-lib';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/TestWord/WordTestSection',
  component: WordTestSection,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof WordTestSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleSourceListOption: PullDownOptionDto[] = [
  { value: '1', label: 'TOEIC' },
  { value: '2', label: '英検' },
  { value: '3', label: '大学入試' },
  { value: '4', label: 'ビジネス英語' },
  { value: '5', label: '日常会話' }
];

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    sourcelistoption: sampleSourceListOption
  }
};

export const EmptySourceList: Story = {
  args: {
    sourcelistoption: []
  }
};

export const SingleSource: Story = {
  args: {
    sourcelistoption: [{ value: '1', label: 'TOEIC' }]
  }
};

export const ManySources: Story = {
  args: {
    sourcelistoption: [
      { value: '1', label: 'TOEIC' },
      { value: '2', label: '英検' },
      { value: '3', label: '大学入試' },
      { value: '4', label: 'ビジネス英語' },
      { value: '5', label: '日常会話' },
      { value: '6', label: 'TOEFL' },
      { value: '7', label: 'IELTS' },
      { value: '8', label: 'GMAT' },
      { value: '9', label: 'GRE' },
      { value: '10', label: 'SAT' }
    ]
  }
};
