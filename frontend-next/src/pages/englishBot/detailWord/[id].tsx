import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { messageBoxStyle } from '../../../styles/Pages';
import { useEffect, useState } from 'react';
import { get, getApiAndGetValue, patch } from '@/common/API';
import {
  EnglishWordByIdApiResponse,
  EnglishWordSourceByIdApiResponse,
  ProcessingApiReponse
} from '../../../../interfaces/api/response';
import { PartofSpeechApiResponse, SourceApiResponse, WordApiResponse } from '../../../../interfaces/db';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState } from '../../../../interfaces/state';
import { getSourceList } from '@/common/response';

type EachWordPageProps = {
  id: string;
};

type wordMeanData = {
  partofspeechId: number;
  partofspeechName: string;
  wordmeanId: number;
  meanId: number;
  mean: string;
  sourceId: number;
  sourceName: string;
};

type wordSourceData = {
  wordId: number;
  wordName: string;
  sourceId: number;
  sourceName: string;
};

type editWordMeanData = {
  wordId: number;
  wordmeanId: number;
  partofspeechId: number;
  mean: string;
  sourceId: number;
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
  const [wordName, setWordName] = useState<string>();
  const [meanData, setMeanData] = useState<wordMeanData[]>([]);
  const [wordSourceData, setWordSourceData] = useState<wordSourceData[]>([]);
  const [open, setOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [posList, setPosList] = useState<JSX.Element[]>([]);
  //const [sourceList, setSourceList] = useState<JSX.Element[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [inputEditData, setInputEditData] = useState<editWordMeanData | undefined>();
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });
  const handleOpen = (x: wordMeanData) => {
    setOpen(true);
    setInputEditData({
      wordId: +id,
      wordmeanId: x.wordmeanId,
      partofspeechId: x.partofspeechId,
      mean: x.mean,
      sourceId: x.sourceId
    });
  };
  const handleClose = () => {
    setOpen(false);
    setInputEditData(undefined);
  };
  const handleSourceModalOpen = () => {
    setSourceModalOpen(true);
  };
  const handleSourceModalClose = () => {
    setSourceModalOpen(false);
  };

  useEffect(() => {
    Promise.all([
      getPartOfSpeechList(),
      getSourceList(setMessage, setSourcelistoption),
      get(
        '/english/word/' + id,
        (data: ProcessingApiReponse) => {
          if (data.status === 200) {
            const result: EnglishWordByIdApiResponse[] = data.body as EnglishWordByIdApiResponse[];
            const wordmeans: wordMeanData[] = result.map((x: EnglishWordByIdApiResponse) => {
              return {
                partofspeechId: x.partsofspeech_id,
                partofspeechName: x.partsofspeech,
                wordmeanId: x.wordmean_id,
                meanId: x.mean_id,
                mean: x.meaning,
                sourceId: x.source_id,
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
      ),
      get(
        '/english/word/source/' + id,
        (data: ProcessingApiReponse) => {
          if (data.status === 200) {
            const result: EnglishWordSourceByIdApiResponse[] = data.body as EnglishWordSourceByIdApiResponse[];
            const wordsources: wordSourceData[] = result.map((x: EnglishWordSourceByIdApiResponse) => {
              return {
                wordId: x.word_id,
                wordName: x.word_name,
                sourceId: x.source_id,
                sourceName: x.source_name
              };
            });
            setWordSourceData(wordsources);
          } else {
            setMessage({
              message: 'エラー:外部APIとの連携に失敗しました',
              messageColor: 'error'
            });
          }
        },
        {}
      )
    ]);
  }, [id]);

  // 品詞リスト取得
  const getPartOfSpeechList = async () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get('/english/partsofspeech', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: PartofSpeechApiResponse[] = data.body as PartofSpeechApiResponse[];
        let gotPosList = [];
        for (var i = 0; i < result.length; i++) {
          gotPosList.push(
            <MenuItem value={result[i].id} key={result[i].id}>
              {result[i].name}
            </MenuItem>
          );
        }
        gotPosList.push(
          <MenuItem value={-2} key={-2}>
            {'その他'}
          </MenuItem>
        );
        setPosList(gotPosList);
        setMessage({
          message: '　',
          messageColor: 'common.black'
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    });
  };

  // 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displayPosInput = (i: number) => {
    return (
      <>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={inputEditData?.partofspeechId || -1}
          label="partOfSpeech"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            const inputtedData = Object.assign({}, inputEditData);
            inputtedData.partofspeechId = Number(e.target.value);
            setInputEditData(inputtedData);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {posList}
        </Select>
      </>
    );
  };

  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = (i: number) => {
    return (
      <>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={inputEditData?.sourceId || -1}
          label="source"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            const inputtedData = Object.assign({}, inputEditData);
            inputtedData.sourceId = Number(e.target.value);
            setInputEditData(inputtedData);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {sourcelistoption.map((x) => (
            <MenuItem value={x.value} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  };

  const editSubmit = (meanId: number) => {
    patch(
      '/english/word/' + String(inputEditData?.wordId),
      {
        wordId: inputEditData?.wordId,
        wordMeanId: inputEditData?.wordmeanId,
        meanId,
        partofspeechId: inputEditData?.partofspeechId,
        meaning: inputEditData?.mean,
        sourceId: inputEditData?.sourceId
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    );
    handleClose();
  };

  const makeMeaningStack = () => {
    return (
      <Card>
        <Typography align="left" variant="h4" component="p">
          {'意味'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {meanData.map((x) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={x.wordmeanId}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" sx={{ fontSize: 14 }} color="text.secondary" component="p">
                        {`[${x.partofspeechName}]`}
                      </Typography>
                      <Typography align="left" variant="h5" component="p">
                        {x.mean}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button variant="outlined" onClick={(e) => handleOpen(x)}>
                        編集
                      </Button>
                    </Typography>
                  </Typography>
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
                      <Typography sx={{ mt: 2 }}>
                        品詞：
                        {displayPosInput(1)}
                      </Typography>
                      <Typography sx={{ mt: 2 }}>
                        意味：
                        <TextField
                          variant="outlined"
                          defaultValue={x.mean}
                          onChange={(e) => {
                            const inputtedData = Object.assign({}, inputEditData);
                            inputtedData.mean = e.target.value;
                            setInputEditData(inputtedData);
                          }}
                        />
                      </Typography>
                      <Typography sx={{ mt: 2 }}>
                        出典：
                        {displaySourceInput(3)}
                      </Typography>
                      <Button variant="contained" onClick={(e) => editSubmit(x.meanId)}>
                        更新
                      </Button>
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
        {makeSourceStack()}
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'各単語詳細'} />
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
