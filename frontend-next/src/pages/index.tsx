import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { get } from '@/common/API';
import { GetPopularEventResponse, GetRandomSayingResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { Title } from '@/components/ui-elements/title/Title';
import { dbHealthCheck } from '@/common/health';
import { TopButtonGroup } from '@/components/ui-forms/top/topButtonGroup/TopButtonGroup';
import { SayingCard } from '@/components/ui-forms/top/sayingCard/SayingCard';
import { DbHealthCheckState, SayingState } from '../../interfaces/state';
import { DbHealthCheckCard } from '@/components/ui-forms/top/dbHealthCheckCard/DbHealthCheckCard';
import { getPopularEventList } from '@/common/response';
import { PopularEventList } from '@/components/ui-forms/top/popularEventList/popularEventList';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  isMock?: boolean;
};

export default function Top({ isMock }: Props) {
  const [saying, setSaying] = useState<SayingState>({
    saying: '(取得中...)',
    explanation: '(取得中...)',
    name: '(取得中...)',
    color: 'grey.200'
  });
  const [dbHealth, setDbHealth] = useState<DbHealthCheckState>({
    status: '(取得中...)',
    color: 'grey.200'
  });
  const [eventList, setEventList] = useState<GetPopularEventResponse[]>([
    {
      name: '取得中...',
      link: ''
    }
  ]);

  useEffect(() => {
    !isMock &&
      Promise.all([
        get('/saying', (data: ProcessingApiReponse) => {
          if (data.status === 200) {
            const result: GetRandomSayingResponse[] = data.body as GetRandomSayingResponse[];
            setSaying({
              saying: result[0].saying,
              explanation: result[0].explanation,
              name: `出典：${result[0].name}`,
              color: 'common.black'
            });
          }
        }),
        executeDbHealthCheck(),
        getPopularEventList(setEventList)
      ]);
  }, [isMock]);

  // DB ヘルスチェック
  const executeDbHealthCheck = async () => {
    const result = await dbHealthCheck();
    setDbHealth(result);
  };

  return (
    <>
      <Head>
        <title>WAT Quizzer</title>
        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Container>
        <Title label="WAT Quizzer"></Title>
        <TopButtonGroup />
        <SayingCard sayingState={saying} />
        <DbHealthCheckCard dbHealthCheckState={dbHealth} />
        <PopularEventList eventList={eventList} />
      </Container>
    </>
  );
}
