import { useEffect, useState } from 'react';
import { RandomWordDisplay } from '../randomWordDisplay/RandomWordDisplay';
import { SourceStatisticsCard } from '../sourceStatisticsCard/SourceStatisticsCard';
import { TestLogPastWeekChart } from '../testLogPastWeekCharrt/TestLogPastWeekChart';
import { WordSummaryChart } from '../wordSummaryChart/WordSummaryChart';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type {
  GetPastWeekTestStatisticsAPIResponseDto,
  GetRandomWordAPIResponse,
  WordSummaryApiResponse
} from 'quizzer-lib';
import { getWordSummaryDataAPI, getRandomWordAPI, getWordTestStatisticsWeekDataAPI } from '@/utils/api-wrapper';

interface EnglishBotDashboardProps {}

export const EnglishBotDashboard: React.FC<EnglishBotDashboardProps> = ({}) => {
  const [wordSummaryData, setWordSummaryData] = useState<WordSummaryApiResponse[]>([]);
  const [randomWord, setRandomWord] = useState<GetRandomWordAPIResponse>({
    id: -1,
    name: '',
    pronounce: '',
    mean: [],
    word_source: []
  });
  const [wordTestPastWeekStatisticsData, setWordTestPastWeekStatisticsData] = useState<
    GetPastWeekTestStatisticsAPIResponseDto[]
  >([]);
  // 問題ファイルリスト取得
  const setMessage = useSetRecoilState(messageState);
  useEffect(() => {
    void Promise.all([
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
  }, [setMessage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 overflow-y-auto box-border">
      <WordSummaryChart wordSummaryData={wordSummaryData} />
      <RandomWordDisplay wordData={randomWord} />
      <SourceStatisticsCard />
      <TestLogPastWeekChart wordTestPastWeekStatisticsData={wordTestPastWeekStatisticsData} />
    </div>
  );
};
