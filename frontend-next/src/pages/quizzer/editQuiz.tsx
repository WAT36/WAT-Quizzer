import React, { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfPutQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { InputQueryForEditForm } from '@/components/ui-forms/quizzer/editQuiz/InputQueryForEditForm/InputQueryForEditForm';
import { PutQuizForm } from '@/components/ui-forms/quizzer/forms/putQuizForm/PutQuizForm';
import { EditQuizButton } from '@/components/ui-parts/button-patterns/editQuiz/EditQuiz.button';

export default function EditQuizPage() {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  const [queryOfQuiz, setQueryOfQuiz] = useState<QueryOfQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [queryOfEditQuiz, setQueryOfEditQuiz] = useState<QueryOfPutQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic',
    formatValue: 0
  });
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <InputQueryForEditForm
          filelistoption={filelistoption}
          queryOfQuizState={queryOfQuiz}
          setMessageStater={setMessage}
          setQueryofQuizStater={setQueryOfQuiz}
          setQueryOfEditQuizStater={setQueryOfEditQuiz}
        />

        <PutQuizForm
          value={queryOfEditQuiz.formatValue || 0}
          queryOfPutQuizState={queryOfEditQuiz}
          setQueryofPutQuizStater={setQueryOfEditQuiz}
        />

        <EditQuizButton
          value={queryOfEditQuiz.formatValue || 0}
          queryOfEditQuizState={queryOfEditQuiz}
          setMessageStater={setMessage}
          setQueryofEditQuizStater={setQueryOfEditQuiz}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'問題編集'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
