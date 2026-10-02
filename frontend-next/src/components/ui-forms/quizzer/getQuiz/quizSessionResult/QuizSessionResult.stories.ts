import type { Meta, StoryObj } from '@storybook/nextjs';

import { QuizSessionResult } from './QuizSessionResult';
import { initGetQuizResponseData } from 'quizzer-lib';
import type { QuizAnswerResult } from '@/hooks/quizSession/reducer';

// カテゴリ名の配列と正誤から、1問分の解答結果を作る
const answer = (id: number, categories: string[], isCorrect: boolean): QuizAnswerResult => ({
  quiz: {
    ...initGetQuizResponseData,
    id,
    quiz_num: id,
    quiz_category: categories.map((category) => ({ category }))
  },
  isCorrect
});

const meta = {
  title: 'Organisms/Quizzer/GetQuiz/QuizSessionResult',
  component: QuizSessionResult,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof QuizSessionResult>;

export default meta;
type Story = StoryObj<typeof meta>;

// 得意（コンピューティング）と苦手（SQL・データベース）が両方ある例。正規化・JavaScriptは1問のみなので判定対象外
export const WithStrongAndWeak: Story = {
  args: {
    results: [
      answer(1, ['AWS', 'コンピューティング'], true),
      answer(2, ['AWS', 'コンピューティング'], true),
      answer(3, ['AWS', 'ストレージ'], true),
      answer(4, ['AWS', 'ストレージ'], false),
      answer(5, ['データベース', 'SQL'], false),
      answer(6, ['データベース', 'SQL'], false),
      answer(7, ['データベース', '正規化'], true),
      answer(8, ['JavaScript'], true)
    ]
  }
};

// 10問出題予定のところ、4問解答した時点で途中終了した例
export const FinishedEarly: Story = {
  args: {
    totalCount: 10,
    results: [
      answer(1, ['AWS', 'コンピューティング'], true),
      answer(2, ['AWS', 'コンピューティング'], true),
      answer(3, ['データベース', 'SQL'], false),
      answer(4, ['データベース', 'SQL'], false)
    ]
  }
};

// カテゴリが付いた問題がない例
export const WithoutCategory: Story = {
  args: {
    results: [answer(1, [], true), answer(2, [], false), answer(3, [], true)]
  }
};
