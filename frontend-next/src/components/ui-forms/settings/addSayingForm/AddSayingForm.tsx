import React, { useState } from 'react';
import { CardContent, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Button } from '@/components/ui-elements/button/Button';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { addSayingAPI, AddSayingAPIRequestDto, initAddSayingMockData, PullDownOptionDto } from 'quizzer-lib';

interface AddSayingFormProps {
  booklistoption: PullDownOptionDto[];
}

export const AddSayingForm = ({ booklistoption }: AddSayingFormProps) => {
  const [addSayingAPIRequest, setAddSayingAPIRequest] = useState<AddSayingAPIRequestDto>(initAddSayingMockData);
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card variant="outlined" subHeader="格言追加" attr="margin-vertical padding">
        <CardContent className={styles.cardContent}>
          <PullDown
            label={''}
            optionList={booklistoption}
            onChange={(e: SelectChangeEvent<number>) => {
              setAddSayingAPIRequest({
                ...addSayingAPIRequest,
                book_id: +e.target.value
              });
            }}
          />
        </CardContent>
        <CardContent className={styles.cardContent}>
          <TextField
            label="新規格言"
            variant="outlined"
            className={['fullWidth']}
            setStater={(value: string) => {
              setAddSayingAPIRequest({
                ...addSayingAPIRequest,
                saying: value
              });
            }}
          />
        </CardContent>
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言の説明"
            variant="outlined"
            className={['fullWidth']}
            setStater={(value: string) => {
              setAddSayingAPIRequest({
                ...addSayingAPIRequest,
                explanation: value
              });
            }}
          />
          <Button
            label={'格言登録'}
            variant="contained"
            color="primary"
            onClick={async (e) => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await addSayingAPI({ addSayingAPIRequest });
              setMessage(result.message);
              if (result.message.messageColor === 'success.light') {
                setAddSayingAPIRequest(initAddSayingMockData);
              }
            }}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
