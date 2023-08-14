import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { buttonStyle, messageBoxStyle, typoStyles } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { addQuizDto } from '../../interfaces/quizzer/addQuizDto';

export default function AddQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [input_data, setInputData] = useState<addQuizDto>({});
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
  const [addLog, setAddLog] = useState<any>();
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();

  useEffect(() => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
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
        setMessage('　');
        setMessageColor('common.black');
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました');
        setMessageColor('error');
      }
    });
  }, []);

  const selectedFileChange = (e: any) => {
    setFileNum(e.target.value);
  };

  const addQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    } else if (!input_data.question || !input_data.answer) {
      setMessage('エラー:追加する問題文・正解を入力して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    post(
      '/quiz/add',
      {
        file_num,
        input_data
      },
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          data = data.body;
          setMessage('Success!! 問題を追加できました!');
          setMessageColor('success.light');
          setAddLog(data);
          setInputData({});
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

  // 入力データを登録
  const updateInputData = (attrName: string, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [attrName]: value
    }));
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

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                追加する問題（問題文,正解,カテゴリ,画像ファイル名）
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                問題文　：
                <Input
                  fullWidth
                  maxRows={1}
                  value={input_data.question || ''}
                  onChange={(e) => updateInputData('question', e.target.value)}
                />
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                答え　　：
                <Input
                  fullWidth
                  maxRows={1}
                  value={input_data.answer || ''}
                  onChange={(e) => updateInputData('answer', e.target.value)}
                />
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                カテゴリ：
                <Input
                  fullWidth
                  maxRows={1}
                  value={input_data.category || ''}
                  onChange={(e) => updateInputData('category', e.target.value)}
                />
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                画像ファイル名：
                <Input
                  fullWidth
                  maxRows={1}
                  value={input_data.img_file || ''}
                  onChange={(e) => updateInputData('img_data', e.target.value)}
                />
              </Typography>
            </CardContent>
          </Card>
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
