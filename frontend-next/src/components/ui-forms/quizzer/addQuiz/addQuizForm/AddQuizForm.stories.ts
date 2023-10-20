import type { Meta, StoryObj } from '@storybook/react';

import { AddQuizForm } from './AddQuizForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/AddQuiz/AddQuizForm',
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
    filelistoption: [],
    value: -1,
    queryOfAddQuizState: {
      fileNum: -1
    }
  }
};

export const BasisPanel: Story = {
  args: {
    filelistoption: [],
    value: 0,
    queryOfAddQuizState: {
      fileNum: -1
    }
  }
};

export const AppliedPanel: Story = {
  args: {
    filelistoption: [],
    value: 1,
    queryOfAddQuizState: {
      fileNum: -1
    }
  }
};

export const FourChoicePanel: Story = {
  args: {
    filelistoption: [],
    value: 2,
    queryOfAddQuizState: {
      fileNum: -1
    }
  }
};
