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

        {/* 動作確認用の仮UI。DisplayQuizSectionとの統合後に削除予定 */}
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
        <Typography variant="body2" component="pre" className="!mt-2">
          {`status: ${quizSession.status}\n` +
            `取得問題数: ${quizSession.totalCount}\n` +
            `現在: ${quizSession.currentIndex + 1} / ${quizSession.totalCount}\n` +
            `正解数: ${quizSession.correctCount} / ${quizSession.answeredCount}\n` +
            `現在の問題文: ${quizSession.currentQuiz.quiz_sentense ?? ''}`}
        </Typography>
        {quizSession.status === 'active' && (
          <>
            <Button
              label="正解!!(セッション)"
              variant="contained"
              color="primary"
              attr="button-array"
              onClick={() => quizSession.answer(true)}
            />
            <Button
              label="不正解...(セッション)"
              variant="contained"
              color="secondary"
              attr="button-array"
              onClick={() => quizSession.answer(false)}
            />
          </>
        )}
        {quizSession.status === 'finished' && quizSession.totalCount > 0 && (
          <Button
            label="出題設定に戻る"
            variant="outlined"
            attr="button-array"
            onClick={() => quizSession.resetSession()}
          />
        )}
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題出題'} />;
}
