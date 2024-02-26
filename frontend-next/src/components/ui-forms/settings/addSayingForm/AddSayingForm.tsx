import React from 'react';
import { InputSayingState, MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { Card, CardContent, CardHeader, SelectChangeEvent, TextField } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Button } from '@/components/ui-elements/button/Button';
import { addSayingAPI } from '@/common/ButtonAPI';
import styles from '../Settings.module.css';

interface AddSayingFormProps {
  inputSaying: InputSayingState;
  booklistoption: PullDownOptionState[];
  setInputSaying?: React.Dispatch<React.SetStateAction<InputSayingState>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
}

export const AddSayingForm = ({
  inputSaying,
  booklistoption,
  setInputSaying,
  setMessageStater
}: AddSayingFormProps) => {
  return (
    <>
      <Card variant="outlined">
        <CardHeader subheader="格言追加" />
        <CardContent className={styles.cardContent}>
          <PullDown
            label={''}
            optionList={booklistoption}
            onChange={(e: SelectChangeEvent<number>) => {
              if (setInputSaying) {
                setInputSaying({
                  ...inputSaying,
                  bookId: +e.target.value
                });
              }
            }}
          />
        </CardContent>
        <CardContent className={styles.cardContent}>
          <TextField
            label="新規格言"
            variant="outlined"
            onChange={(e) => {
              if (setInputSaying) {
                setInputSaying({
                  ...inputSaying,
                  saying: e.target.value
                });
              }
            }}
            style={{
              flex: 'auto'
            }}
          />
        </CardContent>
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言の説明"
            variant="outlined"
            onChange={(e) => {
              if (setInputSaying) {
                setInputSaying({
                  ...inputSaying,
                  explanation: e.target.value
                });
              }
            }}
            style={{
              flex: 'auto'
            }}
          />
          <Button
            label={'格言登録'}
            variant="contained"
            color="primary"
            onClick={(e) => addSayingAPI({ inputSaying, setMessageStater, setInputSaying })}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
