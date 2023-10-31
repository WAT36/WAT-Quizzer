import type { Meta, StoryObj } from '@storybook/react';

import { SubmitEnglishBotTestButton } from './submitEnglishBotTest.button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Molecules/ButtonPatterns/SubmitEnglishBotTestButton',
  component: SubmitEnglishBotTestButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof SubmitEnglishBotTestButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SubmitEnglishBotTest: Story = {
  args: {
    wordId: 0,
    selectedValue: true
  }
};
