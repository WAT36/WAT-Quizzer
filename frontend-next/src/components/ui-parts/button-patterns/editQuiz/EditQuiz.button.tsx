import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { AddQuizApiResponse, ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { MessageState, QueryOfPutQuizState } from '../../../../../interfaces/state';

interface EditQuizButtonProps {
  value: number;
  queryOfEditQuizState: QueryOfPutQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryofEditQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

const editQuizAPI = ({
  value,
  queryOfEditQuizState,
  setMessageStater,
  setQueryofEditQuizStater
}: EditQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setQueryofEditQuizStater) {
    return;
  }
  if (queryOfEditQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfEditQuizState.question || !queryOfEditQuizState.answer) {
    setMessageStater({
      message: 'エラー:問題文及び答えを入力して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  post(
    '/quiz/edit',
    {
      format: queryOfEditQuizState.format,
      file_num: queryOfEditQuizState.fileNum,
      quiz_num: queryOfEditQuizState.quizNum,
      question: queryOfEditQuizState.question,
      answer: queryOfEditQuizState.answer,
      category: queryOfEditQuizState.category,
      img_file: queryOfEditQuizState.img_file,
      matched_basic_quiz_id: queryOfEditQuizState.matched_basic_quiz_id,
      dummy1: queryOfEditQuizState.dummy1,
      dummy2: queryOfEditQuizState.dummy2,
      dummy3: queryOfEditQuizState.dummy3
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
        setMessageStater({
          message: 'Success!! 問題を更新できました!',
          messageColor: 'success.light',
          isDisplay: true
        });
        setQueryofEditQuizStater({
          fileNum: queryOfEditQuizState.fileNum,
          quizNum: -1
        });
        //入力データをクリア
        const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
        if (inputQuizField) {
          inputQuizField.value = '';
        }
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  );
};

export const EditQuizButton = ({
  value,
  queryOfEditQuizState,
  setMessageStater,
  setQueryofEditQuizStater
}: EditQuizButtonProps) => {
  return (
    <>
      <Button
        label={'更新'}
        variant="contained"
        color="primary"
        onClick={(e) => editQuizAPI({ value, queryOfEditQuizState, setMessageStater, setQueryofEditQuizStater })}
      />
    </>
  );
};
