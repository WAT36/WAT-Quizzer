import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryTreeGraph } from './CategoryTreeGraph';
import { CategoryParentChildAPIResponseDto, CategoryQuizCountDto } from 'quizzer-lib';
import { fn } from 'storybook/test';

const mockParentChildList: CategoryParentChildAPIResponseDto[] = [
  { id: 1, parent_category_id: 1, parent_category_name: '文法', child_category_id: 2, child_category_name: '動詞' },
  { id: 2, parent_category_id: 1, parent_category_name: '文法', child_category_id: 3, child_category_name: '名詞' },
  { id: 3, parent_category_id: 2, parent_category_name: '動詞', child_category_id: 4, child_category_name: '自動詞' },
  { id: 4, parent_category_id: 2, parent_category_name: '動詞', child_category_id: 5, child_category_name: '他動詞' },
  { id: 5, parent_category_id: 6, parent_category_name: '語彙', child_category_id: 7, child_category_name: '基礎単語' },
  { id: 6, parent_category_id: 6, parent_category_name: '語彙', child_category_id: 8, child_category_name: '上級単語' }
];

const mockCategoryCounts: CategoryQuizCountDto[] = [
  { id: 1, name: '文法', count: 0 },
  { id: 2, name: '動詞', count: 5 },
  { id: 3, name: '名詞', count: 8 },
  { id: 4, name: '自動詞', count: 3 },
  { id: 5, name: '他動詞', count: 2 },
  { id: 6, name: '語彙', count: 0 },
  { id: 7, name: '基礎単語', count: 12 },
  { id: 8, name: '上級単語', count: 4 }
];

const meta = {
  title: 'Organisms/Quizzer/Settings/CategoryTreeGraph',
  component: CategoryTreeGraph,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CategoryTreeGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    parentChildList: mockParentChildList,
    categoryCounts: mockCategoryCounts,
    onDelete: fn()
  }
};

export const Empty: Story = {
  args: {
    parentChildList: [],
    onDelete: fn()
  }
};
