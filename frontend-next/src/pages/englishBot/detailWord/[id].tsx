import { Box, Button, Card, Container, Modal, Paper, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { getApiAndGetValue } from '@/common/API';
import { WordApiResponse } from '../../../../interfaces/db';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/templates/layout/Layout';
import {
  EditWordMeanData,
  MessageState,
  PullDownOptionState,
  WordMeanData,
  WordSourceData
} from '../../../../interfaces/state';
import { getPartOfSpeechList, getSourceList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { getWordDetail, getWordSource } from '@/pages/api/english';

type EachWordPageProps = {
  id: string;
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
  const [wordName, setWordName] = useState<string>('');
  const [meanData, setMeanData] = useState<WordMeanData[]>([]);
  const [wordSourceData, setWordSourceData] = useState<WordSourceData[]>([]);
  const [open, setOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [inputEditData, setInputEditData] = useState<EditWordMeanData | undefined>();
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black'
  });

  const handleSourceModalOpen = () => {
    setSourceModalOpen(true);
  };
  const handleSourceModalClose = () => {
    setSourceModalOpen(false);
  };

  useEffect(() => {
    Promise.all([
      getPartOfSpeechList(setMessage, setPosList),
      getSourceList(setMessage, setSourcelistoption),
      getWordDetail(id, setMessage, setWordName, setMeanData),
      getWordSource(id, setMessage, setWordSourceData)
    ]);
  }, [id]);

  const makeSourceStack = () => {
    return (
      <Card>
        <Typography align="left" variant="h4" component="p">
          {'出典'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {wordSourceData.map((x) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={x.wordId}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" variant="h5" component="p">
                        {x.sourceName}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button variant="outlined" onClick={(e) => handleSourceModalOpen()}>
                        編集
                      </Button>
                    </Typography>
                  </Typography>
                  <Modal
                    open={sourceModalOpen}
                    onClose={handleSourceModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={mordalStyle}>
                      <Typography id="modal-modal-title" variant="h4" component="h4">
                        出典編集
                      </Typography>
                      {/* <Typography sx={{ mt: 2 }}>{displaySourceInput(3)}</Typography>
                      <Button variant="contained">更新</Button> */}
                    </Box>
                  </Modal>
                </Item>
              );
            })}
          </Stack>
        </Box>
      </Card>
    );
  };

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        <Typography variant="h1" component="h1" color="common.black">
          {wordName}
        </Typography>

        <MeaningStack
          id={id}
          posList={posList}
          sourceList={sourcelistoption}
          meanData={meanData}
          modalIsOpen={open}
          inputEditData={inputEditData}
          setMessage={setMessage}
          setModalIsOpen={setOpen}
          setInputEditData={setInputEditData}
        />
        {makeSourceStack()}
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'各単語詳細'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}

export async function getAllWords() {
  const words = await getApiAndGetValue('/english/word');
  return await words.json();
}

export async function getStaticPaths() {
  const words: WordApiResponse[] = (await getAllWords()) as WordApiResponse[];
  return {
    paths: Object.values(words).map((word: WordApiResponse) => {
      return {
        params: {
          id: String(word.id)
        }
      };
    }),
    fallback: false
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const id = params!.id;
  return {
    props: {
      id
    }
  };
}
