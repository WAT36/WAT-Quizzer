import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { QueryOfPutQuizState } from '../../../../../../interfaces/state';
import { PutQuizForm } from '../../forms/putQuizForm/PutQuizForm';
import {
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface AddQuizFormProps {
  value: number;
  queryOfPutQuizState: QueryOfPutQuizState;
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  setQueryofPutQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const AddQuizForm = ({ value, queryOfPutQuizState, setValue, setQueryofPutQuizStater }: AddQuizFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
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

  // ファイル選択の切り替え
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (setQueryofPutQuizStater) {
      setQueryofPutQuizStater((prev) => ({
        ...prev,
        fileNum: +e.target.value
      }));
    }
  };

  return (
    <>
      <FormGroup>
        <FormControl>
          <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        </FormControl>

        <PutQuizForm
          value={value}
          queryOfPutQuizState={queryOfPutQuizState}
          setValue={setValue}
          setQueryofPutQuizStater={setQueryofPutQuizStater}
        />
      </FormGroup>
    </>
  );
};
