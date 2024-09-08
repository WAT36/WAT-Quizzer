import React, { useEffect, useState } from 'react';
import { DisplayQuizState, QueryOfQuizState } from '../../../../../../interfaces/state';
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

interface InputQueryFormProps {
  queryOfQuizState: QueryOfQuizState;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const InputQueryForm = ({
  queryOfQuizState,
  setQueryofQuizStater,
  setDisplayQuizStater
}: InputQueryFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
  useEffect(() => {
    // TODO これ　別関数にしたい
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
    if (!setDisplayQuizStater || !setQueryofQuizStater) {
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    setQueryofQuizStater({
      ...queryOfQuizState,
      fileNum: +e.target.value
    });

    // TODO カテゴリリスト取得 これ　別関数にしたい
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
                if (setQueryofQuizStater) {
                  setQueryofQuizStater({
                    ...queryOfQuizState,
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
