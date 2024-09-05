import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { DeleteQuizInfoState, QueryOfDeleteQuizState, QueryOfIntegrateToQuizState } from '../../../interfaces/state';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/DeleteQuizForm';
import { IntegrateToQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/integrateToQuizForm/IntegrateToQuizForm';
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

export default function DeleteQuizPage({ isMock }: Props) {
  const [queryOfDeleteQuizState, setQueryOfDeleteQuizState] = useState<QueryOfDeleteQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [queryOfIntegrateToQuizState, setQueryOfIntegrateToQuizState] = useState<QueryOfIntegrateToQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [deleteQuizInfoState, setDeleteQuizInfoState] = useState<DeleteQuizInfoState>({});
  const [message, setMessage] = useRecoilState(messageState);
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);

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
        <DeleteQuizForm
          queryOfDeleteQuizState={queryOfDeleteQuizState}
          queryOfIntegrateToQuizState={queryOfIntegrateToQuizState}
          deleteQuizInfoState={deleteQuizInfoState}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setQueryOfDeleteQuizState={setQueryOfDeleteQuizState}
          setDeleteQuizInfoState={setDeleteQuizInfoState}
          setQueryOfIntegrateToQuizState={setQueryOfIntegrateToQuizState}
        />
        <IntegrateToQuizForm
          queryOfDeleteQuizState={queryOfDeleteQuizState}
          queryOfIntegrateToQuizState={queryOfIntegrateToQuizState}
          setMessage={setMessage}
          setQueryOfDeleteQuizState={setQueryOfDeleteQuizState}
          setQueryOfIntegrateToQuizState={setQueryOfIntegrateToQuizState}
          setDeleteQuizInfoState={setDeleteQuizInfoState}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題削除'} />
    </>
  );
}
