import { Button, Card, CardContent, Container, FormControl, FormGroup, TextField, Typography } from '@mui/material';
import EnglishBotLayout from '../components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle } from '../../../styles/Pages';
import { useState } from 'react';

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

export async function getStaticPaths() {
  // const notes = getAllNotes(["slug"]);
  const words = [
    {
      name: 'test'
    }
  ];

  return {
    paths: words.map((word) => {
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
