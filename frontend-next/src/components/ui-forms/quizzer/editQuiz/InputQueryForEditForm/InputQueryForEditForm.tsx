import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { Button } from '@/components/ui-elements/button/Button';
import {
  EditQuizAPIRequestDto,
  getQuizAPI,
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  getQuizAPIResponseToEditQuizAPIRequestAdapter,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  initEditQuizRequestData,
  initGetQuizRequestData,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface InputQueryForEditFormProps {
  setEditQuizRequestData: React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const InputQueryForEditForm = ({ setEditQuizRequestData }: InputQueryForEditFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

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

  // 問題形式リスト取得
  useEffect(() => {
    // TODO これ　別関数にしたい
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFormatListAPI();
      setMessage(result.message);
      setQuizFormatListoption(result.result ? (result.result as GetQuizFormatApiResponseDto[]) : []);
    })();
  }, [setMessage]);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setQuizRequestData({
      ...getQuizRequestData,
      file_num: +e.target.value
    });
  };

  return (
    <>
      <FormGroup>
        <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        <FormControl>
          <TextField
            label="問題番号"
            setStater={(value: string) => {
              setQuizRequestData({
                ...getQuizRequestData,
                quiz_num: +value
              });
            }}
          />
        </FormControl>

        <FormControl>
          <RadioGroupSection
            sectionTitle={'問題種別'}
            radioGroupProps={{
              radioButtonProps: quizFormatListoption.map((x) => {
                return {
                  value: String(x.id),
                  label: x.name
                };
              }),
              defaultValue: '1',
              setQueryofQuizStater: (value: string) => {
                setQuizRequestData((prev: any) => ({
                  ...prev,
                  format_id: +value
                }));
              }
            }}
          />
        </FormControl>
      </FormGroup>

      <Button
        label={'問題取得'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData });
          setMessage(result.message);
          if (result.result) {
            setEditQuizRequestData({
              ...getQuizAPIResponseToEditQuizAPIRequestAdapter(result.result as GetQuizApiResponseDto)
            });
          } else {
            setEditQuizRequestData(initEditQuizRequestData);
          }
        }}
      />
    </>
  );
};
