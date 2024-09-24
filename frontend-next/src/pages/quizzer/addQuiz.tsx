import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { QueryOfPutQuizState } from '../../../interfaces/state';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { Title } from '@/components/ui-elements/title/Title';
import { AddQuizForm } from '@/components/ui-forms/quizzer/addQuiz/addQuizForm/AddQuizForm';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { addQuizAPI } from '@/api/quiz/addQuizAPI';

type Props = {
  isMock?: boolean;
};

export default function AddQuizPage({ isMock }: Props) {
  const [queryOfAddQuiz, setQueryOfAddQuiz] = useState<QueryOfPutQuizState>({
    fileNum: -1,
    quizNum: -1
  });
  const [message, setMessage] = useRecoilState(messageState);
  const [addLog, setAddLog] = useState<string>('');

  const [value, setValue] = React.useState(0);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <AddQuizForm
          value={value}
          queryOfPutQuizState={queryOfAddQuiz}
          setValue={setValue}
          setQueryofPutQuizStater={setQueryOfAddQuiz}
        />

        <Button
          label="問題登録"
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={(e) =>
            addQuizAPI({
              value,
              queryOfAddQuizState: queryOfAddQuiz,
              setAddLog,
              setMessageStater: setMessage,
              setQueryofAddQuizStater: setQueryOfAddQuiz
            })
          }
        />

        <AddQuizLogSection log={addLog} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
