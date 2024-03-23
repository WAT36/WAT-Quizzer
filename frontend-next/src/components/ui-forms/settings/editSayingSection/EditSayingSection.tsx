import React, { useState } from 'react';
import { EditQueryOfSaying, MessageState } from '../../../../../interfaces/state';
import { CardContent, Input, Typography } from '@mui/material';
import { editSayingAPI, getSayingByIdAPI } from '@/common/ButtonAPI';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';

interface EditSayingSectionProps {
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
}

export const EditSayingSection = ({ setMessageStater }: EditSayingSectionProps) => {
  const [id, setId] = useState<number>(-1);
  const [editQueryOfSaying, setEditQueryOfSaying] = useState<EditQueryOfSaying>({ id: -1, saying: '' });

  return (
    <>
      <Card variant="outlined" subHeader="格言編集" attr="margin-vertical padding">
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言ID"
            className={['fullWidth']}
            variant="outlined"
            setStater={(value: string) => {
              setId(+value);
            }}
          />
          <Button
            label={'取得'}
            variant="contained"
            color="primary"
            onClick={(e) => getSayingByIdAPI({ id, setMessageStater, setEditQueryOfSaying })}
            attr={'after-inline'}
          />
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
            label={'更新'}
            variant="contained"
            color="primary"
            onClick={(e) => editSayingAPI({ editQueryOfSaying, setMessageStater, setEditQueryOfSaying })}
            attr={'after-inline'}
          />
        </CardContent>
      </Card>
    </>
  );
};
