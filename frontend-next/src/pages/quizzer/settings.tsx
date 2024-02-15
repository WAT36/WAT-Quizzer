import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { FileConfigSection } from '@/components/ui-forms/quizzer/settings/fileConfigSection/FileConfigSection';
import { DeleteAnswerLogFileSection } from '@/components/ui-forms/quizzer/settings/deleteAnswerLogFileSection/DeleteAnswerLogFileSection';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [fileName, setFileName] = useState<string>('');
  const [fileNum, setFileNum] = useState<number>(-1); // 削除する問題ファイルの番号
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  const [deleteLogOfFileAlertOpen, setDeleteLogOfFileAlertOpen] = React.useState(false);

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const cardStyle = {
    margin: '10px 0'
  };

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

        <Card variant="outlined" style={cardStyle}>
          <CardHeader title="解答データ削除" />
          <CardContent>
            <Card variant="outlined">
              <DeleteAnswerLogFileSection
                deleteLogOfFileNum={deleteLogOfFileNum}
                deleteLogOfFileAlertOpen={deleteLogOfFileAlertOpen}
                filelistoption={filelistoption}
                setMessage={setMessage}
                setDeleteLogOfFileNum={setDeleteLogOfFileNum}
                setDeleteLogOfFileAlertOpen={setDeleteLogOfFileAlertOpen}
              />
            </Card>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'設定'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
