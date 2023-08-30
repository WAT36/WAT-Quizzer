import React, { useEffect, useState } from 'react';
import { del, get, patch, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
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
  TextField,
  Typography
} from '@mui/material';
import { messageBoxStyle } from '../../styles/Pages';
import { getRandomStr } from '../../../lib/str';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
  const [fileName, setFileName] = useState<string>();
  const [file_num, setFileNum] = useState<number>(-1);
  const [deleteQuizFileNum, setDeleteQuizFileNum] = useState<number>(-1);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [deleteQuizFileAlertOpen, setDeleteQuizFileAlertOpen] = React.useState(false);

  useEffect(() => {
    getFile();
  }, []);

  const getFile = () => {
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
  };

  const addFile = () => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    post(
      '/quiz/file',
      {
        file_name: getRandomStr(),
        file_nickname: fileName
      },
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          data = data.body;
          setMessage(`新規ファイル「${fileName}」を追加しました`);
          setMessageColor('success.light');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
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

  const selectedFileChange = (e: any) => {
    setFileNum(e.target.value);
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
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    del(
      '/quiz/file',
      {
        file_id: file_num
      },
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          data = data.body;
          setMessage(`ファイルを削除しました(id:${file_num})`);
          setMessageColor('success.light');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      }
    );
    setFileNum(-1);
  };

  // 指定ファイルのこれまでの回答データ削除
  const deleteAnswerData = () => {
    setDeleteQuizFileAlertOpen(false);

    if (deleteQuizFileNum === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    patch(
      '/quiz/answer_log/file',
      {
        file_id: deleteQuizFileNum
      },
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          data = data.body;
          setMessage(`回答ログを削除しました(id:${deleteQuizFileNum})`);
          setMessageColor('success.light');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
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
            <Typography variant="h6" component="h6" color={messageColor}>
              {message}
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
      <QuizzerLayout contents={contents()} title={'設定'} />
    </>
  );
}
