import { Card, CardContent, CardHeader } from '@mui/material';
import { AddFileSection } from '../addFileSection/AddFileSection';
import { DeleteFileSection } from '../deleteFileSection/DeleteFileSection';
import type { PullDownOptionDto, Message } from 'quizzer-lib';

interface FileConfigSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  filelistoption: PullDownOptionDto[];
}

export const FileConfigSection = ({ setMessage, filelistoption }: FileConfigSectionProps) => {
  return (
    <Card variant="outlined" className="!my-[10px]">
      <CardHeader title="問題ファイル" />
      <CardContent>
        <Card variant="outlined">
          <AddFileSection setMessage={setMessage} />
          <DeleteFileSection filelistoption={filelistoption} setMessage={setMessage} />
        </Card>
      </CardContent>
    </Card>
  );
};
