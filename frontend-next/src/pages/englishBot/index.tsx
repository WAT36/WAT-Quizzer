import { Layout } from '@/components/templates/layout/Layout';
import { WordSummaryChart } from '@/components/ui-forms/englishbot/top/wordSummaryChart/WordSummaryChart';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { WordSummaryApiResponse } from '../../../interfaces/db';
import { getWordSummaryData } from '@/common/response';
import { MessageState } from '../../../interfaces/state';

export default function EnglishBotTopPage() {
  const [wordSummaryData, setWordSummaryData] = useState<WordSummaryApiResponse[]>([]);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  // 問題ファイルリスト取得
  useEffect(() => {
    getWordSummaryData(setMessage, setWordSummaryData);
  }, []);

  const contents = () => {
    return (
      <Container>
        <WordSummaryChart wordSummaryData={wordSummaryData} />
      </Container>
    );
  };
  return (
    <>
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'Top'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
