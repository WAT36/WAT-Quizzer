import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { InputQueryForEditForm } from '@/components/ui-forms/quizzer/editQuiz/InputQueryForEditForm/InputQueryForEditForm';
import { PutQuizForm } from '@/components/ui-forms/quizzer/forms/putQuizForm/PutQuizForm';
import { Button } from '@/components/ui-elements/button/Button';
import { editQuizAPI, EditQuizAPIRequestDto, initEditQuizRequestData } from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function EditQuizPage({ isMock }: Props) {
  const [editQuizRequestData, setEditQuizRequestData] = useState<EditQuizAPIRequestDto>(initEditQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <InputQueryForEditForm setEditQuizRequestData={setEditQuizRequestData} />
        <PutQuizForm putQuizRequestData={editQuizRequestData} setPutQuizRequestData={setEditQuizRequestData} />
        <Button
          label={'更新'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={async (e) => {
            setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
            const result = await editQuizAPI({ editQuizRequestData });
            setMessage(result.message);
            // TODO 成功時の判定法
            if (result.message.messageColor === 'success.light') {
              setEditQuizRequestData(initEditQuizRequestData);
            }
          }}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題編集'} />
    </>
  );
}
