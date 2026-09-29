import type { QuizAnswerResult } from './reducer';

// 得意カテゴリとする正解率(%)の下限
export const STRONG_CATEGORY_MIN_RATE = 80;
// 苦手カテゴリとする正解率(%)の上限（この値未満）
export const WEAK_CATEGORY_MAX_RATE = 50;
// 得意・苦手の判定対象とする最低出題数（1問だけだと正解率が0%か100%に振れるため）
export const CATEGORY_JUDGE_MIN_COUNT = 2;

export interface CategoryAnalysis {
  category: string;
  total: number;
  correct: number;
  accuracyRate: number;
}

export interface QuizSessionAnalysis {
  total: number;
  correct: number;
  accuracyRate: number;
  // 正解率の高い順（同率なら出題数の多い順）
  categories: CategoryAnalysis[];
  strongCategories: CategoryAnalysis[];
  weakCategories: CategoryAnalysis[];
}

const toRate = (correct: number, total: number) => (total > 0 ? (correct / total) * 100 : 0);

// 出題セッションの解答結果から、全体の正解率とカテゴリごとの成績・得意/苦手カテゴリを集計する
// 1問に複数カテゴリが付いている場合は、それぞれのカテゴリで1問として数える
export const analyzeQuizSession = (results: QuizAnswerResult[]): QuizSessionAnalysis => {
  const total = results.length;
  const correct = results.filter((r) => r.isCorrect).length;

  const categoryMap = new Map<string, { total: number; correct: number }>();
  results.forEach(({ quiz, isCorrect }) => {
    const names = new Set((quiz.quiz_category ?? []).map((c) => c.category).filter((name) => !!name));
    names.forEach((name) => {
      const current = categoryMap.get(name) ?? { total: 0, correct: 0 };
      categoryMap.set(name, { total: current.total + 1, correct: current.correct + (isCorrect ? 1 : 0) });
    });
  });

  const categories = Array.from(categoryMap.entries())
    .map(([category, v]) => ({ category, ...v, accuracyRate: toRate(v.correct, v.total) }))
    .sort((a, b) => b.accuracyRate - a.accuracyRate || b.total - a.total);

  const judgeTargets = categories.filter((c) => c.total >= CATEGORY_JUDGE_MIN_COUNT);

  return {
    total,
    correct,
    accuracyRate: toRate(correct, total),
    categories,
    strongCategories: judgeTargets.filter((c) => c.accuracyRate >= STRONG_CATEGORY_MIN_RATE),
    // 苦手は正解率の低い順に並べる
    weakCategories: judgeTargets.filter((c) => c.accuracyRate < WEAK_CATEGORY_MAX_RATE).reverse()
  };
};
