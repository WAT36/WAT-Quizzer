import React, { useEffect, useState } from 'react';
import { get } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { Button, Card, CardContent, CardHeader, Container, MenuItem, TextField, Typography } from '@mui/material';
import { messageBoxStyle } from '../../styles/Pages';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');

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

        <Card variant="outlined">
          <CardHeader title="問題ファイル" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="ファイル新規追加" />
              <CardContent style={cardContentStyle}>
                <TextField label="新規ファイル名" variant="outlined" style={inputTextBeforeButtonStyle} />
                <Button variant="contained" style={buttonAfterInputTextStyle}>
                  追加
                </Button>
              </CardContent>
            </Card>
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
