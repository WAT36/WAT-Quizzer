import React, { useEffect, useState } from 'react';
import { get } from '../../common/API';
import { Container } from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageCard } from '@/components/ui-parts/messageCard/MessageCard';
import { Title } from '@/components/ui-elements/title/Title';
import { DisplayQuizState, MessageState, PullDownOptionState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizButtonGroup } from '@/components/ui-forms/quizzer/getQuiz/getQuizButtonGroup/GetQuizButtonGroup';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { InputQueryForm } from '@/components/ui-forms/quizzer/getQuiz/inputQueryForm/InputQueryForm';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [queryOfQuiz, setQueryOfQuiz] = useState<QueryOfQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [displayQuiz, setDisplayQuiz] = useState<DisplayQuizState>({
    fileNum: -1,
    quizNum: -1,
    quizSentense: '',
    quizAnswer: '',
    checked: false,
    expanded: false
  });

  useEffect(() => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get('/quiz/file', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const res: QuizFileApiResponse[] = data.body as QuizFileApiResponse[];
        let filelist: PullDownOptionState[] = [];
        for (var i = 0; i < res.length; i++) {
          filelist.push({
            value: String(res[i].file_num),
            label: res[i].file_nickname
          });
        }
        setFilelistoption(filelist);
        setMessage({
          message: '　',
          messageColor: 'common.black'
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    });
  }, []);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <MessageCard messageState={message}></MessageCard>

        <InputQueryForm
          filelistoption={filelistoption}
          categorylistoption={categorylistoption}
          queryOfQuizState={queryOfQuiz}
          displayQuizState={displayQuiz}
          setMessageStater={setMessage}
          setCategorylistoption={setCategorylistoption}
          setQueryofQuizStater={setQueryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
        />

        <GetQuizButtonGroup
          queryOfQuizState={queryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
          setMessageStater={setMessage}
          setQueryofQuizStater={setQueryOfQuiz}
        />

        <DisplayQuizSection
          queryOfQuizState={queryOfQuiz}
          displayQuizState={displayQuiz}
          setMessageStater={setMessage}
          setDisplayQuizStater={setDisplayQuiz}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題出題'} />
    </>
  );
}
