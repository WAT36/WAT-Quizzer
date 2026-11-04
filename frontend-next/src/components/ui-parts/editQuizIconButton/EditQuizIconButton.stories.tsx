import type { Meta, StoryObj } from '@storybook/nextjs';
import { EditQuizIconButton } from './EditQuizIconButton';

const meta = {
  title: 'Molecules/EditQuizIconButton',
  component: EditQuizIconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof EditQuizIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    fileNum: 1,
    quizNum: 2
  }
};
