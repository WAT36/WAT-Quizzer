import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { PutQuizForm } from '../../forms/putQuizForm/PutQuizForm';
import {
  addQuizAPI,
  AddQuizAPIRequestDto,
  AddQuizApiResponseDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  initAddQuizRequestData,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';

interface AddQuizFormProps {
  setAddLog: React.Dispatch<React.SetStateAction<string>>;
}

export const AddQuizForm = ({ setAddLog }: AddQuizFormProps) => {
  const [addQuizRequestData, setAddQuizRequestData] = useState<AddQuizAPIRequestDto>(initAddQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <FormGroup>
        <PutQuizForm putQuizRequestData={addQuizRequestData} setPutQuizRequestData={setAddQuizRequestData} />
      </FormGroup>
      <Button
        label="問題登録"
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await addQuizAPI({
            addQuizRequestData
          });
          setMessage(result.message);
          setAddLog((result.result as AddQuizApiResponseDto).log || '');
          result.message.messageColor === 'success.light' && setAddQuizRequestData(initAddQuizRequestData);
        }}
      />
    </>
  );
};
