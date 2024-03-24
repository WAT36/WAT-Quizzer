import React from 'react';
import { InputSayingState, MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { CardContent, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Button } from '@/components/ui-elements/button/Button';
import { addSayingAPI } from '@/common/ButtonAPI';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface AddSayingFormProps {
  inputSaying: InputSayingState;
  booklistoption: PullDownOptionState[];
  setInputSaying?: React.Dispatch<React.SetStateAction<InputSayingState>>;
}

export const AddSayingForm = ({ inputSaying, booklistoption, setInputSaying }: AddSayingFormProps) => {
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card variant="outlined" subHeader="格言追加" attr="margin-vertical padding">
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
            className={['fullWidth']}
            setStater={(value: string) => {
              if (setInputSaying) {
                setInputSaying({
                  ...inputSaying,
                  saying: value
                });
              }
            }}
          />
        </CardContent>
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言の説明"
            variant="outlined"
            className={['fullWidth']}
            setStater={(value: string) => {
              if (setInputSaying) {
                setInputSaying({
                  ...inputSaying,
                  explanation: value
                });
              }
            }}
          />
          <Button
            label={'格言登録'}
            variant="contained"
            color="primary"
            onClick={(e) => addSayingAPI({ inputSaying, setMessageStater: setMessage, setInputSaying })}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
