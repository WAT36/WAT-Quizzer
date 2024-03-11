import type { Meta, StoryObj } from '@storybook/react';
import { SearchResultTable } from './SearchResultTable';

const meta = {
  title: 'Atom/SearchResultTable',
  component: SearchResultTable,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SearchResultTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const main: Story = {
  args: {
    searchResult: [
      { id: 1, name: '佐藤太郎', point: 50 },
      { id: 2, name: '鈴木二郎', point: 60 },
      { id: 3, name: '高橋三郎', point: 70 }
    ],
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        sortable: true,
        width: 100
      },
      {
        field: 'name',
        headerName: '名前',
        sortable: true,
        width: 300
      },

      {
        field: 'point',
        headerName: '得点',
        sortable: true,
        width: 100
      }
    ]
  }
};
