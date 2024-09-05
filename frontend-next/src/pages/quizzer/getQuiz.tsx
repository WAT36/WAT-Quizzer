import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { DisplayQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizButtonGroup } from '@/components/ui-forms/quizzer/getQuiz/getQuizButtonGroup/GetQuizButtonGroup';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { InputQueryForm } from '@/components/ui-forms/quizzer/getQuiz/inputQueryForm/InputQueryForm';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import {
  PullDownOptionDto,
  getQuizFileListAPI,
  quizFileListAPIResponseToPullDownAdapter,
  GetQuizFileApiResponseDto
} from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function GetQuizPage({ isMock }: Props) {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const [message, setMessage] = useRecoilState(messageState);
  const [queryOfQuiz, setQueryOfQuiz] = useState<QueryOfQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [displayQuiz, setDisplayQuiz] = useState<DisplayQuizState>({
    fileNum: -1,
    quizNum: -1,
    quizSentense: '',
    quizAnswer: '',
    checked: false,
    expanded: false
  });

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

        <InputQueryForm
          filelistoption={filelistoption}
          categorylistoption={categorylistoption}
          queryOfQuizState={queryOfQuiz}
          displayQuizState={displayQuiz}
          setMessageStater={setMessage}
          setCategorylistoption={setCategorylistoption}
          setQueryofQuizStater={setQueryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
        />

        <GetQuizButtonGroup
          queryOfQuizState={queryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
          setMessageStater={setMessage}
          setQueryofQuizStater={setQueryOfQuiz}
        />

        <DisplayQuizSection
          queryOfQuizState={queryOfQuiz}
          displayQuizState={displayQuiz}
          setMessageStater={setMessage}
          setDisplayQuizStater={setDisplayQuiz}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題出題'} />
    </>
  );
}
