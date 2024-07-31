import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { AssociateExampleandWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/AssociateExampleandWordSection';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddExamplePage({ isMock }: Props) {
  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>
        <AddExampleSection />
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
