import type { DownloadQuizCsvResult, Message, PullDownOptionDto } from 'quizzer-lib';
import { downloadQuizCsvAPI } from '@/utils/api-wrapper';
import { downloadTextFile } from '@/utils/dom';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useState } from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { SettingsCard } from '../settingsCard/SettingsCard';
import { SettingsCardItem } from '../settingsCardItem/SettingsCardItem';

interface DownloadQuizCsvSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const DownloadQuizCsvSection = ({ filelistoption, setMessage }: DownloadQuizCsvSectionProps) => {
  const [selectedFileNum, setSelectedFileNum] = useState<number>(-1);

  const handleDownload = async () => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
    const result = await downloadQuizCsvAPI({
      downloadQuizCsvRequestData: { file_num: selectedFileNum }
    });
    // モックモードではCSVを返さないので保存しない
    const csv = (result.result as DownloadQuizCsvResult | undefined)?.csv;
    if (result.isSuccess && csv !== undefined) {
      downloadTextFile(csv, 'export.csv');
    }
    setMessage(result.message);
  };

  return (
    <SettingsCard title="問題データCSVダウンロード">
      <SettingsCardItem subheader="ファイル選択" className="flex flex-wrap items-center gap-4">
        <PullDown
          className="w-56"
          optionList={filelistoption}
          onChange={(e) => {
            setSelectedFileNum(+e.target.value);
          }}
        />
        <Button label="CSVダウンロード" variant="contained" attr="after-inline" onClick={handleDownload} />
      </SettingsCardItem>
    </SettingsCard>
  );
};
