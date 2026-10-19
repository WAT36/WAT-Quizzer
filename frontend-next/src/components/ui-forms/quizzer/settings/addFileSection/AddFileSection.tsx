import { CardContent, CardHeader } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import type { Message } from 'quizzer-lib';
import { getRandomStr } from 'quizzer-lib';
import { addQuizFileAPI } from '@/utils/api-wrapper';
import { useState } from 'react';
import React from 'react';

interface AddFileSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const AddFileSection = ({ setMessage }: AddFileSectionProps) => {
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
  };

  return (
    <>
      <CardHeader subheader="ファイル新規追加" />
      <CardContent className="flex w-full">
        <TextField label="新規ファイル名" setStater={setFileName} className={['flex']} />
        <Button label="追加" variant="contained" attr="after-inline" onClick={async (e) => await addFile()} />
      </CardContent>
    </>
  );
};
