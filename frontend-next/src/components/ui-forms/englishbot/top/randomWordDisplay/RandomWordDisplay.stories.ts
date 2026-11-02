import type { Meta, StoryObj } from '@storybook/nextjs';
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

// api-wrapper.ts の NEXT_PUBLIC_MOCK_MODE=true 設定（.storybook/main.ts）により
// getRandomWordAPI は自動的にモックデータへ差し替わる
export const Main: Story = {};
