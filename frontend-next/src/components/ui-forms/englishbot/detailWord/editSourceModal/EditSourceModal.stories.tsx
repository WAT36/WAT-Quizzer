import type { Meta, StoryObj } from '@storybook/nextjs';
import { EditSourceModal } from './EditSourceModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/EditSourceModal',
  component: EditSourceModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof EditSourceModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const wordDetail = {
  ...mockWordDetailWithAntonyms,
  word_source: [{ source: { id: 1, name: 'TOEIC' } }]
};

const sourceList = [
  { value: '1', label: 'TOEIC' },
  { value: '2', label: '英検準1級' }
];

export const Add: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    sourceIndex: -1,
    sourceList,
    wordDetail
  }
};

export const Edit: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    sourceIndex: 0,
    sourceList,
    wordDetail
  }
};
