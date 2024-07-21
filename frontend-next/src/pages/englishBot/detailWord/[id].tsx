import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getApiAndGetValue } from '@/api/API';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState } from '../../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { getSourceListAPI } from '@/api/englishbot/getSourceListAPI';
import { getPartOfSpeechListAPI } from '@/api/englishbot/getPartOfSpeechListAPI';
import { GetWordNumResponseDto, GetWordDetailAPIResponseDto, getWordDetailAPI } from 'quizzer-lib';
import { SynonymStack } from '@/components/ui-forms/englishbot/detailWord/synonymStack/SynonymStack';
import { AntonymStack } from '@/components/ui-forms/englishbot/detailWord/antonymStack/AntonymStack';

type EachWordPageProps = {
  id: string;
  isMock?: boolean;
};
// TODO dynamic routingだとファイル数膨大・単語追加のたびにデプロイ必要になるので不向き、Next.jsで何か別の使える機能ないか
export default function EnglishBotEachWordPage({ id, isMock }: EachWordPageProps) {
  const initWordDetailData = {
    id: -1,
    name: '',
    pronounce: '',
    mean: [],
    word_source: [],
    word_subsource: [],
    synonym: [],
    antonym_original: [],
    antonym_word: []
  };
  const [wordDetail, setWordDetail] = useState<GetWordDetailAPIResponseDto>(initWordDetailData);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    if (!isMock) {
      const accessToken = localStorage.getItem('apiAccessToken') || '';
      Promise.all([
        getPartOfSpeechListAPI(setMessage, setPosList, accessToken),
        getSourceListAPI(setMessage, setSourcelistoption, accessToken)
      ]);
      (async () => {
        const result = (await getWordDetailAPI({ id })).result as GetWordDetailAPIResponseDto;
        setWordDetail(result);
      })();
    }
  }, [id, isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        {wordDetail.id === -1 ? (
          <CircularProgress />
        ) : (
          <Typography variant="h1" component="h1" color="common.black">
            {wordDetail.name}
          </Typography>
        )}

        {/* TODO スタックは共通化できる？ */}
        <MeaningStack posList={posList} wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <SourceStack
          sourceList={sourcelistoption}
          wordDetail={wordDetail}
          setMessage={setMessage}
          setWordDetail={setWordDetail}
        />
        <SubSourceStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <SynonymStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <AntonymStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
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
    paths: new Array(words._max.id + 30)
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
