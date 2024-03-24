import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Templates/Layout',
  component: Layout,
  decorators: [(story) => <RecoilRoot>{story()} </RecoilRoot>],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quizzer: Story = {
  args: {
    title: 'Sample',
    contents: <div>{'ここに内容'}</div>,
    mode: 'quizzer'
  }
};

export const EnglishBot: Story = {
  args: {
    title: 'Sample',
    contents: <div>{'ここに内容'}</div>,
    mode: 'englishBot'
  }
};

export const Settings: Story = {
  args: {
    title: 'Sample',
    contents: <div>{'ここに内容'}</div>,
    mode: 'settings'
  }
};
