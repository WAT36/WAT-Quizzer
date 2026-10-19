import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryParentChildConfigSection } from './CategoryParentChildConfigSection';
import { useState } from 'react';
import type { Message, PullDownOptionDto } from 'quizzer-lib';

const mockFilelistoption: PullDownOptionDto[] = [
  { value: '1', label: '英単語ファイル' },
  { value: '2', label: '熟語ファイル' },
  { value: '3', label: '文法ファイル' }
];

const CategoryParentChildConfigSectionWrapper = () => {
  const [, setMessage] = useState<Message>({ message: '', messageColor: 'success.light', isDisplay: false });
  return (
    <CategoryParentChildConfigSection
      filelistoption={mockFilelistoption}
      setMessage={setMessage}
    />
  );
};

const meta = {
  title: 'Organisms/Quizzer/Settings/CategoryParentChildConfigSection',
  component: CategoryParentChildConfigSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CategoryParentChildConfigSection>;

export default meta;

export const Default: StoryObj = {
  render: () => <CategoryParentChildConfigSectionWrapper />
};
