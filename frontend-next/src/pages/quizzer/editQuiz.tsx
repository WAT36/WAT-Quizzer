import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import { buttonStyle, messageBoxStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

export default function EditQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [quiz_num, setQuizNum] = useState<number>();
  const [edit_format, setEditFormat] = useState<string>();
  const [edit_file_num, setEditFileNum] = useState<number>();
  const [edit_quiz_num, setEditQuizNum] = useState<number>();
  const [edit_question, setEditQuestion] = useState<string>();
  const [edit_answer, setEditAnswer] = useState<string>();
  const [edit_category, setEditCategory] = useState<string>();
  const [edit_image, setEditImage] = useState<string>();
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [format, setFormat] = useState<string>('basic');
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const getQuiz = () => {
    if (file_num === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (!quiz_num) {
      setMessage({
        message: 'エラー:問題番号を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    get(
      '/quiz',
      (data: ProcessingApiReponse) => {
        if (data.status === 404 || data.body?.length === 0) {
          setMessage({
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          });
        } else if (data.status === 200 && data.body?.length > 0) {
          const res: QuizApiResponse[] = data.body as QuizApiResponse[];
          setEditFormat(format);
          setEditFileNum(res[0].file_num);
          setEditQuizNum(res[0].quiz_num);
          setEditQuestion(res[0].quiz_sentense || '');
          setEditAnswer(res[0].answer || '');
          setEditCategory(res[0].category || '');
          setEditImage(res[0].img_file || '');
          setMessage({
            message: '　',
            messageColor: 'common.black',
            isDisplay: false
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      },
      {
        file_num: String(file_num),
        quiz_num: String(quiz_num),
        format
      }
    );
  };

  const editQuiz = () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    post(
      '/quiz/edit',
      {
        file_num: edit_file_num,
        quiz_num: edit_quiz_num,
        question: edit_question,
        answer: edit_answer,
        category: edit_category,
        img_file: edit_image,
        format: edit_format
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setEditFormat('');
          setEditFileNum(-1);
          setEditQuizNum(-1);
          setEditQuestion('');
          setEditAnswer('');
          setEditCategory('');
          setEditImage('');
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
  };

  // ラジオボタンの選択変更時の処理
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat((event.target as HTMLInputElement).value);
  };

  const contents = () => {
    // ファイル選択の切り替え
    const selectedFileChange = (e: SelectChangeEvent<number>) => {
      // if (setQueryofAddQuizStater) {
      //   setQueryofAddQuizStater((prev) => ({
      //     ...prev,
      //     ['fileNum']: e.target.value as number
      //   }));
      // }

      // 臨時
      setFileNum(e.target.value as number);
    };

    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
          </FormControl>

          <FormControl>
            <TextField
              label="問題番号"
              onChange={(e) => {
                setQuizNum(Number(e.target.value));
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
              defaultValue="basic"
              onChange={handleRadioChange}
            >
              <FormControlLabel value="basic" control={<Radio />} label="基礎問題" />
              <FormControlLabel value="applied" control={<Radio />} label="応用問題" />
            </RadioGroup>
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
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'問題編集'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
