import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { topButtonStyle } from '../styles/Pages';
import { useEffect, useState } from 'react';
import { get } from '@/common/API';

const inter = Inter({ subsets: ['latin'] });

export default function Top() {
  const [saying, setSaying] = useState({
    saying: '(取得中...)',
    color: 'grey.200'
  });

  useEffect(() => {
    get('/saying', (data: any) => {
      if (data.status === 200) {
        data = data.body;
        setSaying({
          saying: data[0].saying,
          color: 'common.black'
        });
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>WAT Quizzer</title>
        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Container>
        <h1>WAT Quizzer</h1>
        <div>
          <Button
            style={topButtonStyle}
            variant="contained"
            size="large"
            color="primary"
            href={'/quizzer' + process.env.NEXT_PUBLIC_URL_END}
          >
            Quizzer
          </Button>
          <Button
            style={topButtonStyle}
            variant="contained"
            size="large"
            color="secondary"
            href={'/englishBot' + process.env.NEXT_PUBLIC_URL_END}
          >
            English Quiz Bot
          </Button>
        </div>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h6" color="grey.700">
              今回の格言
            </Typography>
            <Typography variant="h2" component="p" color={saying.color}>
              {saying.saying}
            </Typography>
            <Typography variant="subtitle1" component="p" color="grey.500">
              出典
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
