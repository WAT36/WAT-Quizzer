import type { Meta, StoryObj } from '@storybook/nextjs';
import { SynonymStack } from './SynonymStack';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { initWordDetailResponseData } from 'quizzer-lib';
import { useState } from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/DetailWord/SynonymStack',
  component: SynonymStack,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof SynonymStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for stories with state management
const SynonymStackWithState = ({ wordDetail }: { wordDetail: GetWordDetailAPIResponseDto }) => {
  const [message, setMessage] = useState<Message>({
    message: '',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [currentWordDetail, setCurrentWordDetail] = useState<GetWordDetailAPIResponseDto>(wordDetail);

  return <SynonymStack wordDetail={currentWordDetail} setMessage={setMessage} setWordDetail={setCurrentWordDetail} />;
};

// Mock data for stories
const mockWordDetailWithSynonyms: GetWordDetailAPIResponseDto = {
  ...initWordDetailResponseData,
  id: 1,
  name: 'happy',
  checked: false,
  synonym_original: [
    {
      word_id: 1,
      synonym_word_id: 2,
      synonym_word: {
        name: 'joyful'
      }
    },
    {
      word_id: 1,
      synonym_word_id: 3,
      synonym_word: {
        name: 'cheerful'
      }
    }
  ],
  synonym_word: [
    {
      word_id: 1,
      synonym_word_id: 4,
      synonym_original: {
        name: 'glad'
      }
    },
    {
      word_id: 1,
      synonym_word_id: 5,
      synonym_original: {
        name: 'pleased'
      }
    }
  ]
};

const mockWordDetailWithoutSynonyms: GetWordDetailAPIResponseDto = {
  ...initWordDetailResponseData,
  id: 2,
  name: 'test',
  checked: true,
  synonym_original: [],
  synonym_word: []
};

const mockWordDetailLoading: GetWordDetailAPIResponseDto = {
  ...initWordDetailResponseData,
  id: -1,
  name: '',
  checked: false,
  synonym_original: [],
  synonym_word: []
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WithSynonyms: Story = {
  args: {
    wordDetail: mockWordDetailWithSynonyms
  },
  render: (args) => <SynonymStackWithState wordDetail={args.wordDetail} />
};

export const WithoutSynonyms: Story = {
  args: {
    wordDetail: mockWordDetailWithoutSynonyms
  },
  render: (args) => <SynonymStackWithState wordDetail={args.wordDetail} />
};

export const Loading: Story = {
  args: {
    wordDetail: mockWordDetailLoading
  },
  render: (args) => <SynonymStackWithState wordDetail={args.wordDetail} />
};

export const ReadOnly: Story = {
  args: {
    wordDetail: mockWordDetailWithSynonyms
  },
  render: (args) => <SynonymStack wordDetail={args.wordDetail} />
};
