import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { linkWordEtymologyAPI } from '@/utils/api-wrapper';

interface LinkEtymologyModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

// 単語詳細画面で単語に語源を紐付けるモーダル
export const LinkEtymologyModal = ({
  isOpen,
  setIsOpen,
  wordDetail,
  setMessage,
  onUpdated
}: LinkEtymologyModalProps) => {
  const [etymologyName, setEtymologyName] = useState<string>('');

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={'語源紐付け'}
      actions={
        <Button
          label={'語源紐付け'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={async () => {
            setIsOpen(false);
            const result = await linkWordEtymologyAPI({
              linkWordEtymologyData: { etymologyName, wordId: wordDetail.id }
            });
            setMessage && setMessage(result.message);
            // 更新確認後、単語の意味を再取得させる
            if (result.isSuccess) {
              await onUpdated?.();
            }
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
