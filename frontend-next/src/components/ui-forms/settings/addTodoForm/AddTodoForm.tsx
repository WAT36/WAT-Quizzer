import React, { useState } from 'react';
import { CardContent } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { AddTodoAPIRequestDto } from 'quizzer-lib';
import { addTodoAPI } from '@/utils/api-wrapper';

interface AddTodoFormProps {}

export const AddTodoForm = ({}: AddTodoFormProps) => {
  const [addTodoAPIRequest, setAddTodoAPIRequest] = useState<AddTodoAPIRequestDto>({ todo: '' });
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Card variant="outlined" subHeader="TODO追加" attr={['margin-vertical', 'padding']}>
        <CardContent className={styles.cardContent}>
          <TextField
            label="新規TODO"
            variant="outlined"
            className={['fullWidth']}
            value={addTodoAPIRequest.todo}
            setStater={(value: string) => {
              setAddTodoAPIRequest({
                ...addTodoAPIRequest,
                todo: value
              });
            }}
          />
          <Button
            label={'TODO登録'}
            variant="contained"
            color="primary"
            onClick={async (e) => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await addTodoAPI({ addTodoAPIRequest });
              setMessage(result.message);
              if (result.isSuccess) {
                setAddTodoAPIRequest({ todo: '' });
              }
            }}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
