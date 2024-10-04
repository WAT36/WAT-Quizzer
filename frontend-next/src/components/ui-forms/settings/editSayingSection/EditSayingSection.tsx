import React, { useState } from 'react';
import { CardContent, Input, Typography } from '@mui/material';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { editSayingAPI, EditSayingAPIRequestDto, getSayingAPI, GetSayingRequest, GetSayingResponse } from 'quizzer-lib';

interface EditSayingSectionProps {}

export const EditSayingSection = ({}: EditSayingSectionProps) => {
  const [getSayingRequestData, setSayingRequestData] = useState<GetSayingRequest>({ id: -1 });
  const [editSayingRequestData, setEditSayingRequestData] = useState<EditSayingAPIRequestDto>({ id: -1, saying: '' });
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card variant="outlined" subHeader="格言編集" attr="margin-vertical padding">
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言ID"
            className={['fullWidth']}
            variant="outlined"
            setStater={(value: string) => {
              setSayingRequestData({
                ...getSayingRequestData,
                id: +value
              });
            }}
          />
          <Button
            label={'取得'}
            variant="contained"
            color="primary"
            onClick={async (e) => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await getSayingAPI({ getSayingRequestData });
              setMessage(result.message);
              if (result.result) {
                const getResult = result.result as GetSayingResponse;
                setEditSayingRequestData({
                  ...getResult
                });
              }
            }}
            attr={'after-inline'}
          />
        </CardContent>
        <CardContent>
          <Typography variant="subtitle1" component="h2">
            {`ID:${editSayingRequestData.id < 0 ? '' : editSayingRequestData.id}`}
          </Typography>
          <Typography variant="subtitle1" component="h2" className={styles.messageBox}>
            <label htmlFor="saying">格言　　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="saying"
              value={editSayingRequestData.saying || ''}
              onChange={(e) => {
                setEditSayingRequestData({
                  ...editSayingRequestData,
                  saying: e.target.value
                });
              }}
            />
          </Typography>
          <Typography variant="subtitle1" component="h2" className={styles.messageBox}>
            <label htmlFor="explanation">説明　　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="explanation"
              value={editSayingRequestData.explanation || ''}
              onChange={(e) => {
                setEditSayingRequestData({
                  ...editSayingRequestData,
                  explanation: e.target.value
                });
              }}
            />
          </Typography>
          <Button
            label={'更新'}
            variant="contained"
            color="primary"
            onClick={async (e) => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await editSayingAPI({ editSayingRequestData });
              setMessage(result.message);
              setEditSayingRequestData({ id: -1, saying: '' });
            }}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
