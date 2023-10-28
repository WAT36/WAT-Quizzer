import { Layout } from '@/components/templates/layout/Layout';
import { MessageCard } from '@/components/ui-parts/messageCard/MessageCard';
import { Container } from '@mui/material';
import { MessageState } from '../../../interfaces/state';
import { useState } from 'react';
import { GetWordQueryForm } from '@/components/ui-forms/englishbot/testWord/getWordForm/GetWordQueryForm';
import { GetWordButtonGroup } from '@/components/ui-forms/englishbot/testWord/getWordButtonGroup/GetWordButtonGroup';
import { DisplayTestWordSection } from '@/components/ui-forms/englishbot/testWord/displayTestWordSection/DisplayTestWordSection';
import { Title } from '@/components/ui-elements/title/Title';

export default function TestWordPage() {
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        <MessageCard messageState={message}></MessageCard>

        <GetWordQueryForm />

        <GetWordButtonGroup />

        <DisplayTestWordSection />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'単語テスト'} />
    </>
  );
}
