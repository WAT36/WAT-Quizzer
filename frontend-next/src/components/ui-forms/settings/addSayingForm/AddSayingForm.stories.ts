import type { Meta, StoryObj } from '@storybook/react';

import { AddSayingForm } from './AddSayingForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Settings/AddSayingForm',
  component: AddSayingForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof AddSayingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddBook: Story = {
  args: {
    inputSaying: '格言',
    selectedBookId: 0,
    booklistoption: []
  }
};
