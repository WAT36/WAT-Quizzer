import type { Meta, StoryObj } from '@storybook/nextjs';
import { DerivativeStack } from './DerivativeStack';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { mockWordDetailLoading, mockWordDetailWithAntonyms, mockWordDetailWithoutAntonyms } from 'quizzer-lib';
import { useState } from 'react';

// 派生語を持つモックデータを追加
const mockWordDetailWithDerivatives: GetWordDetailAPIResponseDto = {
  ...mockWordDetailWithAntonyms,
  derivative: {
    derivative_group_id: 1,
    derivative_group: {
      derivative: [
        {
          word_id: 1,
          word: { name: 'happy' }
        },
        {
          word_id: 5,
          word: { name: 'happiness' }
        },
        {
          word_id: 6,
          word: { name: 'unhappy' }
        }
      ]
    }
  }
};

const meta = {
  title: 'Organisms/EnglishBot/DetailWord/DerivativeStack',
  component: DerivativeStack,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof DerivativeStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const DerivativeStackWithState = ({ wordDetail }: { wordDetail: GetWordDetailAPIResponseDto }) => {
  const [message, setMessage] = useState<Message>({
    message: '',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [currentWordDetail, setCurrentWordDetail] = useState<GetWordDetailAPIResponseDto>(wordDetail);

  return (
    <DerivativeStack wordDetail={currentWordDetail} setMessage={setMessage} setWordDetail={setCurrentWordDetail} />
  );
};

export const WithDerivatives: Story = {
  args: {
    wordDetail: mockWordDetailWithDerivatives
  },
  render: (args) => <DerivativeStackWithState wordDetail={args.wordDetail} />
};

export const WithoutDerivatives: Story = {
  args: {
    wordDetail: mockWordDetailWithoutAntonyms
  },
  render: (args) => <DerivativeStackWithState wordDetail={args.wordDetail} />
};

export const Loading: Story = {
  args: {
    wordDetail: mockWordDetailLoading
  },
  render: (args) => <DerivativeStackWithState wordDetail={args.wordDetail} />
};

export const ReadOnly: Story = {
  args: {
    wordDetail: mockWordDetailWithDerivatives
  },
  render: (args) => <DerivativeStack wordDetail={args.wordDetail} />
};
