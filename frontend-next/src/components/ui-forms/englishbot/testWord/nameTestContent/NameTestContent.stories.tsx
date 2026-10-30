import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecoilRoot } from 'recoil';
import { WORD_TEST_TYPE } from 'quizzer-lib';
import { NameTestContent } from './NameTestContent';
import { sampleWordTestData } from '../testWordStoryData';

const meta = {
  title: 'Molecules/EnglishBot/TestWord/NameTestContent',
  component: NameTestContent,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof NameTestContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    displayTestData: { ...sampleWordTestData, testType: String(WORD_TEST_TYPE.NAME) }
  }
};
