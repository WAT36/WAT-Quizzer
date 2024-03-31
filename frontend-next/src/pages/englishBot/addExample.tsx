import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { SearchRelatedWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/SearchRelatedWordSection';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { submitExampleSentenseAPI } from '@/api/englishbot/submitExampleSentenseAPI';

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
  const setMessage = useSetRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>
        <Card variant="outlined" attr="margin-vertical" header="例文追加">
          <AddExampleSection inputExampleData={inputExampleData} setInputExampleData={setInputExampleData} />
          <SearchRelatedWordSection
            inputExampleData={inputExampleData}
            setMessage={setMessage}
            setInputExampleData={setInputExampleData}
          />
          <Button
            label={'登録'}
            attr={'after-inline'}
            variant="contained"
            color="primary"
            onClick={(e) => submitExampleSentenseAPI({ inputExampleData, setMessage, setInputExampleData })}
          />
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
