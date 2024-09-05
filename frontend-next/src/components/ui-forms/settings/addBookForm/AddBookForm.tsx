import React from 'react';
import { CardContent } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import styles from '../Settings.module.css';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { addBookAPI } from '@/api/saying/addBookAPI';
import { PullDownOptionDto } from 'quizzer-lib';

interface AddBookFormProps {
  bookName: string;
  setBookName?: React.Dispatch<React.SetStateAction<string>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionDto[]>>;
}

export const AddBookForm = ({ bookName, setBookName, setBooklistoption }: AddBookFormProps) => {
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card variant="outlined" subHeader="新規追加 - 啓発本" attr="margin-vertical padding">
        <CardContent className={styles.cardContent}>
          <TextField label="新規啓発本名" className={['fullWidth']} variant="outlined" setStater={setBookName} />
          <Button
            label={'啓発本登録'}
            variant="contained"
            color="primary"
            onClick={(e) => addBookAPI({ bookName, setMessageStater: setMessage, setBooklistoption })}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
