import React, { useEffect, useState } from 'react';

import { del, get, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { messageColorType } from '../../interfaces/MessageColorType';
import { buttonStyle, messageBoxStyle, paperStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';

export default function DeleteQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<messageColorType>('initial');
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();
  const [quiz_num, setQuizNum] = useState<number>();
  const [get_file_num, setGetFileNum] = useState<number | null>();
  const [get_quiz_num, setGetQuizNum] = useState<number | null>();
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [image, setImage] = useState<string>();
  const [integrate_to_quiz_num, setIntegrateToQuizNum] = useState<number | null>();
  const [integrate_to_question, setIntegrateToQuestion] = useState<string>();
  const [integrate_to_answer, setIntegrateToAnswer] = useState<string>();
  const [integrate_to_category, setIntegrateToCategory] = useState<string>();
  const [integrate_to_image, setIntegrateToImage] = useState<string>();

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
        if (data.status === 200) {
          data = data.body;
          setGetFileNum(data[0].file_num);
          setGetQuizNum(data[0].quiz_num);
          setQuestion(data[0].quiz_sentense);
          setAnswer(data[0].answer);
          setCategory(data[0].category);
          setImage(data[0].img_file);
          setMessage('　');
          setMessageColor('initial');
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
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

  const getIntegrateToQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    } else if (!integrate_to_quiz_num) {
      setMessage('エラー:問題番号を入力して下さい');
      setMessageColor('error');
      return;
    }

    get(
      '/quiz',
      (data: any) => {
        if (data.status === 200) {
          data = data.body;
          setIntegrateToQuizNum(data[0].quiz_num);
          setIntegrateToQuestion(data[0].quiz_sentense);
          setIntegrateToAnswer(data[0].answer);
          setIntegrateToCategory(data[0].category);
          setIntegrateToImage(data[0].img_file);
          setMessage('　');
          setMessageColor('initial');
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(get_file_num),
        quiz_num: String(integrate_to_quiz_num)
      }
    );
  };

  const deleteQuiz = () => {
    if (get_file_num == null || get_quiz_num == null) {
      setMessage('エラー:削除する問題を取得して下さい');
      setMessageColor('error');
      return;
    }

    del(
      '/quiz',
      {
        file_num: get_file_num,
        quiz_num: get_quiz_num
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body;
          let quiz_num = '[' + get_file_num + '-' + get_quiz_num + ']';
          setMessage('Success! 削除に成功しました' + quiz_num);
          setMessageColor('initial');
          setGetFileNum(null);
          setGetQuizNum(null);
          setQuestion('');
          setAnswer('');
          setCategory('');
          setImage('');
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      }
    );
  };

  const integrateQuiz = () => {
    if (get_file_num == null || get_quiz_num == null) {
      setMessage('エラー:統合元(左)の問題を取得して下さい');
      setMessageColor('error');
      return;
    } else if (get_file_num == null || integrate_to_quiz_num == null) {
      setMessage('エラー:統合元(右)の問題を取得して下さい');
      setMessageColor('error');
      return;
    }

    post(
      '/quiz/integrate',
      {
        pre_file_num: get_file_num,
        pre_quiz_num: get_quiz_num,
        post_file_num: get_file_num,
        post_quiz_num: integrate_to_quiz_num
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body;
          let quiz_num = '[' + get_file_num + ':' + get_quiz_num + '->' + integrate_to_quiz_num + ']';
          setMessage('Success! 統合に成功しました' + quiz_num);
          setMessageColor('initial');
          setGetFileNum(null);
          setGetQuizNum(null);
          setQuestion('');
          setAnswer('');
          setCategory('');
          setImage('');
          setIntegrateToQuizNum(null);
          setIntegrateToQuestion('');
          setIntegrateToAnswer('');
          setIntegrateToCategory('');
          setIntegrateToImage('');
          setMessage('　');
          setMessageColor('initial');
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
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

        <Paper variant="outlined" style={paperStyle}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="h6">
                削除する(統合元の)問題
              </Typography>

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

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                ファイル：{get_file_num}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                問題番号：{get_quiz_num}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                問題　　：{question}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                答え　　：{answer}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                カテゴリ：{category}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                画像　　：{image}
              </Typography>
            </CardContent>
          </Card>

          <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => deleteQuiz()}>
            削除
          </Button>
        </Paper>

        <Paper variant="outlined" style={paperStyle}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="h6">
                統合先の問題
              </Typography>

              <FormGroup>
                <FormControl disabled>
                  <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
                  <Select
                    labelId="quiz-file-name"
                    id="quiz-file-id"
                    defaultValue={file_num || -1}
                    // value={age}
                    //onChange={(e) => {this.setState({file_num: e.target.value});}}
                  >
                    <MenuItem value={-1} key={-1}>
                      同左
                    </MenuItem>
                    {filelistoption}
                  </Select>
                </FormControl>

                <FormControl>
                  <TextField
                    label="問題番号"
                    onChange={(e) => {
                      setIntegrateToQuizNum(Number(e.target.value));
                    }}
                  />
                </FormControl>
              </FormGroup>

              <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => getIntegrateToQuiz()}>
                問題取得
              </Button>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                ファイル：{get_file_num}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                問題番号：{integrate_to_quiz_num}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                問題　　：{integrate_to_question}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                答え　　：{integrate_to_answer}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                カテゴリ：{integrate_to_category}
              </Typography>

              <Typography variant="h6" component="h6" style={messageBoxStyle}>
                画像　　：{integrate_to_image}
              </Typography>
            </CardContent>
          </Card>

          <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => integrateQuiz()}>
            統合
          </Button>
        </Paper>
      </Container>
    );
  };

  return (
    <>
      <QuizzerLayout contents={contents()} />
    </>
  );
}
