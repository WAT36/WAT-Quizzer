import { CardContent, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddBookForm } from '@/components/ui-forms/settings/addBookForm/AddBookForm';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { Card } from '@/components/ui-elements/card/Card';
import type { PullDownOptionDto } from 'quizzer-lib';
import { listBookAPI } from '@/utils/api-wrapper';
import { SayingSection } from '@/components/ui-forms/settings/sayingSection/SayingSection';
import { TodoSection } from '@/components/ui-forms/settings/todoSection/TodoSection';

type Props = {
  isMock?: boolean;
};

export default function Settings({ isMock }: Props) {
  const [booklistoption, setBooklistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    void (async () => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await listBookAPI();
      setMessage(result.message);
      if (result.result && Array.isArray(result.result)) {
        let booklist: PullDownOptionDto[] = [];
        for (var i = 0; i < result.result.length; i++) {
          booklist.push({
            value: String(result.result[i].id),
            label: result.result[i].name
          });
        }
        setBooklistoption(booklist);
      }
    })();
  }, [setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - 設定" />
        <Card variant="outlined" header="格言設定" attr={['margin-vertical', 'padding']}>
          <CardContent>
            <AddBookForm setBooklistoption={setBooklistoption} />
            <SayingSection booklistoption={booklistoption} />
            <TodoSection />
          </CardContent>
        </Card>
      </Container>
    );
  };

  return <Layout mode="settings" contents={contents()} title={'設定'} />;
}

export async function getStaticProps() {
  return {
    props: {
      isMock: process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
    }
  };
}
