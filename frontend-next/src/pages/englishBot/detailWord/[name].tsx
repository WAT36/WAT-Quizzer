import { Button, Card, CardContent, Container, FormControl, FormGroup, TextField, Typography } from '@mui/material';
import EnglishBotLayout from '../components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle } from '../../../styles/Pages';
import { useState } from 'react';
import { get, getApiAndGetValue } from '@/common/API';

type EachWordPageProps = {
  name: string;
};

export default function EnglishBotEachWordPage({ name }: EachWordPageProps) {
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });

  const contents = () => {
    return (
      <Container>
        <h1>Detail Word</h1>
        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" component="h6" color={message.messageColor}>
          {'名前：' + name}
        </Typography>
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} />
    </>
  );
}

export async function getAllWords() {
  const words = await getApiAndGetValue('/english/word');
  return await words.json();
}

export async function getStaticPaths() {
  const words = await getAllWords();

  return {
    paths: words.wordData.map((word: any) => {
      return {
        params: {
          name: word.name
        }
      };
    }),
    fallback: false
  };
}

export async function getStaticProps(context: any) {
  const name = context.params['name'];
  return {
    props: {
      name
    }
  };
}
