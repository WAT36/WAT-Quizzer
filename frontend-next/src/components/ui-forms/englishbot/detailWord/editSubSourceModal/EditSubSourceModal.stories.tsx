import type { Meta, StoryObj } from '@storybook/nextjs';
import { EditSubSourceModal } from './EditSubSourceModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/EditSubSourceModal',
  component: EditSubSourceModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof EditSubSourceModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const wordDetail = {
  ...mockWordDetailWithAntonyms,
  word_subsource: [{ id: 1, subsource: '公式問題集 Part5', created_at: '2024-01-01T00:00:00Z' }]
};

export const Add: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    subSourceIndex: -1,
    wordDetail
  }
};

export const Edit: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    subSourceIndex: 0,
    wordDetail
  }
};
