import type { PullDownOptionDto } from 'quizzer-lib';
import { downloadQuizCsvAPI } from '@/utils/api-wrapper';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useState } from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { SettingsCard } from '../settingsCard/SettingsCard';
import { SettingsCardItem } from '../settingsCardItem/SettingsCardItem';

interface DownloadQuizCsvSectionProps {
  filelistoption: PullDownOptionDto[];
}

export const DownloadQuizCsvSection = ({ filelistoption }: DownloadQuizCsvSectionProps) => {
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  return (
    <SettingsCard title="問題データCSVダウンロード">
      <SettingsCardItem subheader="ファイル選択" className="flex flex-wrap items-center gap-4">
        <PullDown
          className="w-56"
          optionList={filelistoption}
          onChange={(e) => {
            setDeleteLogOfFileNum(+e.target.value);
          }}
        />
        <Button
          label="CSVダウンロード"
          variant="contained"
          attr="after-inline"
          onClick={(e) =>
            downloadQuizCsvAPI({
              downloadQuizCsvApiRequest: { file_num: deleteLogOfFileNum }
            })
          }
        />
      </SettingsCardItem>
    </SettingsCard>
  );
};
