import type { Meta, StoryObj } from '@storybook/nextjs';
import { AddAntonymModal } from './AddAntonymModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/AddAntonymModal',
  component: AddAntonymModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AddAntonymModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    wordDetail: mockWordDetailWithAntonyms
  }
};
