import { Box, Button, Card, CardContent, Container, Modal, Paper, Stack, Typography, styled } from '@mui/material';
import EnglishBotLayout from '../components/EnglishBotLayout';
import { messageBoxStyle } from '../../../styles/Pages';
import { useEffect, useState } from 'react';
import { get, getApiAndGetValue } from '@/common/API';

type EachWordPageProps = {
  id: string;
};

type wordMeanData = {
  partofspeechName: string;
  mean: string;
  sourceName: string;
};

const mordalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

export default function EnglishBotEachWordPage({ id }: EachWordPageProps) {
  const [wordName, setWordName] = useState();
  const [meanData, setMeanData] = useState<wordMeanData[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
          const wordmeans: wordMeanData[] = result.map((x: any) => {
            return {
              partofspeechName: x.partsofspeech,
              mean: x.meaning,
              sourceName: x.source_name
            };
          });
          setWordName(result[0].name || '(null)');
          setMeanData(wordmeans);
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
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {meanData.map((x) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Item>
                {`[${x.partofspeechName}]`}
                {x.mean}
                {'  '}
                <Button variant="outlined" onClick={handleOpen}>
                  編集
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={mordalStyle}>
                    <Typography id="modal-modal-title" variant="h4" component="h4">
                      意味編集
                    </Typography>
                    <Typography sx={{ mt: 2 }}>品詞：{x.partofspeechName}</Typography>
                    <Typography sx={{ mt: 2 }}>意味：{x.mean}</Typography>
                    <Typography sx={{ mt: 2 }}>出典：{x.sourceName}</Typography>
                  </Box>
                </Modal>
              </Item>
            );
          })}
        </Stack>
      </Box>
    );
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

        {makeMeaningStack()}
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
