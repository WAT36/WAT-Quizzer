import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { FileConfigSection } from '@/components/ui-forms/quizzer/settings/fileConfigSection/FileConfigSection';
import { LogConfigSection } from '@/components/ui-forms/quizzer/settings/logConfigSection/LogConfigSection';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { DownloadQuizCsvSection } from '@/components/ui-forms/quizzer/settings/downloadQuizCsvSection/DownloadQuizCsvSection';
import { CategoryParentChildConfigSection } from '@/components/ui-forms/quizzer/settings/categoryParentChildConfigSection/CategoryParentChildConfigSection';
import { CategoryCleanupSection } from '@/components/ui-forms/quizzer/settings/categoryCleanupSection/CategoryCleanupSection';
import { useQuizFileList } from '@/hooks/useQuizFileList';

export default function QuizzerSettingPage() {
  const { filelistoption } = useQuizFileList();
  const setMessage = useSetRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <FileConfigSection setMessage={setMessage} filelistoption={filelistoption} />
        <LogConfigSection filelistoption={filelistoption} setMessage={setMessage} />
        <DownloadQuizCsvSection filelistoption={filelistoption} setMessage={setMessage} />
        <CategoryParentChildConfigSection filelistoption={filelistoption} setMessage={setMessage} />
        <CategoryCleanupSection setMessage={setMessage} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'設定'} />;
}
