import React, { useEffect, useState } from 'react';
import { CardContent, CardHeader } from '@mui/material';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui-elements/button/Button';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import type { PullDownOptionDto, Message, CategoryParentChildAPIResponseDto, CategoryQuizCountDto } from 'quizzer-lib';
import {
  getCategoryListAPI,
  getCategoryParentChildListAPI,
  getCategoryQuizCountAPI,
  addCategoryParentChildAPI,
  deleteCategoryParentChildAPI,
} from '@/utils/api-wrapper';

const CategoryTreeGraph = dynamic(
  () => import('./CategoryTreeGraph').then((mod) => mod.CategoryTreeGraph),
  { ssr: false, loading: () => <p className="text-gray-400 dark:text-gray-500 text-sm">グラフを読み込み中...</p> }
);

interface CategoryParentChildSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const CategoryParentChildSection = ({
  filelistoption,
  setMessage,
}: CategoryParentChildSectionProps) => {
  const [fileNum, setFileNum] = useState<number>(-1);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [parentChildList, setParentChildList] = useState<CategoryParentChildAPIResponseDto[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryQuizCountDto[]>([]);
  const [parentCategory, setParentCategory] = useState<string>('');
  const [childCategory, setChildCategory] = useState<string>('');

  const fetchCategories = async (file_num: number) => {
    const result = await getCategoryListAPI({ getCategoryListData: { file_num: String(file_num) } });
    if (result.result) {
      setCategoryNames((result.result as { category: string }[]).map((c) => c.category));
    } else {
      setCategoryNames([]);
    }
  };

  const fetchParentChildList = async (file_num: number) => {
    const result = await getCategoryParentChildListAPI({
      getCategoryParentChildListData: { file_num },
    });
    if (result.result) {
      setParentChildList(result.result as CategoryParentChildAPIResponseDto[]);
    } else {
      setParentChildList([]);
    }
  };

  const fetchCategoryCounts = async (file_num: number) => {
    const result = await getCategoryQuizCountAPI({ getCategoryQuizCountData: { file_num } });
    if (result.result) {
      setCategoryCounts(result.result as CategoryQuizCountDto[]);
    } else {
      setCategoryCounts([]);
    }
  };

  useEffect(() => {
    if (fileNum === -1) {
      // ファイル未選択時にAPIから取得した一覧をクリアするため、effect内でstateを更新する
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryNames([]);
      setParentChildList([]);
      setCategoryCounts([]);
      return;
    }
    void fetchCategories(fileNum);
    void fetchParentChildList(fileNum);
    void fetchCategoryCounts(fileNum);
  }, [fileNum]);

  const categoryPullDownOptions: PullDownOptionDto[] = categoryNames.map((name) => ({
    value: name,
    label: name,
  }));

  // 選択解除時はPullDownから-1が渡されるため、未選択（空文字）として扱う
  const toCategory = (value: number | string) => (value === -1 ? '' : String(value));

  const handleAdd = async () => {
    if (fileNum === -1) {
      setMessage({ message: 'エラー:問題ファイルを選択して下さい', messageColor: 'error', isDisplay: true });
      return;
    }
    if (!parentCategory || !childCategory) {
      setMessage({ message: 'エラー:親カテゴリと子カテゴリを選択して下さい', messageColor: 'error', isDisplay: true });
      return;
    }
    if (parentCategory === childCategory) {
      setMessage({ message: 'エラー:親カテゴリと子カテゴリに同じカテゴリは設定できません', messageColor: 'error', isDisplay: true });
      return;
    }
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
    const result = await addCategoryParentChildAPI({
      addCategoryParentChildData: {
        file_num: fileNum,
        parent_category: parentCategory,
        child_category: childCategory,
      },
    });
    setMessage(result.message);
    if (result.isSuccess) {
      void fetchParentChildList(fileNum);
    }
  };

  const handleDelete = async (id: number) => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
    const result = await deleteCategoryParentChildAPI({
      deleteCategoryParentChildData: { id },
    });
    setMessage(result.message);
    if (result.isSuccess) {
      setParentChildList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <>
      <CardHeader subheader="ファイル選択" />
      <CardContent>
        <PullDown
          optionList={filelistoption}
          onChange={(e) => {
            setFileNum(+e.target.value);
            setParentCategory('');
            setChildCategory('');
          }}
        />
      </CardContent>

      {fileNum !== -1 && (
        <>
          <CardHeader subheader="親子関係追加" />
          <CardContent className="flex items-center gap-2 flex-wrap">
            <PullDown
              label="親カテゴリ"
              searchable
              optionList={categoryPullDownOptions}
              value={parentCategory}
              onChange={(e) => setParentCategory(toCategory(e.target.value))}
            />
            <PullDown
              label="子カテゴリ"
              searchable
              optionList={categoryPullDownOptions}
              value={childCategory}
              onChange={(e) => setChildCategory(toCategory(e.target.value))}
            />
            <Button label="追加" variant="contained" attr="after-inline" onClick={handleAdd} />
          </CardContent>

          <CardHeader subheader="登録済み親子関係" />
          <CardContent>
            <CategoryTreeGraph
              parentChildList={parentChildList}
              categoryCounts={categoryCounts}
              onDelete={handleDelete}
            />
          </CardContent>
        </>
      )}
    </>
  );
};
