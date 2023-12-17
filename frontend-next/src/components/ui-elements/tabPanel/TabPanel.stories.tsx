import type { Meta, StoryObj } from '@storybook/react';
import { TabPanel } from './TabPanel';

const meta = {
  title: 'Atom/TabPanel',
  component: TabPanel,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof TabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    index: 1,
    value: 1,
    children: <p>{'タブパネルテスト'}</p>
  }
};
