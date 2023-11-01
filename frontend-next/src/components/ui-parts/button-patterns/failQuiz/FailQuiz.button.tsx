import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../interfaces/state';

interface FailQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

const failQuizAPI = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: FailQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater) {
    return;
  }

  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfQuizState.quizNum) {
    setMessageStater({
      message: 'エラー:問題番号を入力して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!displayQuizState.quizSentense || !displayQuizState.quizAnswer) {
    setMessageStater({
      message: 'エラー:問題を出題してから登録して下さい',
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
    '/quiz/fail',
    {
      format: queryOfQuizState.format,
      file_num: queryOfQuizState.fileNum,
      quiz_num: queryOfQuizState.quizNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setDisplayQuizStater({
          ...displayQuizState,
          quizSentense: '',
          quizAnswer: '',
          checked: false,
          expanded: false
        });
        setMessageStater({
          message: `問題[${queryOfQuizState.quizNum}] 不正解+1.. 登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
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

export const FailQuizButton = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: FailQuizButtonProps) => {
  return (
    <>
      <Button
        label={'不正解...'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          failQuizAPI({
            queryOfQuizState,
            displayQuizState,
            setMessageStater,
            setDisplayQuizStater
          })
        }
      />
    </>
  );
};
