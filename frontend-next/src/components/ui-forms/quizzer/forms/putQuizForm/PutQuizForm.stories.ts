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
    value: -1,
    queryOfPutQuizState: {
      fileNum: -1,
      quizNum: -1
    }
  }
};

export const BasisPanel: Story = {
  args: {
    value: 0,
    queryOfPutQuizState: {
      fileNum: -1,
      quizNum: -1
    }
  }
};

export const AppliedPanel: Story = {
  args: {
    value: 1,
    queryOfPutQuizState: {
      fileNum: -1,
      quizNum: -1
    }
  }
};

export const FourChoicePanel: Story = {
  args: {
    value: 2,
    queryOfPutQuizState: {
      fileNum: -1,
      quizNum: -1
    }
  }
};
