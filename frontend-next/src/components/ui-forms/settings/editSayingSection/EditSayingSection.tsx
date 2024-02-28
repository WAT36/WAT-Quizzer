import React, { useState } from 'react';
import { EditQueryOfSaying, MessageState } from '../../../../../interfaces/state';
import { Button, Card, CardContent, CardHeader, Input, TextField, Typography } from '@mui/material';
import { editSayingAPI, getSayingByIdAPI } from '@/common/ButtonAPI';
import styles from '../Settings.module.css';

interface EditSayingSectionProps {
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
}

export const EditSayingSection = ({ setMessageStater }: EditSayingSectionProps) => {
  const [id, setId] = useState<number>(-1);
  const [editQueryOfSaying, setEditQueryOfSaying] = useState<EditQueryOfSaying>({ id: -1, saying: '' });

  return (
    <>
      <Card variant="outlined">
        <CardHeader subheader="格言編集" />
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言ID"
            variant="outlined"
            onChange={(e) => {
              setId(+e.target.value);
            }}
            className={styles.inlineInput}
          />
          <Button
            variant="contained"
            className={styles.inlineButton}
            onClick={(e) => getSayingByIdAPI({ id, setMessageStater, setEditQueryOfSaying })}
          >
            取得
          </Button>
        </CardContent>
        <CardContent>
          <Typography variant="subtitle1" component="h2">
            {`ID:${editQueryOfSaying.id < 0 ? '' : editQueryOfSaying.id}`}
          </Typography>
          <Typography variant="subtitle1" component="h2" className={styles.messageBox}>
            <label htmlFor="saying">格言　　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="saying"
              value={editQueryOfSaying.saying || ''}
              onChange={(e) => {
                setEditQueryOfSaying({
                  ...editQueryOfSaying,
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
              value={editQueryOfSaying.explanation || ''}
              onChange={(e) => {
                setEditQueryOfSaying({
                  ...editQueryOfSaying,
                  explanation: e.target.value
                });
              }}
            />
          </Typography>
          <Button
            variant="contained"
            className={styles.inlineButton}
            onClick={(e) => editSayingAPI({ editQueryOfSaying, setMessageStater, setEditQueryOfSaying })}
          >
            更新
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
