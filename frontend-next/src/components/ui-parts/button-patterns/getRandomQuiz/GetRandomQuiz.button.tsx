import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { QuizViewApiResponse } from '../../../../../interfaces/db';
import { get } from '@/common/API';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../interfaces/state';
import { generateQuizSentense } from '@/common/response';

interface GetRandomQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

const getRandomQuizAPI = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetRandomQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater || !setQueryofQuizStater) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error'
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    format: queryOfQuizState.format
  };
  if (queryOfQuizState.minRate) {
    sendData.min_rate = String(queryOfQuizState.minRate);
  }
  if (queryOfQuizState.maxRate) {
    sendData.max_rate = String(queryOfQuizState.maxRate);
  }
  if (queryOfQuizState.category) {
    sendData.category = String(queryOfQuizState.category);
  }
  if (queryOfQuizState.checked) {
    sendData.checked = String(queryOfQuizState.checked);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
  });
  get(
    '/quiz/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
        setQueryofQuizStater({
          ...queryOfQuizState,
          quizNum: res[0].quiz_num
        });
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          quizSentense: generateQuizSentense(sendData.format, res),
          quizAnswer: res[0].answer,
          checked: res[0].checked || false,
          expanded: false
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black'
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error'
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    sendData
  );
};

export const GetRandomQuizButton = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetRandomQuizButtonProps) => {
  return (
    <>
      <Button
        label={'ランダム出題'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getRandomQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
    </>
  );
};
