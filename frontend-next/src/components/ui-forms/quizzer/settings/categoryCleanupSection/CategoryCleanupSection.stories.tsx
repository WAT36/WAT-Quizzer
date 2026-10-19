import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryCleanupSection } from './CategoryCleanupSection';
import { useState } from 'react';
import type { Message } from 'quizzer-lib';

const CategoryCleanupSectionWrapper = () => {
  const [, setMessage] = useState<Message>({ message: '', messageColor: 'success.light', isDisplay: false });
  return <CategoryCleanupSection setMessage={setMessage} />;
};

const meta = {
  title: 'Organisms/Quizzer/Settings/CategoryCleanupSection',
  component: CategoryCleanupSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CategoryCleanupSection>;

export default meta;

export const Default: StoryObj = {
  render: () => <CategoryCleanupSectionWrapper />
};
