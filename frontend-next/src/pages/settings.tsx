import { CardContent, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { InputSayingState } from '../../interfaces/state';
import { AddBookForm } from '@/components/ui-forms/settings/addBookForm/AddBookForm';
import { AddSayingForm } from '@/components/ui-forms/settings/addSayingForm/AddSayingForm';
import { SearchSayingSection } from '@/components/ui-forms/settings/searchSayingSection/SearchSayingSection';
import { EditSayingSection } from '@/components/ui-forms/settings/editSayingSection/EditSayingSection';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { Card } from '@/components/ui-elements/card/Card';
import { getBook } from '@/api/saying/getBookListAPI';
import { PullDownOptionDto } from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function Settings({ isMock }: Props) {
  const [booklistoption, setBooklistoption] = useState<PullDownOptionDto[]>([]);
  const [bookName, setBookName] = useState<string>('');
  const [queryOfSaying, setQueryOfSaying] = useState<string>('');
  const [inputSaying, setInputSaying] = useState<InputSayingState>({
    bookId: -1,
    saying: '',
    explanation: ''
  });
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    !isMock && getBook(setMessage, setBooklistoption);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <>
        <Container>
          <Title label="WAT Quizzer - 設定"></Title>
          <Card variant="outlined" header="格言設定" attr="margin-vertical padding">
            <CardContent>
              <AddBookForm bookName={bookName} setBookName={setBookName} setBooklistoption={setBooklistoption} />
              <AddSayingForm
                inputSaying={inputSaying}
                booklistoption={booklistoption}
                setInputSaying={setInputSaying}
              />
              <SearchSayingSection queryOfSaying={queryOfSaying} setQueryOfSaying={setQueryOfSaying} />
              <EditSayingSection />
            </CardContent>
          </Card>
        </Container>
      </>
    );
  };

  return (
    <>
      <Layout mode="settings" contents={contents()} title={'設定'} />
    </>
  );
}
