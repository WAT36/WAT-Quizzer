import type { Meta, StoryObj } from '@storybook/react';
import { RangeSliderSection } from './RangeSliderSection';

const meta = {
  title: 'Molecules/CardContents/RangeSliderSection',
  component: RangeSliderSection,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof RangeSliderSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const rangeSliderSection: Story = {
  args: {
    sectionTitle: '(タイトル)'
  }
};
