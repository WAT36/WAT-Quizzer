import type { Meta, StoryObj } from '@storybook/nextjs';
import { DisplayAccuracyChart } from './DisplayAccuracyChart';
import { AccuracyGraphFormProvider } from '@/contexts/AccuracyGraphFormContext';
import type { GetCategoryRateAPIRequestDto } from 'quizzer-lib';

const meta = {
  title: 'Organisms/Quizzer/AccuracyRateGraph/DisplayAccuracyChart',
  component: DisplayAccuracyChart,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof DisplayAccuracyChart>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockAccuracyData = {
  result: [
    { file_num: 1, category: '英単語', count: 10, accuracy_rate: 0.8 },
    { file_num: 1, category: '熟語', count: 8, accuracy_rate: 0.6 },
    { file_num: 1, category: '文法', count: 12, accuracy_rate: 0.9 }
  ],
  checked_result: [],
  all_result: []
};

export const BarChart: Story = {
  args: {
    accuracyData: mockAccuracyData
  },
  decorators: [
    (Story) => (
      <AccuracyGraphFormProvider
        defaultValue={{
          graph: 'Bar',
          order: 'Rate',
          getCategoryRateData: { file_num: -1 } as GetCategoryRateAPIRequestDto
        }}
      >
        <Story />
      </AccuracyGraphFormProvider>
    )
  ]
};

export const RadarChart: Story = {
  args: {
    accuracyData: mockAccuracyData
  },
  decorators: [
    (Story) => (
      <AccuracyGraphFormProvider
        defaultValue={{
          graph: 'Radar',
          order: 'Rate',
          getCategoryRateData: { file_num: -1 } as GetCategoryRateAPIRequestDto
        }}
      >
        <Story />
      </AccuracyGraphFormProvider>
    )
  ]
};
