import type { Meta, StoryObj } from '@storybook/react';

import { AddQuizForm } from './AddQuizForm';
import { quizFileMock } from '../../../../../../.storybook/mockData/quizFile';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/AddQuiz/AddQuizForm',
  component: AddQuizForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof AddQuizForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddQuiz: Story = {
  args: {
    setAddLog: undefined
  }
};

export const BasisPanel: Story = {
  args: {
    setAddLog: undefined
  }
};

export const AppliedPanel: Story = {
  args: {
    setAddLog: undefined
  }
};

export const FourChoicePanel: Story = {
  args: {
    setAddLog: undefined
  }
};
