import { getQuizFileStatisticsDataAPI } from '@/api/quiz/getQuizFileStatisticsDataAPI';
import { messageState } from '@/atoms/Message';
import { Layout } from '@/components/templates/layout/Layout';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/fileStatisticsCard/FileStatisticsCard';
import { Container } from '@mui/material';
import { QuizFileStatisticsApiResponse } from 'quizzer-lib';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function QuizzerTopPage({ isMock }: Props) {
  const [quizFileStatisticsData, setQuizFileStatisticsData] = useState<QuizFileStatisticsApiResponse[]>([]);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
  useEffect(() => {
    !isMock && Promise.all([getQuizFileStatisticsDataAPI({ setMessage, setQuizFileStatisticsData })]);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <FileStatisticsCard quizFileStatisticsData={quizFileStatisticsData} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'Top'} />
    </>
  );
}
