import { Card, CardContent, CardHeader } from '@mui/material';
import { AddFileSection } from '../addFileSection/AddFileSection';
import styles from '../Settings.module.css';
import { DeleteFileSection } from '../deleteFileSection/DeleteFileSection';
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';

interface FileConfigSectionProps {
  fileName: string;
  deleteFileNum: number;
  filelistoption: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDeleteFileNum?: React.Dispatch<React.SetStateAction<number>>;
  setFileName?: React.Dispatch<React.SetStateAction<string>>;
  setFilelistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const FileConfigSection = ({
  fileName,
  deleteFileNum,
  filelistoption,
  setMessage,
  setDeleteFileNum,
  setFileName,
  setFilelistoption
}: FileConfigSectionProps) => {
  return (
    <>
      <Card variant="outlined" className={styles.card}>
        <CardHeader title="問題ファイル" />
        <CardContent>
          <Card variant="outlined">
            <AddFileSection
              fileName={fileName}
              setMessage={setMessage}
              setFileName={setFileName}
              setFilelistoption={setFilelistoption}
            />
            <DeleteFileSection
              deleteFileNum={deleteFileNum}
              filelistoption={filelistoption}
              setMessage={setMessage}
              setDeleteFileNum={setDeleteFileNum}
            />
          </Card>
        </CardContent>
      </Card>
    </>
  );
};
