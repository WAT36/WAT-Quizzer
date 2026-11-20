import type { ReactElement } from 'react';
import React from 'react';
import { Modal as MuiModal } from '@mui/material';

interface ModalProps {
  isOpen: boolean;
  children: ReactElement;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  // 中身の最大幅（Tailwindのクラス）。画像の一覧など広い内容を出すモーダルで指定する
  maxWidthClassName?: string;
}

export const Modal = ({ isOpen, children, setIsOpen, maxWidthClassName = 'max-w-md' }: ModalProps) => {
  const handleClose = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };
  return (
    <>
      <MuiModal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center p-4"
      >
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${maxWidthClassName} w-full mx-4`}>
          {children}
        </div>
      </MuiModal>
    </>
  );
};
