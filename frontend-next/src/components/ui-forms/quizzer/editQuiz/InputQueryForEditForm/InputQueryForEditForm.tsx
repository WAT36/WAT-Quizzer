import React, { useEffect, useState, useCallback } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import {
  EditQuizAPIRequestDto,
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  getQuizAPIResponseToEditQuizAPIRequestAdapter,
  initEditQuizRequestData,
  initGetQuizRequestData
} from 'quizzer-lib';
import { getQuizAPI } from '@/utils/api-wrapper';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { useRouter } from 'next/router';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';

interface InputQueryForEditFormProps {
  setEditQuizRequestData: React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const InputQueryForEditForm = ({ setEditQuizRequestData }: InputQueryForEditFormProps) => {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  //問題取得ボタン押した時の処理
  const getQuiz = useCallback(
    async (getQuizRequestData: GetQuizAPIRequestDto) => {
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
    },
    [setMessage, setEditQuizRequestData]
  );

  // queryParam idが設定されていた場合、その問題IDの値を初期値設定する
  // TODO できれば前画面から問題の値を持って来させるようにしたい
  const router = useRouter();
  useEffect(() => {
    const { file_num, quiz_num } = router.query;
    if (file_num && quiz_num && !isNaN(+file_num) && !isNaN(+quiz_num)) {
      // URLのクエリ(問題番号)を初期値として取り込むため、effect内でstateを更新する
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuizRequestData({
        file_num: +file_num,
        quiz_num: +quiz_num
      });
      getQuiz({
        file_num: +file_num,
        quiz_num: +quiz_num
      });
    }
  }, [getQuiz, router, setEditQuizRequestData, setMessage]);

  return (
    <>
      <FormGroup>
        <QuizFilePullDown
          onFileChange={(e: SelectChangeEvent<number | string>) => {
            setQuizRequestData({
              ...getQuizRequestData,
              file_num: +e.target.value
            });
          }}
          value={getQuizRequestData.file_num}
        />

        <FormControl>
          <TextField
            label="問題番号"
            value={
              getQuizRequestData.quiz_num && !isNaN(getQuizRequestData.quiz_num) && getQuizRequestData.quiz_num !== -1
                ? String(getQuizRequestData.quiz_num)
                : ''
            }
            setStater={(value: string) => {
              setQuizRequestData({
                ...getQuizRequestData,
                quiz_num: +value
              });
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
          getQuiz(getQuizRequestData);
        }}
      />
    </>
  );
};
