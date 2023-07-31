import React, { useEffect, useState } from 'react';
import { get } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { Container, MenuItem } from '@mui/material';

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

  const contents = () => {
    return (
      <Container>
        <h1>WAT Quizzer - 諸々設定</h1>
      </Container>
    );
  };

  return (
    <>
      <QuizzerLayout contents={contents()} />
    </>
  );
}
