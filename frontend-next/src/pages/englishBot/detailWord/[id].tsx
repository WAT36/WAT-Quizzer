import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getApiAndGetValue } from '@/api/API';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState, WordDetailData } from '../../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { getWordDetail } from '@/pages/api/english';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { getSourceListAPI } from '@/api/englishbot/getSourceListAPI';
import { getPartOfSpeechListAPI } from '@/api/englishbot/getPartOfSpeechListAPI';
import { GetWordAPIResponseDto } from 'quizzer-lib';

type EachWordPageProps = {
  id: string;
  isMock?: boolean;
};

export default function EnglishBotEachWordPage({ id, isMock }: EachWordPageProps) {
  const [wordDetail, setWordDetail] = useState<WordDetailData>({
    id: -1,
    name: '',
    pronounce: '',
    mean: [],
    word_subsource: []
  });
  const [open, setOpen] = useState(false);
  const [subSourceModalOpen, setSubSourceModalOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useRecoilState(messageState);

  useEffect(() => {
    !isMock &&
      Promise.all([
        getPartOfSpeechListAPI(setMessage, setPosList),
        getSourceListAPI(setMessage, setSourcelistoption),
        getWordDetail(id, setMessage, setWordDetail)
        // getWordSource(id, setMessage, setWordSourceData),
        // getWordSubSource(id, setMessage, setWordSubSourceData)
      ]);
  }, [id, isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        <Typography variant="h1" component="h1" color="common.black">
          {wordDetail.name}
        </Typography>

        <MeaningStack
          posList={posList}
          wordDetail={wordDetail}
          modalIsOpen={open}
          setMessage={setMessage}
          setWordDetail={setWordDetail}
          setModalIsOpen={setOpen}
        />
        <SourceStack
          sourceList={sourcelistoption}
          wordDetail={wordDetail}
          modalIsOpen={sourceModalOpen}
          setModalIsOpen={setSourceModalOpen}
          setMessage={setMessage}
          setWordDetail={setWordDetail}
        />
        <SubSourceStack
          wordDetail={wordDetail}
          modalIsOpen={subSourceModalOpen}
          setModalIsOpen={setSubSourceModalOpen}
          setMessage={setMessage}
          setWordDetail={setWordDetail}
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
  const words: GetWordAPIResponseDto[] = (await getAllWords()) as GetWordAPIResponseDto[];
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
