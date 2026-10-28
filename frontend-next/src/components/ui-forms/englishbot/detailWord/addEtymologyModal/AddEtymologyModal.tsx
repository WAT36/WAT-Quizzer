import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import type { Message } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { addEtymologyAPI } from '@/utils/api-wrapper';

interface AddEtymologyModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
}

// 語源そのものを新規登録するモーダル（単語への紐付けはLinkEtymologyModalで行う）
export const AddEtymologyModal = ({ isOpen, setIsOpen, setMessage }: AddEtymologyModalProps) => {
  const [etymologyName, setEtymologyName] = useState<string>('');

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={'語源追加'}
      actions={
        <Button
          label={'語源追加'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={async () => {
            setIsOpen(false);
            const result = await addEtymologyAPI({
              addEtymologyData: { etymologyName }
            });
            setMessage && setMessage(result.message);
            setEtymologyName('');
          }}
        />
      }
    >
      <Typography component="div">
        語源名：
        <TextField
          inputProps={{ 'aria-label': '語源名' }}
          variant="outlined"
          value={etymologyName}
          onChange={(e) => setEtymologyName(e.target.value)}
        />
      </Typography>
    </DialogModal>
  );
};
