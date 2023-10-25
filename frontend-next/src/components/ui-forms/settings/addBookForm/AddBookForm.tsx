import React from 'react';
import { MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { CardContent, CardHeader, TextField } from '@mui/material';
import { AddBookButton } from '@/components/ui-parts/button-patterns/addBook/AddBook.button';

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
        <AddBookButton
          bookName={bookName}
          setMessageStater={setMessageStater}
          setBooklistoption={setBooklistoption}
          attr={'after-inline'}
        />
      </CardContent>
    </>
  );
};
