import type { Meta, StoryObj } from '@storybook/nextjs';
import { FinishSessionModal } from './FinishSessionModal';

const meta = {
  title: 'Molecules/Quizzer/GetQuiz/FinishSessionModal',
  component: FinishSessionModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof FinishSessionModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    totalCount: 10,
    answeredCount: 3,
    onConfirm: () => {}
  }
};
