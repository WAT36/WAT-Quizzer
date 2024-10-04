import styles from '../Settings.module.css';
import { CardContent, CardHeader } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import {
  Message,
  getRandomStr,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  addQuizFileAPI
} from 'quizzer-lib';
import { useState } from 'react';
import React from 'react';

interface AddFileSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  setFilelistoption: React.Dispatch<React.SetStateAction<PullDownOptionDto[]>>;
}

export const AddFileSection = ({ setMessage, setFilelistoption }: AddFileSectionProps) => {
  const [fileName, setFileName] = useState<string>('');

  const addFile = async () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    const result = await addQuizFileAPI({
      addQuizFileApiRequest: {
        file_name: getRandomStr(),
        file_nickname: fileName
      }
    });
    setMessage(result.message);
    if (result.message.messageColor === 'success.light') {
      // 問題ファイル再取得
      const result = await getQuizFileListAPI();
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    }
  };

  return (
    <>
      <CardHeader subheader="ファイル新規追加" />
      <CardContent className={styles.cardContent}>
        <TextField label="新規ファイル名" setStater={setFileName} className={['flex']} />
        <Button label="追加" variant="contained" attr="after-inline" onClick={async (e) => await addFile()} />
      </CardContent>
    </>
  );
};
