import type { CategoryParentChildAPIResponseDto } from 'quizzer-lib';
import { getCategoryParentChildListAPI } from './api-wrapper';

// カテゴリの祖先カテゴリ名を再帰的に収集する（重複なし、祖先→親の順）
const getAncestorCategoryNames = (
  categoryName: string,
  parentChildList: CategoryParentChildAPIResponseDto[]
): string[] => {
  const parents = parentChildList
    .filter((pc) => pc.child_category_name === categoryName)
    .map((pc) => pc.parent_category_name);
  const ancestors: string[] = [];
  for (const parent of parents) {
    const grandAncestors = getAncestorCategoryNames(parent, parentChildList);
    for (const g of grandAncestors) {
      if (!ancestors.includes(g)) ancestors.push(g);
    }
    if (!ancestors.includes(parent)) ancestors.push(parent);
  }
  return ancestors;
};

/**
 * カテゴリ名のリストを、各カテゴリの祖先カテゴリも含めて展開して返す。
 * 返却順は [祖先カテゴリ群..., 元のカテゴリ群...] となる。
 * 親子関係の取得に失敗した場合は元のリストをそのまま返す。
 */
export const expandCategoriesWithAncestors = async (
  categories: string[],
  fileNum: number
): Promise<string[]> => {
  try {
    const result = await getCategoryParentChildListAPI({
      getCategoryParentChildListData: { file_num: fileNum }
    });
    if (!result.result) return categories;

    const parentChildList = result.result as CategoryParentChildAPIResponseDto[];
    const ancestors: string[] = [];
    for (const category of categories) {
      for (const ancestor of getAncestorCategoryNames(category, parentChildList)) {
        if (!ancestors.includes(ancestor)) ancestors.push(ancestor);
      }
    }
    const expanded = [...ancestors];
    for (const category of categories) {
      if (!expanded.includes(category)) expanded.push(category);
    }
    return expanded;
  } catch (e) {
    return categories;
  }
};
