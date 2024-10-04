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
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [addQuizRequestData, setAddQuizRequestData] = useState<AddQuizAPIRequestDto>(initAddQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  // ファイル選択の切り替え
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setAddQuizRequestData((prev) => ({
      ...prev,
      file_num: +e.target.value
    }));
  };

  return (
    <>
      <FormGroup>
        <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
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
