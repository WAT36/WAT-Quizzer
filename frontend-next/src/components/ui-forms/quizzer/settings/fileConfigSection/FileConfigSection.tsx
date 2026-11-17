import { SettingsCard } from '../settingsCard/SettingsCard';
import { AddFileSection } from '../addFileSection/AddFileSection';
import { DeleteFileSection } from '../deleteFileSection/DeleteFileSection';
import type { PullDownOptionDto, Message } from 'quizzer-lib';

interface FileConfigSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  filelistoption: PullDownOptionDto[];
  // ファイルを追加・削除した後に呼ぶ（一覧を取り直すため）
  onFileListChanged?: () => Promise<void> | void;
}

export const FileConfigSection = ({ setMessage, filelistoption, onFileListChanged }: FileConfigSectionProps) => {
  return (
    <SettingsCard title="問題ファイル">
      <AddFileSection setMessage={setMessage} onFileAdded={onFileListChanged} />
      <DeleteFileSection filelistoption={filelistoption} setMessage={setMessage} onFileDeleted={onFileListChanged} />
    </SettingsCard>
  );
};
