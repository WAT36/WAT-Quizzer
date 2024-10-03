import styles from '../Settings.module.css';
import {
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { MessageState } from '../../../../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useState } from 'react';
import { deleteQuizFileAPI, PullDownOptionDto } from 'quizzer-lib';
import React from 'react';

interface DeleteFileSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>;
}

export const DeleteFileSection = ({ filelistoption, setMessage }: DeleteFileSectionProps) => {
  const [deleteFileNum, setDeleteFileNum] = useState<number>(-1); // 削除する問題ファイルの番号
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setAlertOpen(true);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  // ファイルと問題削除
  const deleteFile = async () => {
    handleClose();
    if (deleteFileNum === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    const result = await deleteQuizFileAPI({ deleteQuizFileApiRequest: { file_id: deleteFileNum } });
    setMessage(result.message);
    if (result.message.messageColor === 'success.light') {
      setDeleteFileNum(-1);
    }
  };

  return (
    <>
      <CardHeader subheader="ファイル削除" />
      <CardContent className={styles.cardContent}>
        <PullDown
          className={'cardContent'}
          optionList={filelistoption}
          onChange={(e) => {
            setDeleteFileNum(+e.target.value);
          }}
        />
        <Button label="削除" variant="contained" attr="after-inline" onClick={() => handleClickOpen()} />
        <Dialog
          open={alertOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              指定ファイルだけでなく、ファイルの問題全ても同時に削除されます。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button label="キャンセル" onClick={handleClose} variant="outlined" />
            <Button
              label="削除"
              onClick={async () => {
                await deleteFile();
              }}
              variant="contained"
            />
          </DialogActions>
        </Dialog>
      </CardContent>
    </>
  );
};
