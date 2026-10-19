import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecoilRoot } from 'recoil';
import { AccuracyGraphFormProvider } from '@/contexts/AccuracyGraphFormContext';
import type { GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { AccuracyRateGraphContent } from './AccuracyRateGraphContent';

const meta = {
  title: 'Organisms/Quizzer/AccuracyRateGraph/AccuracyRateGraphContent',
  component: AccuracyRateGraphContent,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof AccuracyRateGraphContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Bar: Story = {
  args: {},
  decorators: [
    (Story) => (
      <RecoilRoot>
        <AccuracyGraphFormProvider
          defaultValue={{
            graph: 'Bar',
            order: 'Rate',
            getCategoryRateData: { file_num: -1 } as GetCategoryRateAPIRequestDto
          }}
        >
          <Story />
        </AccuracyGraphFormProvider>
      </RecoilRoot>
    )
  ]
};

export const Radar: Story = {
  args: {},
  decorators: [
    (Story) => (
      <RecoilRoot>
        <AccuracyGraphFormProvider
          defaultValue={{
            graph: 'Radar',
            order: 'Rate',
            getCategoryRateData: { file_num: -1 } as GetCategoryRateAPIRequestDto
          }}
        >
          <Story />
        </AccuracyGraphFormProvider>
      </RecoilRoot>
    )
  ]
};
