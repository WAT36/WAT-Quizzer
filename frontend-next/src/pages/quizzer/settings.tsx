import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { FileConfigSection } from '@/components/ui-forms/quizzer/settings/fileConfigSection/FileConfigSection';
import { LogConfigSection } from '@/components/ui-forms/quizzer/settings/logConfigSection/LogConfigSection';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useRecoilState(messageState);
  const [fileName, setFileName] = useState<string>('');
  const [fileNum, setFileNum] = useState<number>(-1); // 削除する問題ファイルの番号
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  const [deleteLogOfFileAlertOpen, setDeleteLogOfFileAlertOpen] = React.useState(false);

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, [setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <FileConfigSection
          fileName={fileName}
          deleteFileNum={fileNum}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setDeleteFileNum={setFileNum}
          setFileName={setFileName}
          setFilelistoption={setFilelistoption}
        />

        <LogConfigSection
          deleteLogOfFileNum={deleteLogOfFileNum}
          deleteLogOfFileAlertOpen={deleteLogOfFileAlertOpen}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setDeleteLogOfFileNum={setDeleteLogOfFileNum}
          setDeleteLogOfFileAlertOpen={setDeleteLogOfFileAlertOpen}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'設定'} />
    </>
  );
}
