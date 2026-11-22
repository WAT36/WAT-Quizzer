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
    quizSentence:
      '層状の流体を下側から均一に熱した時に生じる細胞状の対流構造を、発見したフランスの物理学者の名前から何渦というでしょう？',
    answer: 'ベナール渦',
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
