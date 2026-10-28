import type { ReactNode } from 'react';
import React from 'react';
import { Typography } from '@mui/material';
import { Modal } from '@/components/ui-elements/modal/Modal';

interface DialogModalProps {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title: ReactNode;
  children?: ReactNode;
  // 右寄せで並べるボタン類
  actions?: ReactNode;
}

// タイトル・本文・ボタン列の3段で構成するモーダル（入力フォームや確認ダイアログで共通のレイアウト）
// globals.cssの「* { padding: 0; margin: 0 }」がTailwindの余白クラスより優先されるため、余白は!付きで指定する
export const DialogModal = ({ isOpen, setIsOpen, title, children, actions }: DialogModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="!p-6">
        <Typography id="modal-modal-title" variant="h6" component="h2" className="!mb-4 font-bold">
          {title}
        </Typography>
        {children && (
          <div id="modal-modal-description" className="!mb-4">
            {children}
          </div>
        )}
        {actions && <div className="flex gap-3 justify-end">{actions}</div>}
      </div>
    </Modal>
  );
};
