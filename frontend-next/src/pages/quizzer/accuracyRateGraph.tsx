import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState, QueryOfGetAccuracyState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { GetFileForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileForm/GetFileForm';
import { GetFileButtonGroup } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileButtonGroup/GetFileButtonGroup';
import { AccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyChart/AccuracyChart';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { getQuizFileListAPI } from '@/api/quiz/getQuizFileListAPI';

type Props = {
  isMock?: boolean;
};

export default function AccuracyRateGraphPage({ isMock }: Props) {
  const [queryOfGetAccuracy, setQueryOfGetAccuracy] = useState<QueryOfGetAccuracyState>({
    fileNum: -1
  });
  const [message, setMessage] = useRecoilState(messageState);
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: []
  });
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  useEffect(() => {
    !isMock && getQuizFileListAPI(setMessage, setFilelistoption);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <GetFileForm
          filelistoption={filelistoption}
          queryOfGetAccuracy={queryOfGetAccuracy}
          setQueryOfGetAccuracy={setQueryOfGetAccuracy}
        />

        <GetFileButtonGroup
          queryOfGetAccuracy={queryOfGetAccuracy}
          setMessage={setMessage}
          setAccuracyData={setAccuracyData}
        />

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
