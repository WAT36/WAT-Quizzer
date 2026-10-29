import type { Meta, StoryObj } from '@storybook/nextjs';
import { AddSynonymModal } from './AddSynonymModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/AddSynonymModal',
  component: AddSynonymModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AddSynonymModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    wordDetail: mockWordDetailWithAntonyms
  }
};
