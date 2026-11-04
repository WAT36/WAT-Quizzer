import { SettingsCard } from '../settingsCard/SettingsCard';
import { DeleteAnswerLogFileSection } from '../deleteAnswerLogFileSection/DeleteAnswerLogFileSection';
import type { PullDownOptionDto, Message } from 'quizzer-lib';

interface LogConfigSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const LogConfigSection = ({ filelistoption, setMessage }: LogConfigSectionProps) => {
  return (
    <SettingsCard title="解答データ削除">
      <DeleteAnswerLogFileSection filelistoption={filelistoption} setMessage={setMessage} />
    </SettingsCard>
  );
};
