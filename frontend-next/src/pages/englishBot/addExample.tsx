import React, { useState } from 'react';
import { buttonStyle } from '../../styles/Pages';
import { Button, Card, CardHeader, Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { SearchRelatedWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/SearchRelatedWordSection';
import { submitExampleSentenseAPI } from '@/common/ButtonAPI';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

export type InputExampleData = {
  exampleJa?: string;
  exampleEn?: string;
  meanId?: number[];
};

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddExamplePage({ isMock }: Props) {
  const [inputExampleData, setInputExampleData] = useState<InputExampleData>({});
  const [message, setMessage] = useRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>

        <Card variant="outlined">
          <CardHeader title="例文追加" />
          <AddExampleSection inputExampleData={inputExampleData} setInputExampleData={setInputExampleData} />
          <SearchRelatedWordSection
            inputExampleData={inputExampleData}
            setMessage={setMessage}
            setInputExampleData={setInputExampleData}
          />
          <Button
            style={buttonStyle}
            variant="contained"
            color="primary"
            onClick={(e) => submitExampleSentenseAPI({ inputExampleData, setMessage, setInputExampleData })}
          >
            登録
          </Button>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'例文追加'} />
    </>
  );
}
