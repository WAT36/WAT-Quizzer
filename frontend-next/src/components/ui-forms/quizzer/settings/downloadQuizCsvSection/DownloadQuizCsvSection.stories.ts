import type { Meta, StoryObj } from '@storybook/nextjs';

import { DownloadQuizCsvSection } from './DownloadQuizCsvSection';
import type { PullDownOptionDto } from 'quizzer-lib';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/Settings/DownloadQuizCsvSection',
  component: DownloadQuizCsvSection,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof DownloadQuizCsvSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleFileListOption: PullDownOptionDto[] = [
  { value: '1', label: 'ファイル1' },
  { value: '2', label: 'ファイル2' },
  { value: '3', label: 'ファイル3' },
  { value: '4', label: 'ファイル4' },
  { value: '5', label: 'ファイル5' }
];

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    filelistoption: sampleFileListOption
  }
};

export const EmptyFileList: Story = {
  args: {
    filelistoption: []
  }
};

export const SingleFile: Story = {
  args: {
    filelistoption: [{ value: '1', label: '単一ファイル' }]
  }
};
