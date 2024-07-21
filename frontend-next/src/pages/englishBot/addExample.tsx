import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { AssociateExampleandWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/AssociateExampleandWordSection';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddExamplePage({ isMock }: Props) {
  const setMessage = useSetRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>
        <AddExampleSection setMessage={setMessage} />
        <AssociateExampleandWordSection setMessage={setMessage} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'例文追加'} />
    </>
  );
}
