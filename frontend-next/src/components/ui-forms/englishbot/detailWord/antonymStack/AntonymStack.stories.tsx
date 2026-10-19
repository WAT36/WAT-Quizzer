import type { Meta, StoryObj } from '@storybook/nextjs';
import { AntonymStack } from './AntonymStack';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { mockWordDetailLoading, mockWordDetailWithAntonyms, mockWordDetailWithoutAntonyms } from 'quizzer-lib';
import { useState } from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/DetailWord/AntonymStack',
  component: AntonymStack,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof AntonymStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for stories with state management
const AntonymStackWithState = ({ wordDetail }: { wordDetail: GetWordDetailAPIResponseDto }) => {
  const [message, setMessage] = useState<Message>({
    message: '',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [currentWordDetail, setCurrentWordDetail] = useState<GetWordDetailAPIResponseDto>(wordDetail);

  return <AntonymStack wordDetail={currentWordDetail} setMessage={setMessage} setWordDetail={setCurrentWordDetail} />;
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WithAntonyms: Story = {
  args: {
    wordDetail: mockWordDetailWithAntonyms
  },
  render: (args) => <AntonymStackWithState wordDetail={args.wordDetail} />
};

export const WithoutAntonyms: Story = {
  args: {
    wordDetail: mockWordDetailWithoutAntonyms
  },
  render: (args) => <AntonymStackWithState wordDetail={args.wordDetail} />
};

export const Loading: Story = {
  args: {
    wordDetail: mockWordDetailLoading
  },
  render: (args) => <AntonymStackWithState wordDetail={args.wordDetail} />
};

export const ReadOnly: Story = {
  args: {
    wordDetail: mockWordDetailWithAntonyms
  },
  render: (args) => <AntonymStack wordDetail={args.wordDetail} />
};
