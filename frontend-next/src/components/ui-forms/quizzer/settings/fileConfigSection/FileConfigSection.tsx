import { SettingsCard } from '../settingsCard/SettingsCard';
import { AddFileSection } from '../addFileSection/AddFileSection';
import { DeleteFileSection } from '../deleteFileSection/DeleteFileSection';
import type { PullDownOptionDto, Message } from 'quizzer-lib';

interface FileConfigSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  filelistoption: PullDownOptionDto[];
}

export const FileConfigSection = ({ setMessage, filelistoption }: FileConfigSectionProps) => {
  return (
    <SettingsCard title="問題ファイル">
      <AddFileSection setMessage={setMessage} />
      <DeleteFileSection filelistoption={filelistoption} setMessage={setMessage} />
    </SettingsCard>
  );
};
