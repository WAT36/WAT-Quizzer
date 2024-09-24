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
import { Button } from '@/components/ui-elements/button/Button';
import { addQuizAPI } from '@/api/quiz/addQuizAPI';

interface AddQuizFormProps {
  setAddLog?: React.Dispatch<React.SetStateAction<string>>;
}

export const AddQuizForm = ({ setAddLog }: AddQuizFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [queryOfAddQuiz, setQueryOfAddQuiz] = useState<QueryOfPutQuizState>({
    fileNum: -1,
    quizNum: -1
  });
  const [value, setValue] = React.useState(0);
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
    setQueryOfAddQuiz((prev) => ({
      ...prev,
      fileNum: +e.target.value
    }));
  };

  return (
    <>
      <FormGroup>
        <FormControl>
          <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        </FormControl>

        <PutQuizForm
          value={value}
          queryOfPutQuizState={queryOfAddQuiz}
          setValue={setValue}
          setQueryofPutQuizStater={setQueryOfAddQuiz}
        />
      </FormGroup>
      <Button
        label="問題登録"
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          addQuizAPI({
            value,
            queryOfAddQuizState: queryOfAddQuiz,
            setAddLog,
            setMessageStater: setMessage,
            setQueryofAddQuizStater: setQueryOfAddQuiz
          })
        }
      />
    </>
  );
};
