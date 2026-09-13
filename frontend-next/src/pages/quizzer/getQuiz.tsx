import React, { useState } from 'react';
import { Container, Divider, Typography } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { GetQuizButtonGroup } from '@/components/ui-forms/quizzer/getQuiz/getQuizButtonGroup/GetQuizButtonGroup';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { InputQueryForm } from '@/components/ui-forms/quizzer/getQuiz/inputQueryForm/InputQueryForm';
import { QuizSettingsPanel } from '@/components/ui-forms/quizzer/getQuiz/quizSettingsPanel/QuizSettingsPanel';
import { Button } from '@/components/ui-elements/button/Button';
import { useQuizSession } from '@/hooks/useQuizSession';
import {
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  initGetQuizRequestData,
  initGetQuizResponseData
} from 'quizzer-lib';

export default function GetQuizPage() {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [getQuizResponseData, setQuizResponseData] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [sessionImageUrl, setSessionImageUrl] = useState<string>('');
  const quizSession = useQuizSession();

  const contents = () => {
    return (
      <Container>
        <InputQueryForm getQuizRequestData={getQuizRequestData} setQuizRequestData={setQuizRequestData} />
        <GetQuizButtonGroup
          getQuizRequestData={getQuizRequestData}
          getQuizResponseData={getQuizResponseData}
          setQuizResponseData={setQuizResponseData}
          setImageUrl={setImageUrl}
        />
        <DisplayQuizSection
          getQuizResponseData={getQuizResponseData}
          setQuizResponseData={setQuizResponseData}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />

        <Divider className="!my-6" />

        {/* 動作確認用の仮UI。旧UI撤去後にメインの出題画面として整理予定 */}
        <Typography variant="subtitle1" component="h2">
          出題設定(新) - 動作確認中
        </Typography>
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
              imageUrl={sessionImageUrl}
              setImageUrl={setSessionImageUrl}
              onAnswer={quizSession.answer}
            />
          </>
        )}

        {quizSession.status === 'finished' && (
          <div className="!mt-4">
            <Typography variant="subtitle1">
              {`${quizSession.totalCount}問中${quizSession.correctCount}問正解でした`}
            </Typography>
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
