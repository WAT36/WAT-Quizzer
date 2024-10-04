import { Card, CardContent, CardHeader } from '@mui/material';
import { AddFileSection } from '../addFileSection/AddFileSection';
import styles from '../Settings.module.css';
import { DeleteFileSection } from '../deleteFileSection/DeleteFileSection';
import { PullDownOptionDto, Message } from 'quizzer-lib';

interface FileConfigSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  filelistoption: PullDownOptionDto[];
  setFilelistoption: React.Dispatch<React.SetStateAction<PullDownOptionDto[]>>;
}

export const FileConfigSection = ({ setMessage, filelistoption, setFilelistoption }: FileConfigSectionProps) => {
  return (
    <Card variant="outlined" className={styles.card}>
      <CardHeader title="問題ファイル" />
      <CardContent>
        <Card variant="outlined">
          <AddFileSection setMessage={setMessage} setFilelistoption={setFilelistoption} />
          <DeleteFileSection filelistoption={filelistoption} setMessage={setMessage} />
        </Card>
      </CardContent>
    </Card>
  );
};
