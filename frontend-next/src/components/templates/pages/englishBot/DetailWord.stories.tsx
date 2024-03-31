import type { Meta, StoryObj } from '@storybook/react';
import EnglishBotEachWordPage from '../../../../pages/englishBot/detailWord/[id]';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Templates/EnglishBot/DetailWord',
  component: EnglishBotEachWordPage,
  decorators: [(story) => <RecoilRoot>{story()} </RecoilRoot>],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EnglishBotEachWordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: { id: '1', isMock: true }
};
