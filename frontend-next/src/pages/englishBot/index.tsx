import { Layout } from '@/components/templates/layout/Layout';
import { WordSummaryChart } from '@/components/ui-forms/englishbot/top/wordSummaryChart/WordSummaryChart';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { WordSummaryApiResponse } from '../../../interfaces/db';
import { getWordSummaryData } from '@/common/response';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

export default function EnglishBotTopPage() {
  const [wordSummaryData, setWordSummaryData] = useState<WordSummaryApiResponse[]>([]);
  const [message, setMessage] = useRecoilState(messageState);
  // 問題ファイルリスト取得
  useEffect(() => {
    getWordSummaryData(setMessage, setWordSummaryData);
  }, [setMessage]);

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
