import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { QueryOfPutQuizState } from '../../../interfaces/state';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { Title } from '@/components/ui-elements/title/Title';
import { AddQuizForm } from '@/components/ui-forms/quizzer/addQuiz/addQuizForm/AddQuizForm';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { addQuizAPI } from '@/api/quiz/addQuizAPI';
import {
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI
} from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function AddQuizPage({ isMock }: Props) {
  const [queryOfAddQuiz, setQueryOfAddQuiz] = useState<QueryOfPutQuizState>({
    fileNum: -1,
    quizNum: -1
  });
  const [message, setMessage] = useRecoilState(messageState);
  const [addLog, setAddLog] = useState<string>('');
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [value, setValue] = React.useState(0);

  // 問題ファイルリスト取得
  useEffect(() => {
    if (!isMock) {
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
    }
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <AddQuizForm
          filelistoption={filelistoption}
          value={value}
          queryOfPutQuizState={queryOfAddQuiz}
          setValue={setValue}
          setQueryofPutQuizStater={setQueryOfAddQuiz}
        />

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

        <AddQuizLogSection log={addLog} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
