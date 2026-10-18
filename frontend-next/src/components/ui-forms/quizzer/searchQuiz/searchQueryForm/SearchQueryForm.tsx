import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, FormGroup, TextField as MuiTextField } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import {
  GetQuizApiResponseDto,
  initSearchQuizRequestData,
  PullDownOptionDto,
  SearchQuizAPIRequestDto,
  SEARCH_LIMITS
} from 'quizzer-lib';
import { searchQuizAPI } from '@/utils/api-wrapper';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import { GridRowsProp } from '@mui/x-data-grid';
import { CheckboxGroup } from '@/components/ui-parts/checkboxGroup/CheckboxGroup';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';
import { useSelectedFileChange } from '@/hooks/useSelectedFileChange';
import { getCategoryListOptions } from '@/utils/getCategoryListOptions';
import { CategoryConditionInput } from '@/components/ui-parts/categoryConditionInput/CategoryConditionInput';

// カテゴリ条件のキー（AND:すべて含む / NOT:含まない）
const CATEGORY_CONDITION_KEYS = ['category_and', 'category_not'] as const;
type CategoryConditionKey = (typeof CATEGORY_CONDITION_KEYS)[number];

// 旧形式（category: 単一の文字列）で保存された検索条件を、AND条件に変換する
const migrateSavedSearchQuizRequestData = (
  saved: SearchQuizAPIRequestDto & { category?: string }
): SearchQuizAPIRequestDto => {
  const { category, ...rest } = saved;
  return {
    ...rest,
    category_and: rest.category_and ?? (category && category !== '-1' ? [category] : []),
    category_not: rest.category_not ?? []
  };
};

const toSearchResultRows = (quizzes: GetQuizApiResponseDto[]) =>
  quizzes.map((x) => {
    return {
      ...x,
      category: x.quiz_category
        ? x.quiz_category
            .filter((x) => !x.deleted_at)
            .map((x) => x.category)
            .join(',')
        : '',
      format_name: x.quiz_format ? x.quiz_format.name.replace('問題', '') : '',
      accuracy_rate: x.quiz_statistics_view ? +x.quiz_statistics_view.accuracy_rate : NaN,
      explanation: x.quiz_explanation?.explanation ?? ''
    };
  });

interface SearchQueryFormProps {
  setSearchResult: React.Dispatch<React.SetStateAction<GridRowsProp>>;
  setTotalCount: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const SearchQueryForm = ({ setSearchResult, setTotalCount }: SearchQueryFormProps) => {
  const [searchQuizRequestData, setSearchQuizRequestData] =
    useState<SearchQuizAPIRequestDto>(initSearchQuizRequestData);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const { quizFormatListoption } = useQuizFormatList();
  const setMessage = useSetRecoilState(messageState);
  // sessionStorageからの復元が済んだか（済む前に初期値で上書き保存しないため）
  const [isRestored, setIsRestored] = useState(false);

  // セッションストレージキー
  const STORAGE_KEY = 'searchQuizRequestData';

  const runSearch = useCallback(
    async (requestData: SearchQuizAPIRequestDto) => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await searchQuizAPI({ searchQuizRequestData: requestData });
      setMessage(result.message);
      setTotalCount(result.total);
      if (result.result) {
        setSearchResult(toSearchResultRows(result.result as GetQuizApiResponseDto[]));
      }
    },
    [setMessage, setSearchResult, setTotalCount]
  );

