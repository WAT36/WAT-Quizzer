import { Layout } from '@/components/templates/layout/Layout';
import { WordSummaryChart } from '@/components/ui-forms/englishbot/top/wordSummaryChart/WordSummaryChart';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { WordSummaryApiResponse } from '../../../interfaces/db';
import { getWordSummaryData } from '@/common/response';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotTopPage({ isMock }: Props) {
  const [wordSummaryData, setWordSummaryData] = useState<WordSummaryApiResponse[]>([]);
  const setMessage = useSetRecoilState(messageState);
  // 問題ファイルリスト取得
  useEffect(() => {
    !isMock && getWordSummaryData(setMessage, setWordSummaryData);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <WordSummaryChart wordSummaryData={wordSummaryData} />
      </Container>
    );
  };
  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'Top'} />
    </>
  );
}
