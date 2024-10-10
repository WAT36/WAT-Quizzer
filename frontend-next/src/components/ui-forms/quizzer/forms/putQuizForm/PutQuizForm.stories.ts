import type { Meta, StoryObj } from '@storybook/react';

import { PutQuizForm } from './PutQuizForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Forms/PutQuizForm',
  component: PutQuizForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof PutQuizForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddQuiz: Story = {
  args: {
    putQuizRequestData: {
      file_num: -1,
      quiz_num: -1,
      format_id: -1
    },
    setPutQuizRequestData: undefined
  }
};

export const BasisPanel: Story = {
  args: {
    putQuizRequestData: {
      file_num: -1,
      quiz_num: -1,
      format_id: 0
    },
    setPutQuizRequestData: undefined
  }
};

export const AppliedPanel: Story = {
  args: {
    putQuizRequestData: {
      file_num: -1,
      quiz_num: -1,
      format_id: 1
    },
    setPutQuizRequestData: undefined
  }
};

export const FourChoicePanel: Story = {
  args: {
    putQuizRequestData: {
      file_num: -1,
      quiz_num: -1,
      format_id: 2
    },
    setPutQuizRequestData: undefined
  }
};
