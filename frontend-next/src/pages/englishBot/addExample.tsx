import React, { useState } from 'react';

import { buttonStyle } from '../../styles/Pages';
import { Button, Card, CardHeader, Container } from '@mui/material';
import { post } from '@/common/API';
import { GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { MessageState } from '../../../interfaces/state';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { SearchRelatedWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/SearchRelatedWordSection';

export type InputExampleData = {
  exampleJa?: string;
  exampleEn?: string;
  meanId?: number[];
};

export default function EnglishBotAddExamplePage() {
  const [inputExampleData, setInputExampleData] = useState<InputExampleData>({});
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black'
  });

  // 例文データ登録
  const submitExampleData = () => {
    console.log(`now state: ${JSON.stringify(inputExampleData)}`);

    if (!inputExampleData || !inputExampleData.exampleEn || inputExampleData.exampleEn === '') {
      setMessage({
        message: 'エラー:例文(英文)が入力されていません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (!inputExampleData.exampleJa || inputExampleData.exampleJa === '') {
      setMessage({
        message: 'エラー:例文(和文)が入力されていません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (!inputExampleData.meanId || inputExampleData.meanId.length === 0) {
      setMessage({
        message: 'エラー:単語または意味へのチェック指定がありません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    post(
      '/english/example',
      {
        exampleEn: inputExampleData.exampleEn,
        exampleJa: inputExampleData.exampleJa,
        meanId: inputExampleData.meanId
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: '例文を登録しました',
            messageColor: 'success.light',
            isDisplay: true
          });
          setInputExampleData({});
          setQuery('');
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>

        <Card variant="outlined">
          <CardHeader title="例文追加" />
          <AddExampleSection inputExampleData={inputExampleData} setInputExampleData={setInputExampleData} />
          <SearchRelatedWordSection
            searchResult={searchResult}
            inputExampleData={inputExampleData}
            setMessage={setMessage}
            setSearchResult={setSearchResult}
            setInputExampleData={setInputExampleData}
          />
          <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => submitExampleData()}>
            登録
          </Button>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'例文追加'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
