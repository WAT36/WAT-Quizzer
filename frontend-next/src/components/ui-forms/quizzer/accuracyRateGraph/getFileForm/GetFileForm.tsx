import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import {
  getAccuracyRateByCategoryAPI,
  GetAccuracyRateByCategoryAPIResponseDto,
  GetCategoryRateAPIRequestDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { Button } from '@/components/ui-elements/button/Button';

interface GetFileFormProps {
  setAccuracyData: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryAPIResponseDto>>;
}

export const GetFileForm = ({ setAccuracyData }: GetFileFormProps) => {
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>({
    file_num: -1
  });
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
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

  return (
    <>
      <FormGroup>
        <PullDown
          label={'問題ファイル'}
          optionList={filelistoption}
          onChange={(e) => {
            setCategoryRateData({
              ...getCategoryRateData,
              file_num: +e.target.value
            });
          }}
        />
      </FormGroup>
      <Button
        label={'正解率表示'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getAccuracyRateByCategoryAPI({ getCategoryRateData });
          setMessage(result.message);
          if (result.result) {
            setAccuracyData({ ...(result.result as GetAccuracyRateByCategoryAPIResponseDto) });
          }
        }}
      ></Button>
    </>
  );
};
