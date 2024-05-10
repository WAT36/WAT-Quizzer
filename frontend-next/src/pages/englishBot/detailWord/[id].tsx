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
import { GetWordNumResponseDto } from 'quizzer-lib';

type EachWordPageProps = {
  id: string;
  isMock?: boolean;
};
// TODO dynamic routingだとファイル数膨大・単語追加のたびにデプロイ必要になるので不向き、Next.jsで何か別の使える機能ないか
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
    if (!isMock) {
      const accessToken = localStorage.getItem('apiAccessToken') || '';
      Promise.all([
        getPartOfSpeechListAPI(setMessage, setPosList, accessToken),
        getSourceListAPI(setMessage, setSourcelistoption, accessToken),
        getWordDetail(id, setMessage, setWordDetail, accessToken)
        // getWordSource(id, setMessage, setWordSourceData),
        // getWordSubSource(id, setMessage, setWordSubSourceData)
      ]);
    }
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
  const words: GetWordNumResponseDto = (await getApiAndGetValue(
    '/english/word/num',
    undefined,
    'no needs'
  )) as GetWordNumResponseDto;
  console.log('words max id:', words._max.id);
  return {
    paths: new Array(words._max.id)
      .fill(0)
      .map((_, i) => i)
      .map((d) => {
        return {
          params: {
            id: String(d + 1)
          }
        };
      }),
    fallback: false
  };
}
