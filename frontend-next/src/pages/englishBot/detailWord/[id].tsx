import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getApiAndGetValue } from '@/common/API';
import { WordApiResponse } from '../../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState, WordMeanData, WordSourceData, WordSubSourceData } from '../../../../interfaces/state';
import { getPartOfSpeechList, getSourceList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { getWordDetail, getWordSource, getWordSubSource } from '@/pages/api/english';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

type EachWordPageProps = {
  id: string;
};

export default function EnglishBotEachWordPage({ id }: EachWordPageProps) {
  const [wordName, setWordName] = useState<string>('');
  const [meanData, setMeanData] = useState<WordMeanData[]>([]);
  const [wordSourceData, setWordSourceData] = useState<WordSourceData[]>([]);
  const [wordSubSourceData, setWordSubSourceData] = useState<WordSubSourceData[]>([]);
  const [open, setOpen] = useState(false);
  const [subSourceModalOpen, setSubSourceModalOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useRecoilState(messageState);

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
      <Layout mode="englishBot" contents={contents()} title={'各単語詳細'} />
    </>
  );
}

export async function getAllWords() {
  return await getApiAndGetValue('/english/word');
}

// getStaticPathsの返り値、各文書のファイルパス(dynamic routing([id])のためstring)
type Params = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  return {
    props: {
      id: params.id
    }
  };
}

// 一番最初に実行される関数
export async function getStaticPaths() {
  const words: WordApiResponse[] = (await getAllWords()) as WordApiResponse[];
  console.log('words num:', words.length);
  return {
    paths: words.map((word) => {
      return {
        params: {
          id: String(word.id)
        }
      };
    }),
    fallback: false
  };
}
