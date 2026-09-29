import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { QuizSettingsPanel } from '@/components/ui-forms/quizzer/getQuiz/quizSettingsPanel/QuizSettingsPanel';
import { QuizSessionResult } from '@/components/ui-forms/quizzer/getQuiz/quizSessionResult/QuizSessionResult';
import { Button } from '@/components/ui-elements/button/Button';
import { useQuizSession } from '@/hooks/useQuizSession';
import { GetQuizAPIRequestDto, initGetQuizRequestData } from 'quizzer-lib';

export default function GetQuizPage() {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const quizSession = useQuizSession();

  const contents = () => {
    return (
      <Container>
        <Button label="出題設定を開く" variant="contained" attr="button-array" onClick={() => setSettingsOpen(true)} />
        <QuizSettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          getQuizRequestData={getQuizRequestData}
          setQuizRequestData={setQuizRequestData}
          onStart={quizSession.startSession}
        />

        {quizSession.status === 'idle' && (
          <Typography variant="body1" className="!mt-4">
            出題設定から条件を設定して出題してください。
          </Typography>
        )}

        {quizSession.status === 'active' && (
          <>
            <Typography variant="subtitle1" className="!mt-4">
              {`${quizSession.totalCount}問中${quizSession.currentIndex + 1}問目 (正解数: ${quizSession.correctCount}/${quizSession.answeredCount})`}
            </Typography>
            <DisplayQuizSection
              getQuizResponseData={quizSession.currentQuiz}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              onAnswer={quizSession.answer}
            />
          </>
        )}

        {quizSession.status === 'finished' && (
          <div className="!mt-4">
            <QuizSessionResult results={quizSession.results} />
            <Button
              label="出題設定に戻る"
              variant="outlined"
              attr="button-array"
              onClick={() => quizSession.resetSession()}
            />
          </div>
        )}
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題出題'} />;
}
