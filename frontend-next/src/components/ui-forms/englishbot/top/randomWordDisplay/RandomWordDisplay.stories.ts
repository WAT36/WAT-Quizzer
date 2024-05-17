import type { Meta, StoryObj } from '@storybook/react';
import { RandomWordDisplay } from './RandomWordDisplay';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/Top/RandomWordDisplay',
  component: RandomWordDisplay,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof RandomWordDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    wordData: {
      id: 1,
      name: 'test',
      pronounce: '',
      mean: [
        {
          meaning: '意味１',
          partsofspeech: {
            name: '品詞１'
          }
        },
        {
          meaning: '意味２',
          partsofspeech: {
            name: '品詞２'
          }
        }
      ],
      word_source: [
        {
          source: {
            name: '出典１'
          }
        }
      ]
    }
  }
};
