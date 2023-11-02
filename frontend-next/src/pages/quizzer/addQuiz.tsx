import React, { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfAddQuizState } from '../../../interfaces/state';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { AddQuizButton } from '@/components/ui-parts/button-patterns/addQuiz/AddQuiz.button';
import { AddQuizForm } from '@/components/ui-forms/quizzer/addQuiz/addQuizForm/AddQuizForm';

export default function AddQuizPage() {
  const [queryOfAddQuiz, setQueryOfAddQuiz] = useState<QueryOfAddQuizState>({
    fileNum: -1
  });
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [addLog, setAddLog] = useState<string>('');
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [value, setValue] = React.useState(0);

  // 問題ファイルリスト取得
  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <AddQuizForm
          filelistoption={filelistoption}
          value={value}
          queryOfAddQuizState={queryOfAddQuiz}
          setValue={setValue}
          setQueryofAddQuizStater={setQueryOfAddQuiz}
        />

        <AddQuizButton
          value={value}
          queryOfAddQuizState={queryOfAddQuiz}
          setAddLog={setAddLog}
          setMessageStater={setMessage}
          setQueryofAddQuizStater={setQueryOfAddQuiz}
        />

        <AddQuizLogSection log={addLog} />
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'問題追加'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
