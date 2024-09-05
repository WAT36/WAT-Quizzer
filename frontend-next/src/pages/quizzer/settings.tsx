import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { FileConfigSection } from '@/components/ui-forms/quizzer/settings/fileConfigSection/FileConfigSection';
import { LogConfigSection } from '@/components/ui-forms/quizzer/settings/logConfigSection/LogConfigSection';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import {
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  getQuizFileListAPI,
  GetQuizFileApiResponseDto
} from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function QuizzerSettingPage({ isMock }: Props) {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [message, setMessage] = useRecoilState(messageState);
  const [fileName, setFileName] = useState<string>('');
  const [fileNum, setFileNum] = useState<number>(-1); // 削除する問題ファイルの番号
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  const [deleteLogOfFileAlertOpen, setDeleteLogOfFileAlertOpen] = React.useState(false);

  useEffect(() => {
    if (!isMock) {
      (async () => {
        setMessage({
          message: '通信中...',
          messageColor: '#d3d3d3',
          isDisplay: true
        });
        const result = await getQuizFileListAPI();
        setMessage(result.message);
        const pullDownOption = result.result
          ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
          : [];
        setFilelistoption(pullDownOption);
      })();
    }
  }, [isMock, setMessage]);

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
