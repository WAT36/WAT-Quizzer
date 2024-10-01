import React, { useState } from 'react';
import { Container } from '@mui/material';
import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { GetFileForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileForm/GetFileForm';
import { AccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyChart/AccuracyChart';

type Props = {
  isMock?: boolean;
};

export default function AccuracyRateGraphPage({ isMock }: Props) {
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: []
  });

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <GetFileForm setAccuracyData={setAccuracyData} />
        <AccuracyChart accuracyData={accuracy_data} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'カテゴリ別正解率表示'} />
    </>
  );
}
