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
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { deleteAnswerLogOfQuizFileAPI, PullDownOptionDto, Message } from 'quizzer-lib';
import { useState } from 'react';
import React from 'react';

interface DeleteAnswerLogFileSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const DeleteAnswerLogFileSection = ({ filelistoption, setMessage }: DeleteAnswerLogFileSectionProps) => {
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  const [deleteLogOfFileAlertOpen, setDeleteLogOfFileAlertOpen] = useState<boolean>(false);

  // 指定ファイルのこれまでの回答データ削除
  const deleteAnswerData = async () => {
    setDeleteLogOfFileAlertOpen(false);

    if (deleteLogOfFileNum === -1) {
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
    const result = await deleteAnswerLogOfQuizFileAPI({ deleteLogOfFileRequest: { file_id: deleteLogOfFileNum } });
    setMessage(result.message);
    if (result.message.messageColor === 'success.light') {
      setDeleteLogOfFileNum(-1);
    }
  };

  return (
    <>
      <CardHeader subheader="ファイル選択" />
      <CardContent className={styles.cardContent}>
        <PullDown
          className={'cardContent'}
          optionList={filelistoption}
          onChange={(e) => {
            setDeleteLogOfFileNum(+e.target.value);
          }}
        />
        <Button
          label="削除"
          variant="contained"
          attr="after-inline"
          onClick={(e) => setDeleteLogOfFileAlertOpen(true)}
        />
        <Dialog
          open={deleteLogOfFileAlertOpen}
          onClose={(e) => setDeleteLogOfFileAlertOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              指定ファイルのこれまでの回答データが削除されます。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button label="キャンセル" onClick={(e) => setDeleteLogOfFileAlertOpen(false)} variant="outlined" />
            <Button
              label="削除"
              onClick={(e) => {
                deleteAnswerData();
              }}
              variant="contained"
            />
          </DialogActions>
        </Dialog>
      </CardContent>
    </>
  );
};
