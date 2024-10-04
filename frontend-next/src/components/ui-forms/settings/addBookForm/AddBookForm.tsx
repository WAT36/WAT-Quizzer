import React, { useState } from 'react';
import { CardContent } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import styles from '../Settings.module.css';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { addBookAPI, listBook, PullDownOptionDto } from 'quizzer-lib';

interface AddBookFormProps {
  setBooklistoption: React.Dispatch<React.SetStateAction<PullDownOptionDto[]>>;
}

export const AddBookForm = ({ setBooklistoption }: AddBookFormProps) => {
  const [bookName, setBookName] = useState<string>('');
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
            onClick={async (e) => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await addBookAPI({ addBookAPIRequest: { book_name: bookName } });
              setMessage(result.message);
              if (result.message.messageColor === 'success.light') {
                // 問題ファイル再取得
                const result = await listBook();
                if (result.result && Array.isArray(result.result)) {
                  let booklist: PullDownOptionDto[] = [];
                  for (var i = 0; i < result.result.length; i++) {
                    booklist.push({
                      value: String(result.result[i].id),
                      label: result.result[i].name
                    });
                  }
                  setBooklistoption(booklist);
                }
              }
            }}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
