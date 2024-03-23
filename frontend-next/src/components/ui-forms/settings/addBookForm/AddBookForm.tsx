import React from 'react';
import { MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { CardContent, CardHeader } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { addBookAPI } from '@/common/ButtonAPI';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';

interface AddBookFormProps {
  bookName: string;
  setBookName?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const AddBookForm = ({ bookName, setBookName, setMessageStater, setBooklistoption }: AddBookFormProps) => {
  return (
    <>
      <Card variant="outlined" attr="margin-vertical padding">
        <CardHeader subheader="新規追加 - 啓発本" />
        <CardContent
          style={{
            display: 'flex'
          }}
        >
          <TextField label="新規啓発本名" className={['fullWidth']} variant="outlined" setStater={setBookName} />
          <Button
            label={'啓発本登録'}
            variant="contained"
            color="primary"
            onClick={(e) => addBookAPI({ bookName, setMessageStater, setBooklistoption })}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
