import type { Meta, StoryObj } from '@storybook/react';

import { EditQuizForm } from './EditQuizForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/EditQuiz/EditQuizForm',
  component: EditQuizForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof EditQuizForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddQuiz: Story = {
  args: {
    editQuizRequestData: {
      file_num: -1,
      quiz_num: -1,
      quiz_id: -1
    },
    setEditQuizRequestData: undefined
  }
};
