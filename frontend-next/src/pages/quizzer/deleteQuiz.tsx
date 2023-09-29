import React, { useEffect, useState } from 'react';

import { del, get, post } from '../../common/API';
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
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizApiResponse, QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';

export default function DeleteQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
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
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get('/quiz/file', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const res: QuizFileApiResponse[] = data.body as QuizFileApiResponse[];
        let filelist = [];
        for (var i = 0; i < res.length; i++) {
          filelist.push(
            <MenuItem value={res[i].file_num} key={res[i].file_num}>
              {res[i].file_nickname}
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

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/quiz',
      (data: ProcessingApiReponse) => {
        if (data.status === 200 && data.body?.length > 0) {
          const res: QuizApiResponse[] = data.body as QuizApiResponse[];
          setGetFileNum(res[0].file_num);
          setGetQuizNum(res[0].quiz_num);
          setQuestion(res[0].quiz_sentense);
          setAnswer(res[0].answer);
          setCategory(res[0].category);
          setImage(res[0].img_file);
          setMessage('　');
          setMessageColor('success.light');
        } else if (data.status === 404 || data.body?.length === 0) {
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

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/quiz',
      (data: ProcessingApiReponse) => {
        if (data.status === 200 && data.body?.length > 0) {
          const res: QuizApiResponse[] = data.body as QuizApiResponse[];
          setIntegrateToQuizNum(res[0].quiz_num);
          setIntegrateToQuestion(res[0].quiz_sentense);
          setIntegrateToAnswer(res[0].answer);
          setIntegrateToCategory(res[0].category);
          setIntegrateToImage(res[0].img_file);
          setMessage('　');
          setMessageColor('success.light');
        } else if (data.status === 404 || data.body?.length === 0) {
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

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    del(
      '/quiz',
      {
        file_num: get_file_num,
        quiz_num: get_quiz_num
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          let quiz_num = '[' + get_file_num + '-' + get_quiz_num + ']';
          setMessage('Success! 削除に成功しました' + quiz_num);
          setMessageColor('success.light');
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

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    post(
      '/quiz/integrate',
      {
        pre_file_num: get_file_num,
        pre_quiz_num: get_quiz_num,
        post_file_num: get_file_num,
        post_quiz_num: integrate_to_quiz_num
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          let quiz_num = '[' + get_file_num + ':' + get_quiz_num + '->' + integrate_to_quiz_num + ']';
          setMessage('Success! 統合に成功しました' + quiz_num);
          setMessageColor('success.light');
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
      <Layout mode="quizzer" contents={contents()} title={'問題削除'} />
    </>
  );
}
