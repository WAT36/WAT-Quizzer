import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryParentChildSection } from './CategoryParentChildSection';
import { useState } from 'react';
import type { Message, PullDownOptionDto } from 'quizzer-lib';

const mockFilelistoption: PullDownOptionDto[] = [
  { value: '1', label: '英単語ファイル' },
  { value: '2', label: '熟語ファイル' },
  { value: '3', label: '文法ファイル' }
];

const CategoryParentChildSectionWrapper = () => {
  const [, setMessage] = useState<Message>({ message: '', messageColor: 'success.light', isDisplay: false });
  return (
    <CategoryParentChildSection
      filelistoption={mockFilelistoption}
      setMessage={setMessage}
    />
  );
};

const meta = {
  title: 'Organisms/Quizzer/Settings/CategoryParentChildSection',
  component: CategoryParentChildSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CategoryParentChildSection>;

export default meta;

export const Default: StoryObj = {
  render: () => <CategoryParentChildSectionWrapper />
};
