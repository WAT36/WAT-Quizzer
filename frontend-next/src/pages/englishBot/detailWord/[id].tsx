import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import {
  GetWordNumResponseDto,
  GetWordDetailAPIResponseDto,
  PullDownOptionDto,
  apiResponsePullDownAdapter,
  PartofSpeechApiResponse,
  SourceApiResponse,
  initWordDetailResponseData
} from 'quizzer-lib';
import {
  getWordDetailAPI,
  getPartOfSpeechListAPI,
  getSourceListAPI,
  toggleWordCheckAPI,
  getWordNumAPI
} from '@/utils/api-wrapper';
import { isMockMode } from '@/utils/api-wrapper';
import { englishDataMock } from 'quizzer-lib';
import { SynonymStack } from '@/components/ui-forms/englishbot/detailWord/synonymStack/SynonymStack';
import { AntonymStack } from '@/components/ui-forms/englishbot/detailWord/antonymStack/AntonymStack';
import { DerivativeStack } from '@/components/ui-forms/englishbot/detailWord/derivativeStack/DerivativeStack';
import { EtymologyStack } from '@/components/ui-forms/englishbot/detailWord/etymologyStack/EtymologyStack';
import { Button } from '@/components/ui-elements/button/Button';
import React from 'react';

type EachWordPageProps = {
  id: string;
  isMock?: boolean;
};
// TODO dynamic routingだとファイル数膨大・単語追加のたびにデプロイ必要になるので不向き、Next.jsで何か別の使える機能ないか
export default function EnglishBotEachWordPage({ id, isMock }: EachWordPageProps) {
  const setMessage = useSetRecoilState(messageState);

  // モック環境用のデータをuseMemoで計算
  const mockData = useMemo(() => {
    if (!(isMock || isMockMode())) return null;

    const mockWordId = parseInt(id);
    // englishWordDetailMockDataをベースに、IDと名前だけを更新
    const mockWordDetail: GetWordDetailAPIResponseDto = {
      ...englishDataMock.wordDetail,
      id: mockWordId,
      name: englishDataMock.words.find((word) => word.id === mockWordId)?.name || englishDataMock.wordDetail.name
    };

    return {
      wordDetail: mockWordDetail,
      posList: englishDataMock.partOfSpeechList.map((pos) => ({
        label: pos.name,
        id: pos.id,
        name: pos.name,
        value: pos.name
      })),
      sourceList: englishDataMock.sourceList.map((source) => ({
        label: source.name,
        id: source.id,
        name: source.name,
        value: source.name
      }))
    };
  }, [id, isMock]);

  // モック環境では初期値を設定、本番環境では空の初期値
  const [wordDetail, setWordDetail] = useState<GetWordDetailAPIResponseDto>(
    mockData?.wordDetail || initWordDetailResponseData
  );
  const [posList, setPosList] = useState<PullDownOptionDto[]>(mockData?.posList || []);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionDto[]>(mockData?.sourceList || []);

  useEffect(() => {
    if (isMock || isMockMode()) {
      // モック環境では既に初期値が設定されているため、何もしない
      return;
    }

    // 本番環境では従来通りAPIを呼び出し
    Promise.all([
      (async () => {
        const result = await getPartOfSpeechListAPI();
        result.result && setPosList(apiResponsePullDownAdapter(result.result as PartofSpeechApiResponse[]));
      })(),
      (async () => {
        const result = await getSourceListAPI();
        result.result && setSourcelistoption(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
      })()
    ]);
    (async () => {
      const result = (await getWordDetailAPI({ id })).result as GetWordDetailAPIResponseDto;
      setWordDetail(result);
    })();
  }, [id, isMock]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <>
            <Typography variant="h1" component="h1" color="text.primary">
              {wordDetail.name}
              <Typography variant="h4" component="span">
                {wordDetail.checked ? '✅' : ''}
              </Typography>
            </Typography>
            <Button
              label={'チェック反転'}
              attr={'button-array'}
              variant="contained"
              color="warning"
              disabled={wordDetail.id === -1 || isMock || isMockMode()}
              onClick={async (e) => {
                if (isMock || isMockMode()) {
                  setMessage({
                    message: 'モック環境ではチェック反転は無効です',
                    messageColor: 'warning',
                    isDisplay: true
                  });
                  return;
                }

                setMessage({
                  message: '通信中...',
                  messageColor: '#d3d3d3',
                  isDisplay: true
                });
                const result = await toggleWordCheckAPI({
                  toggleCheckData: {
                    wordId: wordDetail.id
                  }
                });
                setMessage(result.message);
                if (result.message.messageColor === 'success.light') {
                  const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                    .result as GetWordDetailAPIResponseDto;
                  setWordDetail && setWordDetail(newWordDetail);
                }
              }}
            />
          </>
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
        <DerivativeStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <EtymologyStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'各単語詳細'} />;
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
      id: params.id,
      isMock: process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
    }
  };
}

// 一番最初に実行される関数
export async function getStaticPaths() {
  // モック環境かどうかを判定
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

  if (isMockMode) {
    // モック環境では固定の単語数を使用（サンプルデータの単語数に基づく）
    const mockWordCount = 5; // sample-english-data.jsonの単語数

    return {
      paths: new Array(mockWordCount)
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

  // 本番環境では従来通りAPIから取得。失敗時は静的生成をスキップ。
  let words: GetWordNumResponseDto | undefined;
  // TODO words/num APIが効かない時の再実行・暫定措置で繰り返し処理を設けたが、もっといい方法あるはずなので探して欲しい
  for (let i = 0; i < 5; i++) {
    try {
      const res = await getWordNumAPI({});
      words = res.result as GetWordNumResponseDto | undefined;
      console.log(`words[${i + 1}]:`, JSON.stringify(words));
      if (words) break;
    } catch (error) {
      console.warn('Failed to fetch words/num', error);
    }
  }

  if (!words || !words._max || typeof words._max.id !== 'number') {
    console.warn('words/num response is invalid. Skipping static paths generation.');
    return { paths: [], fallback: false };
  }
  return {
    paths: new Array(words!._max.id + 30)
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
