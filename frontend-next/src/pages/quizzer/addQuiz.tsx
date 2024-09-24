import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { Title } from '@/components/ui-elements/title/Title';
import { AddQuizForm } from '@/components/ui-forms/quizzer/addQuiz/addQuizForm/AddQuizForm';

type Props = {
  isMock?: boolean;
};

export default function AddQuizPage({ isMock }: Props) {
  const [log, setLog] = useState<string>('');
  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <AddQuizForm setAddLog={setLog} />
        <AddQuizLogSection log={log} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
