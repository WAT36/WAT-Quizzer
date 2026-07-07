import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { AssociateExampleandWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/AssociateExampleandWordSection';
import { apiResponsePullDownAdapter, PullDownOptionDto, SourceApiResponse } from 'quizzer-lib';
import { getSourceListAPI } from '@/utils/api-wrapper';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddExamplePage({ isMock }: Props) {
  const [sourceList, setSourceList] = useState<PullDownOptionDto[]>([]);

  useEffect(() => {
    !isMock &&
      (async () => {
        const result = await getSourceListAPI();
        result.result && setSourceList(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
      })();
  }, [isMock]);

  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>
        <AddExampleSection sourceList={sourceList} />
        <AssociateExampleandWordSection />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'例文追加'} />
    </>
  );
}
