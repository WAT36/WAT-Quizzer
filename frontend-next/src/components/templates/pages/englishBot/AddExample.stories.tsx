import type { Meta, StoryObj } from '@storybook/react';
import EnglishBotAddExamplePage from '../../../../pages/englishBot/addExample';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Templates/EnglishBot/AddExample',
  component: EnglishBotAddExamplePage,
  decorators: [(story) => <RecoilRoot>{story()} </RecoilRoot>],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EnglishBotAddExamplePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: { isMock: true }
};
