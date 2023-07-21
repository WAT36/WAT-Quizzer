import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { messageColorType } from '../../interfaces/MessageColorType';
import { buttonStyle, messageBoxStyle, typoStyles } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';

export default function AddQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [input_data, setInputData] = useState<string>('');
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<messageColorType>('initial');
  const [addLog, setAddLog] = useState<any>();
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();

  useEffect(() => {
    get('/quiz/file', (data: any) => {
      if (data.status === 200) {
        data = data.body;
        let filelist = [];
        for (var i = 0; i < data.length; i++) {
          filelist.push(
            <MenuItem value={data[i].file_num} key={data[i].file_num}>
              {data[i].file_nickname}
            </MenuItem>
          );
        }
        setFilelistoption(filelist);
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました');
        setMessageColor('error');
      }
    });
  });

  const selectedFileChange = (e: any) => {
    setFileNum(e.target.value);
  };

  const addQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    } else if (!input_data || input_data === '') {
      setMessage('エラー:追加する問題を入力して下さい');
      setMessageColor('error');
      return;
    }

    post(
      '/quiz/add',
      {
        file_num: file_num,
        data: input_data
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body;
          setMessage('　');
          setMessageColor('initial');
          setAddLog(data);
          //入力データをクリア
          const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
          if (inputQuizField) {
            inputQuizField.value = '';
          }
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>WAT Quizzer</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={messageColor}>
              {message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
            <Select
              labelId="quiz-file-name"
              id="quiz-file-id"
              defaultValue={-1}
              // value={age}
              onChange={(e) => selectedFileChange(e)}
            >
              <MenuItem value={-1} key={-1}>
                選択なし
              </MenuItem>
              {filelistoption}
            </Select>
          </FormControl>

          <Typography variant="h6" component="h6" style={messageBoxStyle}>
            追加する問題（形式：テスト問題,正解,カテゴリ,画像ファイル名）
          </Typography>

          <TextField
            label="追加問題入力"
            className="input-quiz-fields"
            multiline
            placeholder="追加する問題（形式：テスト問題,正解,カテゴリ,画像ファイル名）を何行でも"
            minRows={6}
            variant="outlined"
            onChange={(e) => setInputData(e.target.value)}
          />
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => addQuiz()}>
          送信
        </Button>

        <Card variant="outlined">
          <CardContent>
            <Typography style={typoStyles} color="textSecondary" gutterBottom>
              --実行ログ--
            </Typography>
            <Typography variant="h6" component="h6">
              {addLog}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <QuizzerLayout contents={contents()} />
    </>
  );
}
