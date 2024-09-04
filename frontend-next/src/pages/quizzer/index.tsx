import { Layout } from '@/components/templates/layout/Layout';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/fileStatisticsCard/FileStatisticsCard';
import { PastWeekAnswerDataCard } from '@/components/ui-forms/quizzer/top/PastWeekAnswerDataCard/PastWeekAnswerDataCard';
import { Container } from '@mui/material';
import React from 'react';

type Props = {
  isMock?: boolean;
};

export default function QuizzerTopPage({ isMock }: Props) {
  const contents = () => {
    return (
      <Container>
        <FileStatisticsCard />
        <PastWeekAnswerDataCard />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'Top'} />
    </>
  );
}
