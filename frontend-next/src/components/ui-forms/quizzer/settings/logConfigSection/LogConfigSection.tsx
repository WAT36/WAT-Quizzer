import { Card, CardContent, CardHeader } from '@mui/material';
import styles from '../Settings.module.css';
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';
import { DeleteAnswerLogFileSection } from '../deleteAnswerLogFileSection/DeleteAnswerLogFileSection';

interface LogConfigSectionProps {
  deleteLogOfFileNum: number;
  deleteLogOfFileAlertOpen: boolean;
  filelistoption: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDeleteLogOfFileNum?: React.Dispatch<React.SetStateAction<number>>;
  setDeleteLogOfFileAlertOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LogConfigSection = ({
  deleteLogOfFileNum,
  deleteLogOfFileAlertOpen,
  filelistoption,
  setMessage,
  setDeleteLogOfFileNum,
  setDeleteLogOfFileAlertOpen
}: LogConfigSectionProps) => {
  return (
    <>
      <Card variant="outlined" className={styles.card}>
        <CardHeader title="解答データ削除" />
        <CardContent>
          <Card variant="outlined">
            <DeleteAnswerLogFileSection
              deleteLogOfFileNum={deleteLogOfFileNum}
              deleteLogOfFileAlertOpen={deleteLogOfFileAlertOpen}
              filelistoption={filelistoption}
              setMessage={setMessage}
              setDeleteLogOfFileNum={setDeleteLogOfFileNum}
              setDeleteLogOfFileAlertOpen={setDeleteLogOfFileAlertOpen}
            />
          </Card>
        </CardContent>
      </Card>
    </>
  );
};
