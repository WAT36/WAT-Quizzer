import { Box, Button, Card, Container, Modal, Paper, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { getApiAndGetValue } from '@/common/API';
import { WordApiResponse } from '../../../../interfaces/db';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, WordMeanData, WordSourceData } from '../../../../interfaces/state';
import { getPartOfSpeechList, getSourceList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { getWordDetail, getWordSource } from '@/pages/api/english';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';

type EachWordPageProps = {
  id: string;
};

export default function EnglishBotEachWordPage({ id }: EachWordPageProps) {
  const [wordName, setWordName] = useState<string>('');
  const [meanData, setMeanData] = useState<WordMeanData[]>([]);
  const [wordSourceData, setWordSourceData] = useState<WordSourceData[]>([]);
  const [open, setOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black'
  });

  useEffect(() => {
    Promise.all([
      getPartOfSpeechList(setMessage, setPosList),
      getSourceList(setMessage, setSourcelistoption),
      getWordDetail(id, setMessage, setWordName, setMeanData),
      getWordSource(id, setMessage, setWordSourceData)
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
          wordSourceData={wordSourceData}
          modalIsOpen={sourceModalOpen}
          setModalIsOpen={setSourceModalOpen}
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

export async function getAllWords() {
  const words = await getApiAndGetValue('/english/word');
  return await words.json();
}

export async function getStaticPaths() {
  const words: WordApiResponse[] = (await getAllWords()) as WordApiResponse[];
  return {
    paths: Object.values(words).map((word: WordApiResponse) => {
      return {
        params: {
          id: String(word.id)
        }
      };
    }),
    fallback: false
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const id = params!.id;
  return {
    props: {
      id
    }
  };
}
