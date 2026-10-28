import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { addAntonymAPI, getWordDetailAPI } from '@/utils/api-wrapper';

interface AddAntonymModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

// 単語詳細画面で対義語を追加するモーダル
export const AddAntonymModal = ({ isOpen, setIsOpen, wordDetail, setMessage, setWordDetail }: AddAntonymModalProps) => {
  const [antonymWordName, setAntonymWordName] = useState<string>('');
  const isSameAsOriginal = antonymWordName === wordDetail.name;

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={'対義語追加'}
      actions={
        <Button
          label={'対義語追加'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          disabled={isSameAsOriginal}
          onClick={async () => {
            setIsOpen(false);
            const result = await addAntonymAPI({
              addAntonymData: { wordId: wordDetail.id, antonymWordName }
            });
            setMessage && setMessage(result.message);
            // 更新確認後、単語の意味を再取得させる
            // TODO この再取得の部分は共通関数化できないかな
            if (result.isSuccess) {
              const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                .result as GetWordDetailAPIResponseDto;
              setWordDetail && setWordDetail(newWordDetail);
            }
            setAntonymWordName('');
          }}
        />
      }
    >
      <Typography component="div">
        対義語名：
        <TextField
          inputProps={{ 'aria-label': '対義語名' }}
          variant="outlined"
          error={isSameAsOriginal}
          helperText={isSameAsOriginal ? '元の単語は入力できません' : ' '}
          value={antonymWordName}
          onChange={(e) => setAntonymWordName(e.target.value)}
        />
      </Typography>
    </DialogModal>
  );
};
