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
import { patch } from '@/common/API';
import { ProcessingApiReponse } from '../../../../../../interfaces/api/response';

interface DeleteAnswerLogFileSectionProps {
  deleteLogOfFileNum: number;
  deleteLogOfFileAlertOpen: boolean;
  filelistoption: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDeleteLogOfFileNum?: React.Dispatch<React.SetStateAction<number>>;
  setDeleteLogOfFileAlertOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteAnswerLogFileSection = ({
  deleteLogOfFileNum,
  deleteLogOfFileAlertOpen,
  filelistoption,
  setMessage,
  setDeleteLogOfFileNum,
  setDeleteLogOfFileAlertOpen
}: DeleteAnswerLogFileSectionProps) => {
  // 指定ファイルのこれまでの回答データ削除
  const deleteAnswerData = () => {
    // 設定ステートない場合はreturn(storybook表示用に設定)
    if (!setMessage || !setDeleteLogOfFileNum || !setDeleteLogOfFileAlertOpen) {
      return;
    }

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
    patch(
      '/quiz/answer_log/file',
      {
        file_id: deleteLogOfFileNum
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `回答ログを削除しました(id:${deleteLogOfFileNum})`,
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
    setDeleteLogOfFileNum(-1);
  };

  return (
    <>
      <CardHeader subheader="ファイル選択" />
      <CardContent className={styles.cardContent}>
        <PullDown
          label={'問題ファイル'}
          optionList={filelistoption}
          onChange={(e) => {
            setDeleteLogOfFileNum && setDeleteLogOfFileNum(+e.target.value);
          }}
        />
        <Button
          label="削除"
          variant="contained"
          attr="after-inline"
          onClick={(e) => setDeleteLogOfFileAlertOpen && setDeleteLogOfFileAlertOpen(true)}
        />
        <Dialog
          open={deleteLogOfFileAlertOpen}
          onClose={(e) => setDeleteLogOfFileAlertOpen && setDeleteLogOfFileAlertOpen(false)}
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
            <Button
              label="キャンセル"
              onClick={(e) => setDeleteLogOfFileAlertOpen && setDeleteLogOfFileAlertOpen(false)}
              variant="outlined"
            />
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
