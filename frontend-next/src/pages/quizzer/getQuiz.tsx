import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { DisplayQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizButtonGroup } from '@/components/ui-forms/quizzer/getQuiz/getQuizButtonGroup/GetQuizButtonGroup';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { InputQueryForm } from '@/components/ui-forms/quizzer/getQuiz/inputQueryForm/InputQueryForm';
import {
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  initGetQuizRequestData,
  initGetQuizResponseData
} from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function GetQuizPage({ isMock }: Props) {
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
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [getQuizResponseData, setQuizResponseData] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <InputQueryForm getQuizRequestData={getQuizRequestData} setQuizRequestData={setQuizRequestData} />

        <GetQuizButtonGroup
          getQuizRequestData={getQuizRequestData}
          setQuizResponseData={setQuizResponseData}
          queryOfQuizState={queryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
          setQueryofQuizStater={setQueryOfQuiz}
        />

        <DisplayQuizSection getQuizResponseData={getQuizResponseData} setQuizResponseData={setQuizResponseData} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題出題'} />
    </>
  );
}
