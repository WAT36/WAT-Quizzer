import React, { useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import {
  GetCategoryAPIResponseDto,
  getCategoryListAPI,
  getCategoryListAPIResponseToPullDownAdapter,
  GetQuizApiResponseDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  searchQuizAPI,
  SearchQuizAPIRequestDto
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import { GridRowsProp } from '@mui/x-data-grid';

interface SearchQueryFormProps {
  searchQuizRequestData: SearchQuizAPIRequestDto;
  setSearchResult: React.Dispatch<React.SetStateAction<GridRowsProp>>;
  setSearchQuizRequestData: React.Dispatch<React.SetStateAction<SearchQuizAPIRequestDto>>;
}

export const SearchQueryForm = ({
  searchQuizRequestData,
  setSearchResult,
  setSearchQuizRequestData
}: SearchQueryFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    // TODO カテゴリリスト取得 これ　別関数にしたい　というよりこのselectedFileChangeをlibとかに持ってきたい getQuizにもこの関数あるので
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getCategoryListAPI({ getCategoryListData: { file_num: String(e.target.value) } });
      setSearchQuizRequestData({
        ...searchQuizRequestData,
        file_num: +e.target.value
      });
      setMessage(result.message);
      const pullDownOption = result.result
        ? getCategoryListAPIResponseToPullDownAdapter(result.result as GetCategoryAPIResponseDto[])
        : [];
      setCategorylistoption(pullDownOption);
    })();
  };

  return (
    <>
      <FormGroup>
        <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        <FormControl>
          <TextField
            label="検索語句"
            setStater={(value: string) => {
              setSearchQuizRequestData({
                ...searchQuizRequestData,
                query: value
              });
            }}
          />
        </FormControl>

        <FormGroup row>
          検索対象：
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  setSearchQuizRequestData({
                    ...searchQuizRequestData,
                    searchInOnlySentense: e.target.checked
                  });
                }}
                name="checkedA"
              />
            }
            label="問題"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  setSearchQuizRequestData({
                    ...searchQuizRequestData,
                    searchInOnlyAnswer: e.target.checked
                  });
                }}
                name="checkedB"
              />
            }
            label="答え"
          />
        </FormGroup>

        <PullDown
          label={'カテゴリ'}
          optionList={categorylistoption}
          onChange={(e) => {
            setSearchQuizRequestData({
              ...searchQuizRequestData,
              category: String(e.target.value)
            });
          }}
        />

        <FormControl>
          <RangeSliderSection
            sectionTitle={'正解率(%)指定'}
            setStater={(value: number[] | number) => {
              setSearchQuizRequestData({
                ...searchQuizRequestData,
                min_rate: Array.isArray(value) ? value[0] : value,
                max_rate: Array.isArray(value) ? value[1] : value
              });
            }}
          />
        </FormControl>

        <FormControl>
          <RadioGroupSection
            sectionTitle={'問題種別'}
            radioGroupProps={{
              radioButtonProps: [
                {
                  value: 'basic',
                  label: '基礎問題'
                },
                {
                  value: 'applied',
                  label: '応用問題'
                }
              ],
              defaultValue: 'basic',
              setQueryofQuizStater: (value: string) => {
                setSearchQuizRequestData({
                  ...searchQuizRequestData,
                  format: value
                });
              }
            }}
          />
        </FormControl>

        <FormControl>
          <FormControlLabel
            value="only-checked"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  setSearchQuizRequestData({
                    ...searchQuizRequestData,
                    checked: e.target.checked
                  });
                }}
              />
            }
            label="チェック済のみ検索"
            labelPlacement="start"
          />
        </FormControl>
      </FormGroup>
      <Button
        label={'検索'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await searchQuizAPI({ searchQuizRequestData });
          setMessage(result.message);
          if (result.result) {
            const apiResult = (result.result as GetQuizApiResponseDto[]).map((x) => {
              return {
                ...x,
                category: x.quiz_category
                  ? x.quiz_category
                      .filter((x) => {
                        return !x.deleted_at;
                      })
                      .map((x) => {
                        return x.category;
                      })
                      .join(',')
                  : ''
              };
            });
            setSearchResult(apiResult);
          }
        }}
      />
    </>
  );
};
