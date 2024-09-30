import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/DeleteQuizForm';
import { IntegrateToQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/integrateToQuizForm/IntegrateToQuizForm';
import { GetQuizApiResponseDto, initGetQuizResponseData } from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function DeleteQuizPage({ isMock }: Props) {
  const [deleteQuizInfo, setDeleteQuizInfo] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <DeleteQuizForm deleteQuizInfo={deleteQuizInfo} setDeleteQuizInfo={setDeleteQuizInfo} />
        <IntegrateToQuizForm deleteQuizInfo={deleteQuizInfo} setDeleteQuizInfo={setDeleteQuizInfo} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題削除'} />;
}
