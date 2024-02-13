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
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useState } from 'react';
import { del } from '@/common/API';
import { ProcessingApiReponse } from '../../../../../../interfaces/api/response';

interface DeleteFileSectionProps {
  deleteFileNum: number;
  filelistoption: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDeleteFileNum?: React.Dispatch<React.SetStateAction<number>>;
}

export const DeleteFileSection = ({
  deleteFileNum,
  filelistoption,
  setMessage,
  setDeleteFileNum
}: DeleteFileSectionProps) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setAlertOpen(true);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  // ファイルと問題削除
  const deleteFile = () => {
    // 設定ステートない場合はreturn(storybook表示用に設定)
    if (!setMessage || !setDeleteFileNum) {
      return;
    }

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
    del(
      '/quiz/file',
      {
        file_id: deleteFileNum
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `ファイルを削除しました(id:${deleteFileNum})`,
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
    setDeleteFileNum(-1);
  };

  return (
    <>
      <CardHeader subheader="ファイル削除" />
      <CardContent className={styles.cardContent}>
        <PullDown
          label={'問題ファイル'}
          optionList={filelistoption}
          onChange={(e) => {
            setDeleteFileNum && setDeleteFileNum(+e.target.value);
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
              onClick={() => {
                deleteFile();
              }}
              variant="contained"
            />
          </DialogActions>
        </Dialog>
      </CardContent>
    </>
  );
};
