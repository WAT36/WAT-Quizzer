import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import type { GetWordDetailAPIResponseDto, PullDownOptionDto, PartofSpeechApiResponse } from 'quizzer-lib';
import { apiResponsePullDownAdapter, initWordDetailResponseData } from 'quizzer-lib';
import { getPartOfSpeechListAPI, toggleWordCheckAPI } from '@/utils/api-wrapper';
import { isMockMode } from '@/utils/api-wrapper';
import { englishDataMock } from 'quizzer-lib';
import { SynonymStack } from '@/components/ui-forms/englishbot/detailWord/synonymStack/SynonymStack';
import { AntonymStack } from '@/components/ui-forms/englishbot/detailWord/antonymStack/AntonymStack';
import { DerivativeStack } from '@/components/ui-forms/englishbot/detailWord/derivativeStack/DerivativeStack';
import { EtymologyStack } from '@/components/ui-forms/englishbot/detailWord/etymologyStack/EtymologyStack';
import { Button } from '@/components/ui-elements/button/Button';
import React from 'react';
import { useWordDetail } from '@/hooks/useWordDetail';
import { useSourceList } from '@/hooks/useSourceList';

type EachWordContentsProps = {
  id: string;
  isMock?: boolean;
};

type EachWordPageProps = Partial<EachWordContentsProps>;

const EachWordContents = ({ id, isMock }: EachWordContentsProps) => {
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
  const { wordDetail, refetchWordDetail } = useWordDetail(id, mockData?.wordDetail || initWordDetailResponseData);
  const [posList, setPosList] = useState<PullDownOptionDto[]>(mockData?.posList || []);
  const { sourceList } = useSourceList(isMock || isMockMode(), mockData?.sourceList);

  useEffect(() => {
    if (isMock || isMockMode()) {
      // モック環境では既に初期値が設定されているため、何もしない
      return;
    }

    // 本番環境では従来通りAPIを呼び出し
    void (async () => {
      const result = await getPartOfSpeechListAPI();
      result.result && setPosList(apiResponsePullDownAdapter(result.result as PartofSpeechApiResponse[]));
    })();
    void refetchWordDetail();
  }, [id, isMock, refetchWordDetail]);

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
                if (result.isSuccess) {
                  await refetchWordDetail();
                }
              }}
            />
          </>
        )}

        <MeaningStack posList={posList} wordDetail={wordDetail} setMessage={setMessage} onUpdated={refetchWordDetail} />
        <SourceStack
          sourceList={sourceList}
          wordDetail={wordDetail}
          setMessage={setMessage}
          onUpdated={refetchWordDetail}
        />
        <SubSourceStack wordDetail={wordDetail} setMessage={setMessage} onUpdated={refetchWordDetail} />
        <SynonymStack wordDetail={wordDetail} setMessage={setMessage} onUpdated={refetchWordDetail} />
        <AntonymStack wordDetail={wordDetail} setMessage={setMessage} onUpdated={refetchWordDetail} />
        <DerivativeStack wordDetail={wordDetail} setMessage={setMessage} onUpdated={refetchWordDetail} />
        <EtymologyStack wordDetail={wordDetail} setMessage={setMessage} onUpdated={refetchWordDetail} />
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'各単語詳細'} />;
};

// ページは全単語で共通の1ファイルなので、idはURLから読む。URLはブラウザで開くまで分からないため、最初の描画ではidが未確定になる
export default function EnglishBotEachWordPage({ id, isMock }: EachWordPageProps) {
  const router = useRouter();
  const wordId = id ?? router.query.id;

  if (typeof wordId !== 'string') {
    return <Layout mode="englishBot" contents={<CircularProgress aria-label="読み込み中" />} title={'各単語詳細'} />;
  }

  return <EachWordContents key={wordId} id={wordId} isMock={isMock} />;
}
