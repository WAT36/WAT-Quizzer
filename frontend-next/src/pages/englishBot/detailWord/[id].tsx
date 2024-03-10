import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import {
  MessageState,
  PullDownOptionState,
  WordMeanData,
  WordSourceData,
  WordSubSourceData
} from '../../../../interfaces/state';
import { getPartOfSpeechList, getSourceList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { getWordDetail, getWordSource, getWordSubSource } from '@/pages/api/english';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { GetServerSideProps } from 'next';

type DetailWordPageProps = {
  id: string;
};

export const getServerSideProps: GetServerSideProps<DetailWordPageProps> = async (context) => {
  const { id } = context.query;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  return { props: { id } };
};

export default function EnglishBotEachWordPage(props: DetailWordPageProps) {
  const [wordName, setWordName] = useState<string>('');
  const [meanData, setMeanData] = useState<WordMeanData[]>([]);
  const [wordSourceData, setWordSourceData] = useState<WordSourceData[]>([]);
  const [wordSubSourceData, setWordSubSourceData] = useState<WordSubSourceData[]>([]);
  const [open, setOpen] = useState(false);
  const [subSourceModalOpen, setSubSourceModalOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black'
  });

  const id = props.id;

  useEffect(() => {
    Promise.all([
      getPartOfSpeechList(setMessage, setPosList),
      getSourceList(setMessage, setSourcelistoption),
      getWordDetail(id, setMessage, setWordName, setMeanData),
      getWordSource(id, setMessage, setWordSourceData),
      getWordSubSource(id, setMessage, setWordSubSourceData)
    ]);
  }, [id]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        <Typography variant="h1" component="h1" color="common.black">
          {wordName}
        </Typography>

        <MeaningStack
          id={id}
          posList={posList}
          sourceList={sourcelistoption}
          meanData={meanData}
          modalIsOpen={open}
          setMessage={setMessage}
          setModalIsOpen={setOpen}
          setMeanData={setMeanData}
        />
        <SourceStack
          id={id}
          meanData={meanData}
          sourceList={sourcelistoption}
          wordSourceData={wordSourceData}
          modalIsOpen={sourceModalOpen}
          setModalIsOpen={setSourceModalOpen}
          setMessage={setMessage}
          setWordSourceData={setWordSourceData}
        />
        <SubSourceStack
          id={id}
          wordSubSourceData={wordSubSourceData}
          modalIsOpen={subSourceModalOpen}
          setModalIsOpen={setSubSourceModalOpen}
          setMessage={setMessage}
          setWordSubSourceData={setWordSubSourceData}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'各単語詳細'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
