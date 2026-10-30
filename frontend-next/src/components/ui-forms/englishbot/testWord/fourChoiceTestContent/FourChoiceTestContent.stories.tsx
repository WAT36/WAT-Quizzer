import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecoilRoot } from 'recoil';
import { WORD_TEST_TYPE } from 'quizzer-lib';
import { FourChoiceTestContent } from './FourChoiceTestContent';
import { sampleWordTestData } from '../testWordStoryData';

const meta = {
  title: 'Molecules/EnglishBot/TestWord/FourChoiceTestContent',
  component: FourChoiceTestContent,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof FourChoiceTestContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    displayTestData: { ...sampleWordTestData, testType: String(WORD_TEST_TYPE.FOUR_CHOICE) }
  }
};
