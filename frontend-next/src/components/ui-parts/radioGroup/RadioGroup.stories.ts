import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Molecules/RadioGroup',
  component: RadioGroup,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    radioButtonProps: [
      {
        value: 'a',
        label: 'ボタンA'
      },
      {
        value: 'b',
        label: 'ボタンB'
      }
    ],
    defaultValue: 'a'
  }
};
