import type { SearchQuizAPIRequestDto } from 'quizzer-lib';
import { searchQuizRequestDataSchema } from 'quizzer-lib';

// 問題検索画面の検索条件を保存するsessionStorageのキー
export const SEARCH_QUIZ_STORAGE_KEY = 'searchQuizRequestData';

// 旧形式（category: 単一の文字列）で保存された検索条件を、AND条件に変換する
const migrateLegacyCategory = (saved: unknown): unknown => {
  if (typeof saved !== 'object' || saved === null) return saved;
  const { category, ...rest } = saved as Record<string, unknown>;
  return {
    ...rest,
    category_and:
      rest.category_and ?? (typeof category === 'string' && category !== '-1' && category ? [category] : []),
    category_not: rest.category_not ?? []
  };
};

// sessionStorageに保存された検索条件を読み込む
// 保存されていない・JSONでない・検索条件の形でない場合はundefined（初期状態のまま）
export const loadSavedSearchQuizRequestData = (): SearchQuizAPIRequestDto | undefined => {
  let saved: string | null;
  let json: unknown;
  try {
    saved = sessionStorage.getItem(SEARCH_QUIZ_STORAGE_KEY);
    if (!saved) return undefined;
    json = JSON.parse(saved);
  } catch {
    return undefined;
  }
  const result = searchQuizRequestDataSchema.safeParse(migrateLegacyCategory(json));
  return result.success ? result.data : undefined;
};
