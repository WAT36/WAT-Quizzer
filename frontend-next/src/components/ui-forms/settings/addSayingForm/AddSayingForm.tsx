import React from 'react';
import { MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { CardContent, CardHeader, SelectChangeEvent, TextField } from '@mui/material';
import { AddSayingButton } from '@/components/ui-parts/button-patterns/addSaying/AddSaying.button';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

interface AddSayingFormProps {
  inputSaying: string;
  selectedBookId: number;
  booklistoption: PullDownOptionState[];
  setInputSaying?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSelectedBookId?: React.Dispatch<React.SetStateAction<number>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

const cardContentStyle = {
  display: 'flex',
  width: '100%'
};

export const AddSayingForm = ({
  inputSaying,
  selectedBookId,
  booklistoption,
  setInputSaying,
  setMessageStater,
  setSelectedBookId,
  setBooklistoption
}: AddSayingFormProps) => {
  return (
    <>
      <CardHeader subheader="格言追加" />
      <CardContent style={cardContentStyle}>
        <PullDown
          label={''}
          optionList={booklistoption}
          onChange={(e: SelectChangeEvent<number>) => {
            if (setSelectedBookId) {
              setSelectedBookId(+e.target.value);
            }
          }}
        />
      </CardContent>
      <CardContent style={cardContentStyle}>
        <TextField
          label="新規格言"
          variant="outlined"
          onChange={(e) => {
            if (setInputSaying) {
              setInputSaying(e.target.value);
            }
          }}
          style={{
            flex: 'auto'
          }}
        />
        <AddSayingButton
          selectedBookId={selectedBookId}
          inputSaying={inputSaying}
          setMessageStater={setMessageStater}
          setBooklistoption={setBooklistoption}
          attr={'after-inline'}
        />
      </CardContent>
    </>
  );
};
