import type { Meta, StoryObj } from '@storybook/nextjs';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import React, { useState } from 'react';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Molecules/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checkboxProps: [
      { value: 'a', label: 'チェックA' },
      { value: 'b', label: 'チェックB' },
      { value: 'c', label: 'チェックC', disabled: true }
    ],
    label: 'チェックボックスグループ'
  }
};

export const WithState: Story = {
  // linterエラー回避のため、React.FCで定義
  render: function WithStateStory(args) {
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
    const handleChange = (value: string, checked: boolean) => {
      setCheckedState((prev) => ({ ...prev, [value]: checked }));
    };
    return (
      <>
        <CheckboxGroup {...args} onChange={handleChange} />
        <div style={{ marginTop: 16 }}>
          <strong>現在の状態:</strong> {JSON.stringify(checkedState)}
        </div>
      </>
    );
  },
  args: {
    checkboxProps: [
      { value: 'a', label: 'チェックA' },
      { value: 'b', label: 'チェックB', defaultChecked: true },
      { value: 'c', label: 'チェックC', disabled: true }
    ],
    label: '状態管理付き'
  }
};
