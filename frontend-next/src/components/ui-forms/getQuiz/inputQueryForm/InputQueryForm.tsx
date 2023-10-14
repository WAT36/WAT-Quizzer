import React from 'react';
import { DisplayQuizState, MessageState, PullDownOptionState, QueryOfQuizState } from '../../../../../interfaces/state';
import { Checkbox, FormControl, FormControlLabel, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { get } from '@/common/API';
import { CategoryApiResponse } from '../../../../../interfaces/db';

interface InputQueryFormProps {
  filelistoption: PullDownOptionState[];
  categorylistoption: PullDownOptionState[];
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setCategorylistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const InputQueryForm = ({
  filelistoption,
  categorylistoption,
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setCategorylistoption,
  setQueryofQuizStater,
  setDisplayQuizStater
}: InputQueryFormProps) => {
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (!setMessageStater || !setCategorylistoption || !setDisplayQuizStater || !setQueryofQuizStater) {
      return;
    }

    setMessageStater({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get(
      '/category',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const res: CategoryApiResponse[] = data.body as CategoryApiResponse[];
          let categorylist = [];
          for (var i = 0; i < res.length; i++) {
            categorylist.push({
              value: res[i].category,
              label: res[i].category
            });
          }
          setQueryofQuizStater({
            ...queryOfQuizState,
            fileNum: e.target.value as number
          });
          setCategorylistoption(categorylist);
          setMessageStater({
            message: '　',
            messageColor: 'common.black'
          });
        } else {
          setMessageStater({
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
          label="問題番号"
          setStater={(value: string) => {
            if (setQueryofQuizStater) {
              setQueryofQuizStater({
                ...queryOfQuizState,
                quizNum: +value
              });
            }
          }}
        />
      </FormControl>

      <FormControl>
        <PullDown
          label={'カテゴリ'}
          optionList={categorylistoption}
          onChange={(e) => {
            if (setQueryofQuizStater) {
              setQueryofQuizStater({
                ...queryOfQuizState,
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
            if (setQueryofQuizStater) {
              setQueryofQuizStater({
                ...queryOfQuizState,
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
              },
              {
                value: '4choice',
                label: '四択問題'
              }
            ],
            defaultValue: 'basic',
            setQueryofQuizStater: (value: string) => {
              if (setQueryofQuizStater) {
                setQueryofQuizStater({
                  ...queryOfQuizState,
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
                if (setDisplayQuizStater) {
                  setDisplayQuizStater({
                    ...displayQuizState,
                    checked: e.target.checked
                  });
                }
              }}
            />
          }
          label="チェック済から出題"
          labelPlacement="start"
        />
      </FormControl>
    </FormGroup>
  );
};
