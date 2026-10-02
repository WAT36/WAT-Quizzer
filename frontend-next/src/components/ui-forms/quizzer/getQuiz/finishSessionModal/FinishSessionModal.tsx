import React from 'react';
import { Typography } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { Modal } from '@/components/ui-elements/modal/Modal';

interface FinishSessionModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalCount: number;
  answeredCount: number;
  onConfirm: () => void;
}

// 出題の途中で終了する前の確認モーダル（押し間違えると残りの問題に戻れないため）
export const FinishSessionModal = ({
  isOpen,
  setIsOpen,
  totalCount,
  answeredCount,
  onConfirm
}: FinishSessionModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="p-6">
        <Typography variant="h6" component="h6" className="!mb-4 font-bold">
          ここで終了して結果を表示しますか？
        </Typography>
        <Typography variant="body2" className="!mb-4 text-gray-600 dark:text-gray-400">
          {`${totalCount}問中${answeredCount}問解答済みです。解答済みの問題で分析結果を表示します。残りの問題には戻れません。`}
        </Typography>
        <div className="flex gap-3 justify-end">
          <Button
            label="キャンセル"
            attr={'button-array'}
            variant="outlined"
            color="inherit"
            onClick={() => setIsOpen(false)}
          />
          <Button label="終了して結果を見る" attr={'button-array'} variant="contained" onClick={onConfirm} />
        </div>
      </div>
    </Modal>
  );
};
