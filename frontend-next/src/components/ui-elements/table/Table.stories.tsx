import type { Meta, StoryObj } from '@storybook/nextjs';
import { Table } from './Table';
import type { ColumnDef } from '@tanstack/react-table';

// サンプルデータ型
interface Todo {
  id: number;
  todo: string;
  status: string;
  createdAt: string;
}

const meta = {
  title: 'ui-elements/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleTodos: Todo[] = [
  { id: 1, todo: '朝の運動をする', status: '未完了', createdAt: '2024-01-01' },
  { id: 2, todo: 'プロジェクトの進捗を確認する', status: '完了', createdAt: '2024-01-02' },
  { id: 3, todo: '新しい技術を学ぶ', status: '未完了', createdAt: '2024-01-03' },
  { id: 4, todo: 'コードレビューを完了する', status: '完了', createdAt: '2024-01-04' },
  { id: 5, todo: 'ドキュメントを更新する', status: '未完了', createdAt: '2024-01-05' }
];

// カラム定義
const todoColumns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'todo',
    header: 'Todo',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded ${
          info.getValue() === '完了' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {String(info.getValue())}
      </span>
    )
  },
  {
    accessorKey: 'createdAt',
    header: '作成日',
    cell: (info) => info.getValue()
  }
];

// 基本的なテーブル
export const Default: Story = {
  args: {
    data: sampleTodos,
    columns: todoColumns
  }
};

// ソート機能付き
export const WithSorting: Story = {
  args: {
    data: sampleTodos,
    columns: todoColumns,
    enableSorting: true
  }
};

// ページネーション付き
export const WithPagination: Story = {
  args: {
    data: sampleTodos,
    columns: todoColumns,
    enablePagination: true,
    pageSize: 3
  }
};

// 行選択機能付き
export const WithRowSelection: Story = {
  args: {
    data: sampleTodos,
    columns: todoColumns,
    enableRowSelection: true,
    onRowSelectionChange: (selectedRows) => {
      console.log('Selected rows:', selectedRows);
    }
  }
};

// 全ての機能を有効化
export const FullFeatures: Story = {
  args: {
    data: sampleTodos,
    columns: todoColumns,
    enableSorting: true,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: 3,
    onRowSelectionChange: (selectedRows) => {
      console.log('Selected rows:', selectedRows);
    }
  }
};

// 空のデータ
export const Empty: Story = {
  args: {
    data: [],
    columns: todoColumns
  }
};
