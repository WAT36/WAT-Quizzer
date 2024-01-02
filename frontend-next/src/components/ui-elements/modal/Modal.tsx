import React, { ReactElement } from 'react';
import { Modal as MuiModal } from '@mui/material';

interface ModalProps {
  isOpen: boolean;
  children: ReactElement;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal = ({ isOpen, children, setIsOpen }: ModalProps) => {
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
      >
        {children}
      </MuiModal>
    </>
  );
};
