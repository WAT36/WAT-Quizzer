import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { QuizViewApiResponse } from '../../../../../interfaces/db';
import { get } from '@/common/API';
import { DisplayQuizState, MessageState } from '../../../../../interfaces/state';
import { generateQuizSentense } from '@/common/response';

interface GetQuizButtonProps {
  file_num: number;
  quiz_num: number;
  format: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

const getQuizAPI = ({ file_num, quiz_num, format, setMessageStater, setDisplayQuizStater }: GetQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater) {
    return;
  }
  if (file_num === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error'
    });
    return;
  } else if (!quiz_num) {
    setMessageStater({
      message: 'エラー:問題番号を入力して下さい',
      messageColor: 'error'
    });
    return;
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
  });
  get(
    '/quiz',
    (data: ProcessingApiReponse) => {
      if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error'
        });
      } else if (data.status === 200) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          quizSentense: generateQuizSentense(format, res),
          quizAnswer: res[0].answer,
          checked: res[0].checked || false,
          expanded: false
        });
        setMessageStater({
          message: '　',
          messageColor: 'success.light'
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    {
      file_num: String(file_num),
      quiz_num: String(quiz_num),
      format
    }
  );
};

export const GetQuizButton = ({
  file_num,
  quiz_num,
  format,
  setMessageStater,
  setDisplayQuizStater
}: GetQuizButtonProps) => {
  return (
    <>
      <Button
        label={'出題'}
        variant="contained"
        color="primary"
        onClick={(e) => getQuizAPI({ file_num, quiz_num, format, setMessageStater, setDisplayQuizStater })}
      />
    </>
  );
};
