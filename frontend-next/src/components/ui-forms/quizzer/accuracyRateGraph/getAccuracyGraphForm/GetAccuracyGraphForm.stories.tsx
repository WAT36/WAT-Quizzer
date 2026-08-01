import type { Meta, StoryObj } from '@storybook/nextjs';
import { GetAccuracyGraphForm } from './GetAccuracyGraphForm';
import { AccuracyGraphFormProvider } from '@/contexts/AccuracyGraphFormContext';
import { GetCategoryRateAPIRequestDto } from 'quizzer-lib';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/AccuracyChart/GetAccuracyGraphForm',
  component: GetAccuracyGraphForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
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
} satisfies Meta<typeof GetAccuracyGraphForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    setAccuracyData: undefined
  }
};