  // 初期化・復元・自動検索
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    setIsRestored(true);
    if (saved) {
      try {
        const parsed = migrateSavedSearchQuizRequestData(JSON.parse(saved));
        setSearchQuizRequestData(parsed);
        // file_numが有効な場合のみカテゴリリストも取得
        if (parsed.file_num !== -1) {
          (async () => {
            const { pullDownOption } = await getCategoryListOptions(String(parsed.file_num));
            setCategorylistoption(pullDownOption);
          })();

          // 自動検索
          runSearch(parsed);
        }
      } catch (e) {
        // パース失敗時は何もしない
      }
    }
  }, [runSearch]);

  // 検索条件が変わったらsessionStorageに保存（ファイル選択など、どの入力経路からの変更も漏らさないよう一箇所で行う）
  useEffect(() => {
    if (!isRestored) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchQuizRequestData));
  }, [isRestored, searchQuizRequestData]);

  // カテゴリリストが更新されたとき、リストに含まれないカテゴリを各条件から取り除く
  useEffect(() => {
    if (categorylistoption.length > 0) {
      const categoryNames = new Set(categorylistoption.map((opt) => String(opt.value)));
      setSearchQuizRequestData((prev) => {
        const filtered = CATEGORY_CONDITION_KEYS.reduce(
          (acc, key) => ({ ...acc, [key]: (prev[key] ?? []).filter((c) => categoryNames.has(c)) }),
          {} as Pick<SearchQuizAPIRequestDto, CategoryConditionKey>
        );
        return {
          ...prev,
          ...filtered,
          // AND条件が無くなったらonlyDirectCategoryも解除
          onlyDirectCategory: filtered.category_and?.length ? prev.onlyDirectCategory : false
        };
      });
    }
  }, [categorylistoption]);

  const hasAndCategory = (searchQuizRequestData.category_and ?? []).length > 0;

  return (
    <>
      <FormGroup>
        <QuizFilePullDown
          onFileChange={useSelectedFileChange({ setMessage, setCategorylistoption, setSearchQuizRequestData })}
          value={String(searchQuizRequestData.file_num)}
        />
        <FormControl>
          <TextField
            label="検索語句"
            value={searchQuizRequestData.query}
            setStater={(value: string) => {
              const setData = {
                ...searchQuizRequestData,
                query: value
              };
              setSearchQuizRequestData(setData);
            }}
          />
        </FormControl>

        <FormGroup row>
          <span style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>検索対象：</span>
          <Checkbox
            value=""
            label="問題"
            checked={!!searchQuizRequestData.searchInOnlySentense}
            onChange={(e) => {
              const setData = {
                ...searchQuizRequestData,
                searchInOnlySentense: e.target.checked
              };
              setSearchQuizRequestData(setData);
            }}
            name="checkedA"
          />
          <Checkbox
            value=""
            label="答え"
            checked={!!searchQuizRequestData.searchInOnlyAnswer}
            onChange={(e) => {
              const setData = {
                ...searchQuizRequestData,
                searchInOnlyAnswer: e.target.checked
              };
              setSearchQuizRequestData(setData);
            }}
            name="checkedB"
          />
          <Checkbox
            value=""
            label="解説"
            checked={!!searchQuizRequestData.searchInExplanation}
            onChange={(e) => {
              const setData = {
                ...searchQuizRequestData,
                searchInExplanation: e.target.checked
              };
              setSearchQuizRequestData(setData);
            }}
            name="checkedC"
          />
        </FormGroup>

        <CategoryConditionInput
          label="カテゴリ"
          optionList={categorylistoption}
          value={searchQuizRequestData}
          onChange={(categoryConditions) => {
            setSearchQuizRequestData((prev) => ({
              ...prev,
              ...categoryConditions,
              // AND条件が無くなったらonlyDirectCategoryも解除
              ...(categoryConditions.category_and.length === 0 && { onlyDirectCategory: false })
            }));
          }}
        />
        <Checkbox
          value="only-direct-category"
          label="子カテゴリ未登録のみ（ANDのカテゴリのみ持つ問題）"
          checked={!!searchQuizRequestData.onlyDirectCategory}
          disabled={!hasAndCategory}
          onChange={(e) => {
            const setData = {
              ...searchQuizRequestData,
              onlyDirectCategory: e.target.checked
            };
            setSearchQuizRequestData(setData);
          }}
        />

        <FormControl>
          <RangeSliderSection
            sectionTitle={'正解率(%)指定'}
            value={
              typeof searchQuizRequestData.min_rate === 'number' && typeof searchQuizRequestData.max_rate === 'number'
                ? [searchQuizRequestData.min_rate, searchQuizRequestData.max_rate]
                : [0, 100]
            }
            setStater={(value: number[] | number) => {
              const setData = {
                ...searchQuizRequestData,
                min_rate: Array.isArray(value) ? value[0] : value,
                max_rate: Array.isArray(value) ? value[1] : value
              };
              setSearchQuizRequestData(setData);
            }}
          />
        </FormControl>

        <FormControl className="!block">
          <div className="flex flex-row items-start gap-4 flex-nowrap">
            <div className="flex-shrink-0 !inline-flex">
              <CheckboxGroup
                checkboxProps={quizFormatListoption.map((x) => {
                  return {
                    value: String(x.id),
                    label: x.name,
                    checked: !!(searchQuizRequestData.format_id && searchQuizRequestData.format_id[String(x.id)])
                  };
                })}
                setQueryofQuizStater={(checkBoxValue, checked) => {
                  const setData = {
                    ...searchQuizRequestData,
                    format_id: {
                      ...searchQuizRequestData.format_id,
                      [checkBoxValue]: checked
                    }
                  };
                  setSearchQuizRequestData(setData);
                }}
                label={'問題種別'}
              />
            </div>
            <div className="flex-shrink-0 flex items-center">
              <Checkbox
                value="only-checked"
                label="チェック済のみ検索"
                checked={!!searchQuizRequestData.checked}
                onChange={(e) => {
                  const setData = {
                    ...searchQuizRequestData,
                    checked: e.target.checked
                  };
                  setSearchQuizRequestData(setData);
                }}
              />
            </div>
          </div>
        </FormControl>
        <FormControl>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            <span className="text-sm whitespace-nowrap">上位</span>
            <MuiTextField
              className="!my-[8px]"
              variant="outlined"
              label="x件目から"
              type="number"
              inputProps={{ min: 1 }}
              value={searchQuizRequestData.result_from !== undefined ? String(searchQuizRequestData.result_from) : ''}
              onChange={(e) => {
                const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                const setData = { ...searchQuizRequestData, result_from: val };
                setSearchQuizRequestData(setData);
              }}
              sx={{ width: 120 }}
            />
            <span className="text-sm whitespace-nowrap">〜</span>
            <MuiTextField
              className="!my-[8px]"
              variant="outlined"
              label="y件目まで"
              type="number"
              inputProps={{ min: 1 }}
              value={searchQuizRequestData.result_to !== undefined ? String(searchQuizRequestData.result_to) : ''}
              onChange={(e) => {
                const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                const setData = { ...searchQuizRequestData, result_to: val };
                setSearchQuizRequestData(setData);
              }}
              sx={{ width: 120 }}
            />
            <span className="text-sm whitespace-nowrap">
              を表示（空欄で上位{SEARCH_LIMITS.MAX_QUIZ_SEARCH_RESULTS}件）
            </span>
          </div>
        </FormControl>
      </FormGroup>
      <Button
        label={'検索'}
        disabled={searchQuizRequestData.file_num === -1}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={() => runSearch(searchQuizRequestData)}
      />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        ※ 検索結果は最大 {SEARCH_LIMITS.MAX_QUIZ_SEARCH_RESULTS} 問まで表示されます
      </p>
    </>
  );
};
