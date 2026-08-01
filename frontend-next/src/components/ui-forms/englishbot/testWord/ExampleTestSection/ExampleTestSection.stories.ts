import type { Meta, StoryObj } from '@storybook/nextjs';
import { ExampleTestSection } from './ExampleTestSection';

const meta = {
  title: 'Organisms/EnglishBot/TestWord/ExampleTestSection',
  component: ExampleTestSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ExampleTestSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sourcelistoption: [
      { value: 1, label: 'TOEIC' },
      { value: 2, label: '英検' }
    ]
  }
};
