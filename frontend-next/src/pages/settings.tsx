import { CardContent, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddBookForm } from '@/components/ui-forms/settings/addBookForm/AddBookForm';
import { AddSayingForm } from '@/components/ui-forms/settings/addSayingForm/AddSayingForm';
import { SearchSayingSection } from '@/components/ui-forms/settings/searchSayingSection/SearchSayingSection';
import { EditSayingSection } from '@/components/ui-forms/settings/editSayingSection/EditSayingSection';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { Card } from '@/components/ui-elements/card/Card';
import { listBook, PullDownOptionDto } from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function Settings({ isMock }: Props) {
  const [booklistoption, setBooklistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    async () => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await listBook();
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
    };
  }, [setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - 設定"></Title>
        <Card variant="outlined" header="格言設定" attr="margin-vertical padding">
          <CardContent>
            <AddBookForm setBooklistoption={setBooklistoption} />
            <AddSayingForm booklistoption={booklistoption} />
            <SearchSayingSection />
            <EditSayingSection />
          </CardContent>
        </Card>
      </Container>
    );
  };

  return <Layout mode="settings" contents={contents()} title={'設定'} />;
}
