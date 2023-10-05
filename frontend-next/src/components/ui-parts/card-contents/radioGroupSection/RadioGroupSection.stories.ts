import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroupSection } from './RadioGroupSection';

const meta = {
  title: 'Molecules/CardContents/RadioGroupSection',
  component: RadioGroupSection,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof RadioGroupSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const radioGroupSection: Story = {
  args: {
    sectionTitle: 'ラジオボタングループ',
    radioGroupProps: {
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
  }
};
