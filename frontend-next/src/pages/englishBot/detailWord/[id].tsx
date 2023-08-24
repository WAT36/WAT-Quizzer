import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import EnglishBotLayout from '../components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle } from '../../../styles/Pages';
import { useEffect, useState } from 'react';
import { get, getApiAndGetValue } from '@/common/API';

type EachWordPageProps = {
  id: string;
};

export default function EnglishBotEachWordPage({ id }: EachWordPageProps) {
  const [wordName, setWordName] = useState();
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });

  useEffect(() => {
    get(
      '/english/word/' + id,
      (data: any) => {
        if (data.status === 200) {
          const result = data.body?.wordData || [];
          setWordName(result[0].name || '(null)');
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {}
    );
  }, []);

  const makeMeaningStack = () => {
    return <Stack></Stack>;
  };

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

        <Typography variant="h1" component="h1" color="common.black">
          {wordName}
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
          id: String(word.id)
        }
      };
    }),
    fallback: false
  };
}

export async function getStaticProps(context: any) {
  const id = context.params['id'];
  return {
    props: {
      id
    }
  };
}
