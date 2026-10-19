import type { Meta, StoryObj } from '@storybook/nextjs';
import { EtymologyStack } from './EtymologyStack';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { initWordDetailResponseData } from 'quizzer-lib';
import { useState } from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/DetailWord/EtymologyStack',
  component: EtymologyStack,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof EtymologyStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for stories with state management
const EtymologyStackWithState = ({ wordDetail }: { wordDetail: GetWordDetailAPIResponseDto }) => {
  const [message, setMessage] = useState<Message>({
    message: '',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [currentWordDetail, setCurrentWordDetail] = useState<GetWordDetailAPIResponseDto>(wordDetail);

  return <EtymologyStack wordDetail={currentWordDetail} setMessage={setMessage} setWordDetail={setCurrentWordDetail} />;
};

// Mock data for stories
const mockWordDetailWithEtymology: GetWordDetailAPIResponseDto = {
  ...initWordDetailResponseData,
  id: 1,
  name: 'example',
  checked: false,
  word_etymology: [
    {
      etymology: {
        id: 1,
        name: 'ラテン語: exemplum'
      }
    },
    {
      etymology: {
        id: 2,
        name: '古フランス語: exemple'
      }
    }
  ]
};

const mockWordDetailWithoutEtymology: GetWordDetailAPIResponseDto = {
  ...initWordDetailResponseData,
  id: 2,
  name: 'test',
  checked: true,
  word_etymology: []
};

const mockWordDetailLoading: GetWordDetailAPIResponseDto = {
  ...initWordDetailResponseData,
  id: -1,
  name: '',
  checked: false,
  word_etymology: []
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WithEtymology: Story = {
  args: {
    wordDetail: mockWordDetailWithEtymology
  },
  render: (args) => <EtymologyStackWithState wordDetail={args.wordDetail} />
};

export const WithoutEtymology: Story = {
  args: {
    wordDetail: mockWordDetailWithoutEtymology
  },
  render: (args) => <EtymologyStackWithState wordDetail={args.wordDetail} />
};

export const Loading: Story = {
  args: {
    wordDetail: mockWordDetailLoading
  },
  render: (args) => <EtymologyStackWithState wordDetail={args.wordDetail} />
};

export const ReadOnly: Story = {
  args: {
    wordDetail: mockWordDetailWithEtymology
  },
  render: (args) => <EtymologyStack wordDetail={args.wordDetail} />
};
