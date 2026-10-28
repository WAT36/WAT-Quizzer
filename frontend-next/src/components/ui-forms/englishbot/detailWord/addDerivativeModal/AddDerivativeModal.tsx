import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { addDerivativeAPI, getWordDetailAPI } from '@/utils/api-wrapper';

interface AddDerivativeModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

// 単語詳細画面で派生語を追加するモーダル
export const AddDerivativeModal = ({
  isOpen,
  setIsOpen,
  wordDetail,
  setMessage,
  setWordDetail
}: AddDerivativeModalProps) => {
  const [derivativeName, setDerivativeName] = useState<string>('');
  const isSameAsOriginal = derivativeName === wordDetail.name;

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={'派生語追加'}
      actions={
        <Button
          label={'派生語追加'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          disabled={isSameAsOriginal}
          onClick={async () => {
            setIsOpen(false);
            const result = await addDerivativeAPI({
              addDerivativeData: { wordName: wordDetail.name, derivativeName }
            });
            setMessage && setMessage(result.message);
            // 更新確認後、単語の意味を再取得させる
            // TODO この再取得の部分は共通関数化できないかな
            if (result.isSuccess) {
              const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                .result as GetWordDetailAPIResponseDto;
              setWordDetail && setWordDetail(newWordDetail);
            }
            setDerivativeName('');
          }}
        />
      }
    >
      <Typography component="div">
        派生語名：
        <TextField
          inputProps={{ 'aria-label': '派生語名' }}
          variant="outlined"
          error={isSameAsOriginal}
          helperText={isSameAsOriginal ? '元の単語は入力できません' : ' '}
          value={derivativeName}
          onChange={(e) => setDerivativeName(e.target.value)}
        />
      </Typography>
    </DialogModal>
  );
};
