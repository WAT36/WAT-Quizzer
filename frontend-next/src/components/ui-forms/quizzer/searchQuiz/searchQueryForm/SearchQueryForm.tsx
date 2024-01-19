import React from 'react';
import { MessageState, PullDownOptionState, QueryOfSearchQuizState } from '../../../../../../interfaces/state';
import { Checkbox, FormControl, FormControlLabel, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { ProcessingApiReponse } from '../../../../../../interfaces/api/response';
import { get } from '@/common/API';
import { CategoryApiResponse } from '../../../../../../interfaces/db';

interface SearchQueryFormProps {
  filelistoption: PullDownOptionState[];
  categorylistoption: PullDownOptionState[];
  queryOfSearchQuizState: QueryOfSearchQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setCategorylistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
  setQueryofSearchQuizState?: React.Dispatch<React.SetStateAction<QueryOfSearchQuizState>>;
}

export const SearchQueryForm = ({
  filelistoption,
  categorylistoption,
  queryOfSearchQuizState,
  setMessage,
  setCategorylistoption,
  setQueryofSearchQuizState
}: SearchQueryFormProps) => {
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (!setMessage || !setCategorylistoption || !setQueryofSearchQuizState) {
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get(
      '/category',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const res: CategoryApiResponse[] = data.body as CategoryApiResponse[];
          let categorylist: PullDownOptionState[] = [];
          for (var i = 0; i < res.length; i++) {
            categorylist.push({
              value: res[i].category,
              label: res[i].category
            });
          }
          setQueryofSearchQuizState({
            ...queryOfSearchQuizState,
            fileNum: +e.target.value
          });
          setCategorylistoption(categorylist);
          setMessage({
            message: '　',
            messageColor: 'commmon.black'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        file_num: String(e.target.value)
      }
    );
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
