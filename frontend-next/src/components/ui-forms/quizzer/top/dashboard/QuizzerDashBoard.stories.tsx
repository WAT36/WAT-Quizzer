import type { Meta, StoryObj } from '@storybook/nextjs';
import { QuizzerDashboard } from './QuizzerDashBoard';
import React, { useState } from 'react';

// モックデータ（ファイル番号の選択肢）
const mockFileNums = [1, 2];

const QuizzerDashboardWithMock = () => {
  const [selectedFileNum, setSelectedFileNum] = useState<number>(1);
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="file-num-select">ファイル番号: </label>
        <select
          id="file-num-select"
          value={selectedFileNum}
          onChange={(e) => setSelectedFileNum(Number(e.target.value))}
          style={{ marginLeft: 8 }}
        >
          {mockFileNums.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <QuizzerDashboard selectedFileNum={selectedFileNum} />
    </div>
  );
};

const meta = {
  title: 'Organisms/Quizzer/Top/QuizzerDashboard',
  component: QuizzerDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof QuizzerDashboard>;

export default meta;

export const Mock: StoryObj = {
  render: () => <QuizzerDashboardWithMock />
};
