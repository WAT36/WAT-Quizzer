import { Layout } from '@/components/templates/layout/Layout';
import { WordSummaryChart } from '@/components/ui-forms/englishbot/top/wordSummaryChart/WordSummaryChart';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import {
  GetPastWeekTestStatisticsAPIResponseDto,
  getRandomWordAPI,
  GetRandomWordAPIResponse,
  getWordSummaryDataAPI,
  getWordTestStatisticsWeekDataAPI,
  WordSummaryApiResponse
} from 'quizzer-lib';
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
        // TODO これ　各コンポーネント内に分けて置けられないか？　ステートも分けたい
        (async () => {
          const result = await getWordSummaryDataAPI();
          Array.isArray(result.result) && setWordSummaryData(result.result as WordSummaryApiResponse[]);
        })(),
        (async () => {
          const result = await getRandomWordAPI();
          !Array.isArray(result.result) && setRandomWord(result.result as GetRandomWordAPIResponse);
        })(),
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
