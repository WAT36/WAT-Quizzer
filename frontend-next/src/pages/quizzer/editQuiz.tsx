import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { messageColorType } from '../../interfaces/MessageColorType';
import { buttonStyle, messageBoxStyle } from '../../styles/Pages';
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
  TextField,
  Typography
} from '@mui/material';

export default function EditQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<messageColorType>('common.black');
  const [quiz_num, setQuizNum] = useState<number>();
  const [edit_file_num, setEditFileNum] = useState<number>();
  const [edit_quiz_num, setEditQuizNum] = useState<number>();
  const [edit_question, setEditQuestion] = useState<string>();
  const [edit_answer, setEditAnswer] = useState<string>();
  const [edit_category, setEditCategory] = useState<string>();
  const [edit_image, setEditImage] = useState<string>();
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
  }, []);

  const getQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    } else if (!quiz_num) {
      setMessage('エラー:問題番号を入力して下さい');
      setMessageColor('error');
      return;
    }

    get(
      '/quiz',
      (data: any) => {
        if (data.status === 404 || data.body.length === 0) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else if (data.status === 200) {
          data = data.body;
          setEditFileNum(data[0].file_num);
          setEditQuizNum(data[0].quiz_num);
          setEditQuestion(data[0].quiz_sentense);
          setEditAnswer(data[0].answer);
          setEditCategory(data[0].category);
          setEditImage(data[0].img_file);
          setMessage('　');
          setMessageColor('success.light');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(file_num),
        quiz_num: String(quiz_num)
      }
    );
  };

  const editQuiz = () => {
    post(
      '/quiz/edit',
      {
        file_num: edit_file_num,
        quiz_num: edit_quiz_num,
        question: edit_question,
        answer: edit_answer,
        category: edit_category,
        img_file: edit_image
      },
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          data = data.body;
          setEditFileNum(-1);
          setEditQuizNum(-1);
          setEditQuestion('');
          setEditAnswer('');
          setEditCategory('');
          setEditImage('');
          setMessage('Success!! 編集に成功しました');
          setMessageColor('success.light');
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
              onChange={(e) => {
                setFileNum(Number(e.target.value));
              }}
            >
              <MenuItem value={-1} key={-1}>
                選択なし
              </MenuItem>
              {filelistoption}
            </Select>
          </FormControl>

          <FormControl>
            <TextField
              label="問題番号"
              onChange={(e) => {
                setQuizNum(Number(e.target.value));
              }}
            />
          </FormControl>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => getQuiz()}>
          問題取得
        </Button>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              ファイル：
              {edit_file_num === -1 ? '' : edit_file_num}
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              問題番号：
              {edit_quiz_num === -1 ? '' : edit_quiz_num}
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              問題　　：
              <Input fullWidth maxRows={1} value={edit_question} onChange={(e) => setEditQuestion(e.target.value)} />
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              答え　　：
              <Input fullWidth maxRows={1} value={edit_answer} onChange={(e) => setEditAnswer(e.target.value)} />
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              カテゴリ：
              <Input fullWidth maxRows={1} value={edit_category} onChange={(e) => setEditCategory(e.target.value)} />
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              画像ファイル：
              <Input fullWidth maxRows={1} value={edit_image} onChange={(e) => setEditImage(e.target.value)} />
            </Typography>
          </CardContent>
        </Card>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => editQuiz()}>
          更新
        </Button>
      </Container>
    );
  };

  return (
    <>
      <QuizzerLayout contents={contents()} />
    </>
  );
}
