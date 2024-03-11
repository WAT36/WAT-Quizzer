import React, { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfPutQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { InputQueryForEditForm } from '@/components/ui-forms/quizzer/editQuiz/InputQueryForEditForm/InputQueryForEditForm';
import { PutQuizForm } from '@/components/ui-forms/quizzer/forms/putQuizForm/PutQuizForm';
import { Button } from '@/components/ui-elements/button/Button';
import { editQuizAPI } from '@/common/ButtonAPI';

export default function EditQuizPage() {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
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
          setMessageStater={setMessage}
          setQueryOfEditQuizStater={setQueryOfEditQuiz}
        />

        <PutQuizForm
          value={queryOfEditQuiz.formatValue || 0}
          queryOfPutQuizState={queryOfEditQuiz}
          setQueryofPutQuizStater={setQueryOfEditQuiz}
        />
        <Button
          label={'更新'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={(e) => editQuizAPI({ queryOfEditQuiz, setMessage, setQueryOfEditQuiz })}
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
