import React from 'react';
import { MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { CardContent, CardHeader, TextField } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { addBookAPI } from '@/common/ButtonAPI';

interface AddBookFormProps {
  bookName: string;
  setBookName?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const AddBookForm = ({ bookName, setBookName, setMessageStater, setBooklistoption }: AddBookFormProps) => {
  return (
    <>
      <CardHeader subheader="新規追加 - 啓発本" />
      <CardContent
        style={{
          display: 'flex',
          width: '100%'
        }}
      >
        <TextField
          label="新規啓発本名"
          variant="outlined"
          onChange={(e) => {
            if (setBookName) {
              setBookName(e.target.value);
            }
          }}
          style={{
            flex: 'auto'
          }}
        />
        <Button
          label={'啓発本登録'}
          variant="contained"
          color="primary"
          onClick={(e) => addBookAPI({ bookName, setMessageStater, setBooklistoption })}
          attr={'after-inline'}
        />
      </CardContent>
    </>
  );
};
