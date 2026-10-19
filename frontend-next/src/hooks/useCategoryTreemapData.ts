import { useState } from 'react';
import type { CategoryParentChildAPIResponseDto, CategoryQuizCountDto } from 'quizzer-lib';
import { getCategoryQuizCountAPI, getCategoryParentChildListAPI } from '@/utils/api-wrapper';

const COLORS_LENGTH = 10;

export interface CategoryTreemapItem {
  name: string;
  size?: number;
  _colorIndex?: number;
  children?: ReadonlyArray<CategoryTreemapItem>;
  [key: string]: unknown;
}

const buildTreemapData = (
  categories: CategoryQuizCountDto[],
  parentChild: CategoryParentChildAPIResponseDto[]
): CategoryTreemapItem[] => {
  const countMap = new Map<number, number>();
  const nameMap = new Map<number, string>();
  for (const cat of categories) {
    countMap.set(cat.id, cat.count);
    nameMap.set(cat.id, cat.name);
  }

  const parentToChildren = new Map<number, number[]>();
  const childSet = new Set<number>();
  for (const rel of parentChild) {
    if (!parentToChildren.has(rel.parent_category_id)) {
      parentToChildren.set(rel.parent_category_id, []);
    }
    parentToChildren.get(rel.parent_category_id)!.push(rel.child_category_id);
    childSet.add(rel.child_category_id);
  }

  const buildNode = (catId: number, colorIndex: number): CategoryTreemapItem | null => {
    const count = countMap.get(catId) ?? 0;
    if (count === 0) return null;

    const name = nameMap.get(catId) ?? '';
    const childIds = parentToChildren.get(catId) ?? [];

    if (childIds.length === 0) {
      return { name, size: count, _colorIndex: colorIndex };
    }

    const children: CategoryTreemapItem[] = [];
    let childrenTotalCount = 0;

    for (const childId of childIds) {
      const childCount = countMap.get(childId) ?? 0;
      const childNode = buildNode(childId, colorIndex);
      if (childNode) {
        children.push(childNode);
        childrenTotalCount += childCount;
      }
    }

    const exclusiveCount = count - childrenTotalCount;
    if (exclusiveCount > 0) {
      children.push({ name: `${name}（直接）`, size: exclusiveCount, _colorIndex: colorIndex });
    }

    if (children.length === 0) {
      return { name, size: count, _colorIndex: colorIndex };
    }

    return { name, children, _colorIndex: colorIndex };
  };

  const result: CategoryTreemapItem[] = [];
  const rootCategories = categories.filter((cat) => !childSet.has(cat.id));

  for (let i = 0; i < rootCategories.length; i++) {
    const node = buildNode(rootCategories[i].id, i % COLORS_LENGTH);
    if (node) result.push(node);
  }

  return result;
};

export const useCategoryTreemapData = () => {
  const [treemapData, setTreemapData] = useState<CategoryTreemapItem[]>([]);

  const fetchTreemapData = async (file_num: number) => {
    if (file_num === -1) return;

    const [countResult, parentChildResult] = await Promise.all([
      getCategoryQuizCountAPI({ getCategoryQuizCountData: { file_num } }),
      getCategoryParentChildListAPI({ getCategoryParentChildListData: { file_num } })
    ]);

    const categories = (countResult.result as CategoryQuizCountDto[] | undefined) ?? [];
    const parentChild = (parentChildResult.result as CategoryParentChildAPIResponseDto[] | undefined) ?? [];

    setTreemapData(buildTreemapData(categories, parentChild));
  };

  return { treemapData, fetchTreemapData };
};
