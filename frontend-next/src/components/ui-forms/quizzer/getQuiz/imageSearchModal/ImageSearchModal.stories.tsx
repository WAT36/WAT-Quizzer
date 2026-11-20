import type { Meta, StoryObj } from '@storybook/nextjs';
import { ImageSearchModal } from './ImageSearchModal';

// モックAPIは候補を9件返す（追加指示に「なし」を入れて再検索すると0件）
const meta = {
  title: 'Molecules/Quizzer/GetQuiz/ImageSearchModal',
  component: ImageSearchModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof ImageSearchModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Register: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    quizId: 1,
    onRegistered: () => {}
  }
};

export const Replace: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    quizId: 1,
    hasImage: true,
    onRegistered: () => {}
  }
};
