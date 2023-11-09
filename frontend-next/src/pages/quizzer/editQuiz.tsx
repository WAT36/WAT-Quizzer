import React, { useEffect, useState } from 'react';

import { post } from '../../common/API';
import { buttonStyle } from '../../styles/Pages';
import { Button, Container } from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfPutQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { InputQueryForEditForm } from '@/components/ui-forms/quizzer/editQuiz/InputQueryForEditForm/InputQueryForEditForm';
import { PutQuizForm } from '@/components/ui-forms/quizzer/forms/putQuizForm/PutQuizForm';

export default function EditQuizPage() {
  const [edit_format, setEditFormat] = useState<string>();
  const [edit_file_num, setEditFileNum] = useState<number>();
  const [edit_quiz_num, setEditQuizNum] = useState<number>();
  const [edit_question, setEditQuestion] = useState<string>();
  const [edit_answer, setEditAnswer] = useState<string>();
  const [edit_category, setEditCategory] = useState<string>();
  const [edit_image, setEditImage] = useState<string>();
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

  const editQuiz = () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    post(
      '/quiz/edit',
      {
        file_num: edit_file_num,
        quiz_num: edit_quiz_num,
        question: edit_question,
        answer: edit_answer,
        category: edit_category,
        img_file: edit_image,
        format: edit_format
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setEditFormat('');
          setEditFileNum(-1);
          setEditQuizNum(-1);
          setEditQuestion('');
          setEditAnswer('');
          setEditCategory('');
          setEditImage('');
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
  };

  const contents = () => {
    console.log(`queryOfEditQuiz:${JSON.stringify(queryOfEditQuiz)}`);
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

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => editQuiz()}>
          更新
        </Button>
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
