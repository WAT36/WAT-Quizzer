import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import { buttonStyle, messageBoxStyle, paperStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import {
  DeleteQuizInfoState,
  MessageState,
  PullDownOptionState,
  QueryOfDeleteQuizState
} from '../../../interfaces/state';
import { getFileList } from '@/common/response';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/deleteQuizForm';

export default function DeleteQuizPage() {
  const [queryOfDeleteQuizState, setQueryOfDeleteQuizState] = useState<QueryOfDeleteQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [deleteQuizInfoState, setDeleteQuizInfoState] = useState<DeleteQuizInfoState>({});
  const [file_num, setFileNum] = useState<number>(-1);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [quiz_num, setQuizNum] = useState<number>();
  const [get_file_num, setGetFileNum] = useState<number | null>();
  const [get_quiz_num, setGetQuizNum] = useState<number | null>();
  const [integrate_to_quiz_num, setIntegrateToQuizNum] = useState<number | null>();
  const [integrate_to_question, setIntegrateToQuestion] = useState<string>();
  const [integrate_to_answer, setIntegrateToAnswer] = useState<string>();
  const [integrate_to_category, setIntegrateToCategory] = useState<string>();
  const [integrate_to_image, setIntegrateToImage] = useState<string>();
  const [format, setFormat] = useState<string>('basic');

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const getIntegrateToQuiz = () => {
    if (file_num === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      });
      return;
    } else if (!integrate_to_quiz_num) {
      setMessage({
        message: 'エラー:問題番号を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
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
          setMessage({
            message: '　',
            messageColor: 'commmon.black'
          });
        } else if (data.status === 404 || data.body?.length === 0) {
          setMessage({
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        file_num: String(get_file_num),
        quiz_num: String(integrate_to_quiz_num),
        format
      }
    );
  };

  const integrateQuiz = () => {
    if (get_file_num == null || get_quiz_num == null) {
      setMessage({
        message: 'エラー:統合元(左)の問題を取得して下さい',
        messageColor: 'error'
      });
      return;
    } else if (get_file_num == null || integrate_to_quiz_num == null) {
      setMessage({
        message: 'エラー:統合元(右)の問題を取得して下さい',
        messageColor: 'error'
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
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
          setMessage({
            message: 'Success! 統合に成功しました' + quiz_num,
            messageColor: 'success.light'
          });
          setGetFileNum(null);
          setGetQuizNum(null);
          // setQuestion('');
          // setAnswer('');
          // setCategory('');
          // setImage('');
          setIntegrateToQuizNum(null);
          setIntegrateToQuestion('');
          setIntegrateToAnswer('');
          setIntegrateToCategory('');
          setIntegrateToImage('');
        } else if (data.status === 404) {
          setMessage({
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <DeleteQuizForm
          queryOfDeleteQuizState={queryOfDeleteQuizState}
          deleteQuizInfoState={deleteQuizInfoState}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setQueryOfDeleteQuizState={setQueryOfDeleteQuizState}
          setDeleteQuizInfoState={setDeleteQuizInfoState}
        />

        <Paper variant="outlined" style={paperStyle}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="h6">
                統合先の問題
              </Typography>

              <FormGroup>
                <FormControl>
                  <PullDown
                    label={'問題ファイル'}
                    optionList={filelistoption}
                    onChange={(e) => {
                      setFileNum(Number(e.target.value));
                    }}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    label="問題番号"
                    onChange={(e) => {
                      setIntegrateToQuizNum(Number(e.target.value));
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">問題種別</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={format}
                    defaultValue={format}
                    //onChange={handleRadioChange}
                  >
                    <FormControlLabel disabled value="basic" control={<Radio />} label="基礎問題" />
                    <FormControlLabel disabled value="applied" control={<Radio />} label="応用問題" />
                  </RadioGroup>
                </FormControl>
              </FormGroup>

              <Button
                style={buttonStyle}
                variant="contained"
                color="primary"
                disabled={format !== 'basic'}
                onClick={(e) => getIntegrateToQuiz()}
              >
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

          <Button
            style={buttonStyle}
            variant="contained"
            color="primary"
            disabled={format !== 'basic'}
            onClick={(e) => integrateQuiz()}
          >
            統合
          </Button>
        </Paper>
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'問題削除'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
