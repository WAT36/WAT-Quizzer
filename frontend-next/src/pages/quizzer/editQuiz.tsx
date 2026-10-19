import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { InputQueryForEditForm } from '@/components/ui-forms/quizzer/editQuiz/InputQueryForEditForm/InputQueryForEditForm';
import type { EditQuizAPIRequestDto } from 'quizzer-lib';
import { initEditQuizRequestData } from 'quizzer-lib';
import { EditQuizForm } from '@/components/ui-forms/quizzer/editQuiz/editQuizForm/EditQuizForm';

export default function EditQuizPage() {
  const [editQuizRequestData, setEditQuizRequestData] = useState<EditQuizAPIRequestDto>(initEditQuizRequestData);
  const contents = () => {
    return (
      <Container className="!py-4">
        <InputQueryForEditForm setEditQuizRequestData={setEditQuizRequestData} />
        <EditQuizForm editQuizRequestData={editQuizRequestData} setEditQuizRequestData={setEditQuizRequestData} />
      </Container>
    );
  };
  return <Layout mode="quizzer" contents={contents()} title={'問題編集'} />;
}
