import React, { useEffect, useState } from 'react';
import { QueryOfSearchQuizState } from '../../../../../../interfaces/state';
import { Checkbox, FormControl, FormControlLabel, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import {
  GetCategoryAPIResponseDto,
  getCategoryListAPI,
  getCategoryListAPIResponseToPullDownAdapter,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface SearchQueryFormProps {
  queryOfSearchQuizState: QueryOfSearchQuizState;
  setQueryofSearchQuizState?: React.Dispatch<React.SetStateAction<QueryOfSearchQuizState>>;
}

export const SearchQueryForm = ({ queryOfSearchQuizState, setQueryofSearchQuizState }: SearchQueryFormProps) => {
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
    if (!setCategorylistoption || !setQueryofSearchQuizState) {
      return;
    }

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
      setMessage(result.message);
      const pullDownOption = result.result
        ? getCategoryListAPIResponseToPullDownAdapter(result.result as GetCategoryAPIResponseDto[])
        : [];
      setCategorylistoption(pullDownOption);
    })();
  };

  return (
    <FormGroup>
      <FormControl>
        <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
      </FormControl>

      <FormControl>
        <TextField
          label="検索語句"
          setStater={(value: string) => {
            if (setQueryofSearchQuizState) {
              setQueryofSearchQuizState({
                ...queryOfSearchQuizState,
                query: value
              });
            }
          }}
        />
      </FormControl>

      <FormGroup row>
        検索対象：
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                if (setQueryofSearchQuizState) {
                  setQueryofSearchQuizState({
                    ...queryOfSearchQuizState,
                    cond: {
                      ...queryOfSearchQuizState.cond,
                      question: e.target.checked
                    }
                  });
                }
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
                if (setQueryofSearchQuizState) {
                  setQueryofSearchQuizState({
                    ...queryOfSearchQuizState,
                    cond: {
                      ...queryOfSearchQuizState.cond,
                      answer: e.target.checked
                    }
                  });
                }
              }}
              name="checkedB"
            />
          }
          label="答え"
        />
      </FormGroup>

      <FormControl>
        <PullDown
          label={'カテゴリ'}
          optionList={categorylistoption}
          onChange={(e) => {
            if (setQueryofSearchQuizState) {
              setQueryofSearchQuizState({
                ...queryOfSearchQuizState,
                category: String(e.target.value)
              });
            }
          }}
        />
      </FormControl>

      <FormControl>
        <RangeSliderSection
          sectionTitle={'正解率(%)指定'}
          setStater={(value: number[] | number) => {
            if (setQueryofSearchQuizState) {
              setQueryofSearchQuizState({
                ...queryOfSearchQuizState,
                minRate: Array.isArray(value) ? value[0] : value,
                maxRate: Array.isArray(value) ? value[1] : value
              });
            }
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
              if (setQueryofSearchQuizState) {
                setQueryofSearchQuizState({
                  ...queryOfSearchQuizState,
                  format: value
                });
              }
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
                if (setQueryofSearchQuizState) {
                  setQueryofSearchQuizState({
                    ...queryOfSearchQuizState,
                    checked: e.target.checked
                  });
                }
              }}
            />
          }
          label="チェック済のみ検索"
          labelPlacement="start"
        />
      </FormControl>
    </FormGroup>
  );
};
