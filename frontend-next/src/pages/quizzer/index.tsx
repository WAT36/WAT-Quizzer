import { getQuizStatisticsWeekDataAPI } from '@/api/quiz/getQuizStatisticsWeekDataAPI';
import { messageState } from '@/atoms/Message';
import { Layout } from '@/components/templates/layout/Layout';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/fileStatisticsCard/FileStatisticsCard';
import { PastWeekAnswerDataCard } from '@/components/ui-forms/quizzer/top/PastWeekAnswerDataCard/PastWeekAnswerDataCard';
import { Container } from '@mui/material';
import { QuizStatisticsWeekApiResponse } from 'quizzer-lib';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function QuizzerTopPage({ isMock }: Props) {
  const [quizStatisticsWeekData, setQuizStatisticsWeekData] = useState<QuizStatisticsWeekApiResponse[]>([]);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
  useEffect(() => {
    !isMock && Promise.all([getQuizStatisticsWeekDataAPI({ setMessage, setQuizStatisticsWeekData })]);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <FileStatisticsCard />
        <PastWeekAnswerDataCard quizStatisticsWeekData={quizStatisticsWeekData} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'Top'} />
    </>
  );
}
