import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { QuizSettingsPanel } from '@/components/ui-forms/quizzer/getQuiz/quizSettingsPanel/QuizSettingsPanel';
import { QuizSessionResult } from '@/components/ui-forms/quizzer/getQuiz/quizSessionResult/QuizSessionResult';
import { FinishSessionModal } from '@/components/ui-forms/quizzer/getQuiz/finishSessionModal/FinishSessionModal';
import { Button } from '@/components/ui-elements/button/Button';
import { useQuizSession } from '@/hooks/useQuizSession';
import { GetQuizAPIRequestDto, initGetQuizRequestData } from 'quizzer-lib';

export default function GetQuizPage() {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [finishModalOpen, setFinishModalOpen] = useState<boolean>(false);
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
            <div className="!mt-4 mb-3 flex flex-wrap items-center justify-between gap-2">
              <Typography variant="subtitle1">
                {`${quizSession.totalCount}問中${quizSession.currentIndex + 1}問目 (正解数: ${quizSession.correctCount}/${quizSession.answeredCount})`}
              </Typography>
              {/* 1問も解答していなければ分析する結果がないので押せない */}
              <Button
                label="ここで終了"
                size="small"
                variant="outlined"
                color="inherit"
                attr="no-margin"
                disabled={quizSession.answeredCount === 0}
                onClick={() => setFinishModalOpen(true)}
              />
            </div>
            <FinishSessionModal
              isOpen={finishModalOpen}
              setIsOpen={setFinishModalOpen}
              totalCount={quizSession.totalCount}
              answeredCount={quizSession.answeredCount}
              onConfirm={() => {
                setFinishModalOpen(false);
                quizSession.finishSession();
              }}
            />
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
            <QuizSessionResult results={quizSession.results} totalCount={quizSession.totalCount} />
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
