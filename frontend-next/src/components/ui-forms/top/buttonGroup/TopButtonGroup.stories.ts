import type { Meta, StoryObj } from '@storybook/react';

import { TopButtonGroup } from './TopButtonGroup';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Top/TopButtonGroup',
  component: TopButtonGroup,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof TopButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ButtonGroup: Story = {
  args: {}
};
