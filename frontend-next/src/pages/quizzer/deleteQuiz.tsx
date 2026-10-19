import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/DeleteQuizForm';
import { IntegrateToQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/integrateToQuizForm/IntegrateToQuizForm';
import type { GetQuizApiResponseDto } from 'quizzer-lib';
import { initGetQuizResponseData } from 'quizzer-lib';

export default function DeleteQuizPage() {
  const [deleteQuizInfo, setDeleteQuizInfo] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const contents = () => {
    return (
      <Container>
        <DeleteQuizForm deleteQuizInfo={deleteQuizInfo} setDeleteQuizInfo={setDeleteQuizInfo} />
        <IntegrateToQuizForm deleteQuizInfo={deleteQuizInfo} setDeleteQuizInfo={setDeleteQuizInfo} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題削除'} />;
}
