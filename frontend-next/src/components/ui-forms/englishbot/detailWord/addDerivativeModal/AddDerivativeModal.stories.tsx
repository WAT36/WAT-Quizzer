import type { Meta, StoryObj } from '@storybook/nextjs';
import { AddDerivativeModal } from './AddDerivativeModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/AddDerivativeModal',
  component: AddDerivativeModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AddDerivativeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    wordDetail: mockWordDetailWithAntonyms
  }
};
