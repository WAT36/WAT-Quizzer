import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { QuizApiResponse, QuizViewApiResponse } from '../../../../../interfaces/db';
import { get } from '@/common/API';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../interfaces/state';

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

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
  });
  get(
    '/quiz/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          quizSentense: res[0].quiz_sentense,
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
    {
      file_num: String(queryOfQuizState.fileNum),
      min_rate: String(queryOfQuizState.minRate),
      max_rate: String(queryOfQuizState.maxRate),
      category: String(queryOfQuizState.category) || '',
      checked: String(queryOfQuizState.checked),
      format: queryOfQuizState.format
    }
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
