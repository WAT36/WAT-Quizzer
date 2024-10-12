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
  GetQuizAPIRequestDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  initQuizFormatListData,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface InputQueryFormProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  setQuizRequestData: React.Dispatch<React.SetStateAction<GetQuizAPIRequestDto>>;
}

export const InputQueryForm = ({ getQuizRequestData, setQuizRequestData }: InputQueryFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([
    initQuizFormatListData
  ]);
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

  // 問題形式リスト取得
  useEffect(() => {
    // TODO これ　別関数にしたい
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFormatListAPI();
      setMessage(result.message);
      setQuizFormatListoption(
        result.result ? [initQuizFormatListData, ...(result.result as GetQuizFormatApiResponseDto[])] : []
      );
    })();
  }, [setMessage]);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (!setQuizRequestData) {
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    setQuizRequestData({
      ...getQuizRequestData,
      file_num: +e.target.value
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
      <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
      <FormControl>
        <TextField
          label="問題番号"
          setStater={(value: string) => {
            setQuizRequestData({
              ...getQuizRequestData,
              quiz_num: +value
            });
          }}
        />
      </FormControl>

      {/*TODO ランダムで使うところだけはCardかなんかで囲って表示させるようにしたい */}
      <PullDown
        label={'カテゴリ'}
        optionList={categorylistoption}
        onChange={(e) => {
          setQuizRequestData({
            ...getQuizRequestData,
            category: String(e.target.value)
          });
        }}
      />

      <FormControl>
        <RangeSliderSection
          sectionTitle={'正解率(%)指定'}
          setStater={(value: number[] | number) => {
            setQuizRequestData({
              ...getQuizRequestData,
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
            radioButtonProps: quizFormatListoption.map((x) => {
              return {
                value: String(x.id),
                label: x.name
              };
            }),
            defaultValue: '1',
            setQueryofQuizStater: (value: string) => {
              setQuizRequestData({
                ...getQuizRequestData,
                format_id: +value
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
                setQuizRequestData({
                  ...getQuizRequestData,
                  checked: e.target.checked
                });
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
