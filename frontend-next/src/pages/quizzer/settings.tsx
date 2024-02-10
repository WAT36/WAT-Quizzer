import React, { useEffect, useState } from 'react';
import { del, get, patch, post } from '../../common/API';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import { messageBoxStyle } from '../../styles/Pages';
import { getRandomStr } from '../../../lib/str';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState } from '../../../interfaces/state';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [fileName, setFileName] = useState<string>();
  const [file_num, setFileNum] = useState<number>(-1);
  const [deleteQuizFileNum, setDeleteQuizFileNum] = useState<number>(-1);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [deleteQuizFileAlertOpen, setDeleteQuizFileAlertOpen] = React.useState(false);

  useEffect(() => {
    getFile();
  }, []);

  const getFile = () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
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
        setMessage({
          message: '　',
          messageColor: 'commmon.black',
          isDisplay: false
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    });
  };

  const addFile = () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    post(
      '/quiz/file',
      {
        file_name: getRandomStr(),
        file_nickname: fileName
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `新規ファイル「${fileName}」を追加しました`,
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
    getFile();
  };

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

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setFileNum(e.target.value as number);
  };

  const handleClickOpen = () => {
    setAlertOpen(true);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  // ファイルと問題削除
  const deleteFile = () => {
    handleClose();

    if (file_num === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
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
    del(
      '/quiz/file',
      {
        file_id: file_num
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `ファイルを削除しました(id:${file_num})`,
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
    setFileNum(-1);
  };

  // 指定ファイルのこれまでの回答データ削除
  const deleteAnswerData = () => {
    setDeleteQuizFileAlertOpen(false);

    if (deleteQuizFileNum === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
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
    patch(
      '/quiz/answer_log/file',
      {
        file_id: deleteQuizFileNum
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `回答ログを削除しました(id:${deleteQuizFileNum})`,
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

    setDeleteQuizFileNum(-1);
  };

  const contents = () => {
    return (
      <Container>
        <h1>WAT Quizzer - 諸々設定</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" style={cardStyle}>
          <CardHeader title="問題ファイル" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="ファイル新規追加" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="新規ファイル名"
                  variant="outlined"
                  onChange={(e) => {
                    setFileName(e.target.value);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => addFile()}>
                  追加
                </Button>
              </CardContent>
              <CardHeader subheader="ファイル削除" />
              <CardContent style={cardContentStyle}>
                <Select
                  labelId="quiz-file-name"
                  id="quiz-file-id"
                  defaultValue={-1}
                  onChange={(e) => selectedFileChange(e)}
                  style={inputTextBeforeButtonStyle}
                >
                  <MenuItem value={-1} key={-1}>
                    選択なし
                  </MenuItem>
                  {filelistoption}
                </Select>
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => handleClickOpen()}>
                  削除
                </Button>
                <Dialog
                  open={alertOpen}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      指定ファイルだけでなく、ファイルの問題全ても同時に削除されます。
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                      キャンセル
                    </Button>
                    <Button
                      onClick={(e) => {
                        deleteFile();
                      }}
                      variant="contained"
                      autoFocus
                    >
                      削除
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card variant="outlined" style={cardStyle}>
          <CardHeader title="解答データ削除" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="ファイル新規追加" />
              <CardContent style={cardContentStyle}>
                <Select
                  labelId="quiz-file-name"
                  id="quiz-file-id"
                  defaultValue={-1}
                  // value={age}
                  onChange={(e) => {
                    setDeleteQuizFileNum(Number(e.target.value));
                  }}
                  style={inputTextBeforeButtonStyle}
                >
                  <MenuItem value={-1} key={-1}>
                    選択なし
                  </MenuItem>
                  {filelistoption}
                </Select>
                <Button
                  variant="contained"
                  style={buttonAfterInputTextStyle}
                  onClick={(e) => setDeleteQuizFileAlertOpen(true)}
                >
                  削除
                </Button>
                <Dialog
                  open={deleteQuizFileAlertOpen}
                  onClose={(e) => setDeleteQuizFileAlertOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      指定ファイルのこれまでの回答データが削除されます。
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={(e) => setDeleteQuizFileAlertOpen(false)} variant="outlined">
                      キャンセル
                    </Button>
                    <Button
                      onClick={(e) => {
                        deleteAnswerData();
                      }}
                      variant="contained"
                      autoFocus
                    >
                      削除
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'設定'} />
    </>
  );
}
