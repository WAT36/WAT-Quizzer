import type { Meta, StoryObj } from '@storybook/nextjs';
import { EditMeanModal } from './EditMeanModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/EditMeanModal',
  component: EditMeanModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof EditMeanModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const posList = [
  { value: '1', label: '動詞' },
  { value: '2', label: '名詞' }
];

export const Add: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    meanIndex: -1,
    posList,
    wordDetail: mockWordDetailWithAntonyms
  }
};

export const Edit: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    meanIndex: 0,
    posList,
    wordDetail: mockWordDetailWithAntonyms
  }
};
