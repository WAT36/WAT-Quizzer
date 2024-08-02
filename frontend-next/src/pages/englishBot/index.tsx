import { Layout } from '@/components/templates/layout/Layout';
import { WordSummaryChart } from '@/components/ui-forms/englishbot/top/wordSummaryChart/WordSummaryChart';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { getWordSummaryDataAPI } from '@/api/englishbot/getWordSummaryDataAPI';
import {
  GetPastWeekTestStatisticsAPIResponseDto,
  GetRandomWordAPIResponse,
  getWordTestStatisticsWeekDataAPI,
  WordSummaryApiResponse
} from 'quizzer-lib';
import { getRandomWordAPI } from '@/api/englishbot/getRandomWordAPI';
import { RandomWordDisplay } from '@/components/ui-forms/englishbot/top/randomWordDisplay/RandomWordDisplay';
import { TestLogPastWeekChart } from '@/components/ui-forms/englishbot/top/testLogPastWeekCharrt/TestLogPastWeekChart';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotTopPage({ isMock }: Props) {
  const [wordTestPastWeekStatisticsData, setWordTestPastWeekStatisticsData] = useState<
    GetPastWeekTestStatisticsAPIResponseDto[]
  >([]);
  const [wordSummaryData, setWordSummaryData] = useState<WordSummaryApiResponse[]>([]);
  const [randomWord, setRandomWord] = useState<GetRandomWordAPIResponse>({
    id: -1,
    name: '',
    pronounce: '',
    mean: [],
    word_source: []
  });
  const setMessage = useSetRecoilState(messageState);
  // 問題ファイルリスト取得
  useEffect(() => {
    !isMock &&
      Promise.all([
        // TODO これ　各コンポーネント内に置けられないか？　ステートも分けたい
        getWordSummaryDataAPI(setMessage, setWordSummaryData),
        getRandomWordAPI(setMessage, setRandomWord),
        (async () => {
          const result = await getWordTestStatisticsWeekDataAPI({});
          Array.isArray(result.result) &&
            setWordTestPastWeekStatisticsData(result.result as GetPastWeekTestStatisticsAPIResponseDto[]);
        })()
      ]);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <WordSummaryChart wordSummaryData={wordSummaryData} />
        <RandomWordDisplay wordData={randomWord} />
        <TestLogPastWeekChart wordTestPastWeekStatisticsData={wordTestPastWeekStatisticsData} />
      </Container>
    );
  };
  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'Top'} />
    </>
  );
}
