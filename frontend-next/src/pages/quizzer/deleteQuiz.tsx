import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/DeleteQuizForm';
import { IntegrateToQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/integrateToQuizForm/IntegrateToQuizForm';
import {
  GetQuizApiResponseDto,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  initGetQuizResponseData
} from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function DeleteQuizPage({ isMock }: Props) {
  const [deleteQuizInfo, setDeleteQuizInfo] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

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
      setQuizFormatListoption(result.result ? (result.result as GetQuizFormatApiResponseDto[]) : []);
    })();
  }, [setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <DeleteQuizForm
          deleteQuizInfo={deleteQuizInfo}
          quizFormatListoption={quizFormatListoption}
          setDeleteQuizInfo={setDeleteQuizInfo}
        />
        <IntegrateToQuizForm
          deleteQuizInfo={deleteQuizInfo}
          quizFormatListoption={quizFormatListoption}
          setDeleteQuizInfo={setDeleteQuizInfo}
        />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題削除'} />;
}
