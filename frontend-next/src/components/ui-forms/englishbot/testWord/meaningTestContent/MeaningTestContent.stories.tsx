import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecoilRoot } from 'recoil';
import { WORD_TEST_TYPE } from 'quizzer-lib';
import { MeaningTestContent } from './MeaningTestContent';
import { sampleWordTestData } from '../testWordStoryData';

const meta = {
  title: 'Molecules/EnglishBot/TestWord/MeaningTestContent',
  component: MeaningTestContent,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof MeaningTestContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    displayTestData: { ...sampleWordTestData, testType: String(WORD_TEST_TYPE.MEANING) }
  }
};
