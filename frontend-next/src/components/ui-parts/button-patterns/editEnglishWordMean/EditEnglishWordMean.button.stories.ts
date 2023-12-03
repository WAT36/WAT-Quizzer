import type { Meta, StoryObj } from '@storybook/react';

import { EditEnglishWordMeanButton } from './EditEnglishWordMean.button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Molecules/ButtonPatterns/EditEnglishWordMeanButton',
  component: EditEnglishWordMeanButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof EditEnglishWordMeanButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const GetQuiz: Story = {
  args: {
    meanData: [],
    meanDataIndex: -1,
    inputEditData: {
      wordId: -1,
      wordName: '',
      wordmeanId: -1,
      meanId: -1,
      mean: '',
      partofspeechId: -1,
      partofspeechName: ''
    }
  }
};
