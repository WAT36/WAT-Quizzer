import type { Meta, StoryObj } from '@storybook/react';

import { DeleteAnswerLogFileSection } from './DeleteAnswerLogFileSection';
import { quizFileMock } from '../../../../../../.storybook/mockData/quizFile';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/Settings/DeleteAnswerLogFileSection',
  component: DeleteAnswerLogFileSection,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof DeleteAnswerLogFileSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    deleteLogOfFileNum: -1,
    deleteLogOfFileAlertOpen: false,
    filelistoption: quizFileMock
  }
};
