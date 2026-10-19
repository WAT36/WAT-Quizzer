import { Inter } from 'next/font/google';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import type { GetSayingResponse } from 'quizzer-lib';
import { initSayingResponseData } from 'quizzer-lib';
import { getSayingAPI } from '@/utils/api-wrapper';
import { Title } from '@/components/ui-elements/title/Title';
import { TopButtonGroup } from '@/components/ui-forms/top/topButtonGroup/TopButtonGroup';
import { SayingCard } from '@/components/ui-forms/top/sayingCard/SayingCard';
import { TodoList } from '@/components/ui-forms/top/todoList/TodoList';
import React from 'react';
import { Layout } from '@/components/templates/layout/Layout';

const inter = Inter({ subsets: ['latin'] });

type Props = {};

export default function Top({}: Props) {
  const [saying, setSaying] = useState<GetSayingResponse>(initSayingResponseData);

  useEffect(() => {
    void Promise.all([
      (async () => {
        const result = await getSayingAPI({ getSayingRequestData: {} });
        result.result && setSaying(result.result as GetSayingResponse);
      })()
    ]);
  }, []);

  const content = (
    <Container>
      <Title label="WAT Quizzer"></Title>
      <TopButtonGroup />
      <SayingCard sayingResponse={saying} setSaying={setSaying} />
      <TodoList />
    </Container>
  );

  return <Layout mode="top" contents={content} title={''} />;
}

export async function getStaticProps() {
  return {
    props: {
      isMock: process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
    }
  };
}
