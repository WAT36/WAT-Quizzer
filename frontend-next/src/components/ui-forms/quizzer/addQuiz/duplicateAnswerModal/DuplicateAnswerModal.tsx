import React from 'react';
import { Typography } from '@mui/material';
import { GetQuizApiResponseDto } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { Modal } from '@/components/ui-elements/modal/Modal';

interface DuplicateAnswerModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  duplicateQuizzes: GetQuizApiResponseDto[];
  answer: string;
  onConfirm: () => void;
}

export const DuplicateAnswerModal = ({ isOpen, setIsOpen, duplicateQuizzes, answer, onConfirm }: DuplicateAnswerModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="p-6">
        <Typography variant="h6" component="h6" className="!mb-4 font-bold text-red-600">
          同じ答えの問題がすでに登録されています
        </Typography>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {duplicateQuizzes.map((q) => (
            <div key={q.id} className="mb-2 p-2 border border-gray-200 dark:border-gray-700 rounded text-sm">
              <span className="font-semibold">問題文：</span>
              {q.quiz_sentense}
            </div>
          ))}
        </div>
        <Typography variant="body2" className="!mb-4 text-gray-600 dark:text-gray-400">
          答え：<strong>{answer}</strong>
        </Typography>
        <div className="flex gap-3 justify-end">
          <Button
            label="キャンセル"
            attr={'button-array'}
            variant="outlined"
            color="inherit"
            onClick={() => setIsOpen(false)}
          />
          <Button
            label="それでも登録する"
            attr={'button-array'}
            variant="contained"
            color="warning"
            onClick={onConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};
