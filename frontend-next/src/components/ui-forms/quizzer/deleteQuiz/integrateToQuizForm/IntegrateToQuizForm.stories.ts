import type { Meta, StoryObj } from '@storybook/react';

import { IntegrateToQuizForm } from './IntegrateToQuizForm';
import { initGetQuizResponseData } from 'quizzer-lib';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/DeleteQuiz/IntegrateToQuizForm',
  component: IntegrateToQuizForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof IntegrateToQuizForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    deleteQuizInfo: initGetQuizResponseData,
    quizFormatListoption: [],
    setDeleteQuizInfo: undefined
  }
};
