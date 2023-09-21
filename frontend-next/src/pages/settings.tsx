import Head from 'next/head';
import { Inter } from 'next/font/google';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import { topButtonStyle } from '../styles/Pages';
import { useEffect, useState } from 'react';
import { get, post } from '@/common/API';
import { messageBoxStyle } from '../styles/Pages';
import { GetSelfHelpBookResponse, ProcessingApiReponse } from '../../interfaces/api/response';

const inter = Inter({ subsets: ['latin'] });

const cardStyle = {
  margin: '10px 0'
};

const cardContentStyle = {
  display: 'flex',
  width: '100%'
};

const inputTextBeforeButtonStyle = {
  flex: 'auto'
};

const buttonAfterInputTextStyle = {
  flex: 'none',
  margin: '10px'
};

export default function Settings() {
  const [booklistoption, setBooklistoption] = useState<JSX.Element[]>();
  const [bookName, setBookName] = useState<string>();
  const [selectedBookId, setSelectedBookId] = useState<number>();
  const [inputSaying, setInputSaying] = useState<string>();
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });

  useEffect(() => {
    getBook();
  }, []);

  const getBook = () => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    get('/saying/book', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetSelfHelpBookResponse[] = data.body as GetSelfHelpBookResponse[];
        let booklist = [];
        for (var i = 0; i < result.length; i++) {
          booklist.push(
            <MenuItem value={result[i].id} key={result[i].id}>
              {result[i].name}
            </MenuItem>
          );
        }
        setBooklistoption(booklist);
        setMessage({ message: '　', messageColor: 'common.black' });
      } else {
        setMessage({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
      }
    });
  };

  const addBook = () => {
    if (!bookName || bookName === '') {
      setMessage({ message: 'エラー:本名を入力して下さい', messageColor: 'error' });
      return;
    }

    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    post(
      '/saying/book',
      {
        book_name: bookName
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({ message: `新規ファイル「${bookName}」を追加しました`, messageColor: 'success.light' });
        } else {
          setMessage({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
        }
      }
    );
    getBook();
  };

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setSelectedBookId(+e.target.value);
  };

  const addSaying = () => {
    if (!selectedBookId) {
      setMessage({ message: 'エラー:本名を選択して下さい', messageColor: 'error' });
      return;
    } else if (!inputSaying || inputSaying === '') {
      setMessage({ message: 'エラー:格言を入力して下さい', messageColor: 'error' });
      return;
    }

    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    post(
      '/saying',
      {
        book_id: selectedBookId,
        saying: inputSaying
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({ message: `新規格言「${inputSaying}」を追加しました`, messageColor: 'success.light' });
        } else {
          setMessage({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
        }
      }
    );
    getBook();
  };

  return (
    <>
      <Head>
        <title>設定</title>
        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Container>
        <h1>WAT Quizzer - 設定</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" style={cardStyle}>
          <CardHeader title="格言設定" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="新規追加 - 啓発本" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="新規啓発本名"
                  variant="outlined"
                  onChange={(e) => {
                    setBookName(e.target.value);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => addBook()}>
                  追加
                </Button>
              </CardContent>
              <CardHeader subheader="格言追加" />

              <CardContent style={cardContentStyle}>
                <Select
                  labelId="quiz-file-name"
                  id="quiz-file-id"
                  defaultValue={-1}
                  onChange={(e) => selectedFileChange(e)}
                  style={{ width: '20%', margin: '2px 0' }}
                >
                  <MenuItem value={-1} key={-1}>
                    選択なし
                  </MenuItem>
                  {booklistoption}
                </Select>
              </CardContent>
              <CardContent style={cardContentStyle}>
                <TextField
                  label="新規格言"
                  variant="outlined"
                  onChange={(e) => {
                    setInputSaying(e.target.value);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => addSaying()}>
                  登録
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
