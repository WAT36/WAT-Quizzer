import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { AddQuizApiResponse, ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { MessageState, QueryOfAddQuizState } from '../../../../../interfaces/state';

interface AddQuizButtonProps {
  value: number;
  queryOfAddQuizState: QueryOfAddQuizState;
  setAddLog?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryofAddQuizStater?: React.Dispatch<React.SetStateAction<QueryOfAddQuizState>>;
}

const addQuizAPI = ({
  value,
  queryOfAddQuizState,
  setAddLog,
  setMessageStater,
  setQueryofAddQuizStater
}: AddQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setAddLog || !setMessageStater || !setQueryofAddQuizStater) {
    return;
  }
  if (queryOfAddQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error'
    });
    return;
  } else if (!queryOfAddQuizState.question || !queryOfAddQuizState.answer) {
    setMessageStater({
      message: 'エラー:問題文及び答えを入力して下さい',
      messageColor: 'error'
    });
    return;
  }

  // 問題形式によりAPI決定
  let apiPath;
  switch (value) {
    case 0:
      apiPath = '/quiz/add';
      break;
    case 1:
      apiPath = '/quiz/advanced';
      break;
    case 2:
      apiPath = '/quiz/advanced/4choice';
      break;
    default:
      setMessageStater({
        message: `エラー：問題形式不正:${value}`,
        messageColor: 'error'
      });
      return;
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
  });
  post(
    apiPath,
    {
      file_num: queryOfAddQuizState.fileNum,
      input_data: queryOfAddQuizState
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
        setMessageStater({
          message: 'Success!! 問題を追加できました!',
          messageColor: 'success.light'
        });
        setAddLog(res[0].result);
        setQueryofAddQuizStater({
          fileNum: queryOfAddQuizState.fileNum
        });
        //入力データをクリア
        const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
        if (inputQuizField) {
          inputQuizField.value = '';
        }
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    }
  );
};

export const AddQuizButton = ({
  value,
  queryOfAddQuizState,
  setAddLog,
  setMessageStater,
  setQueryofAddQuizStater
}: AddQuizButtonProps) => {
  return (
    <>
      <Button
        label={'問題登録'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          addQuizAPI({ value, queryOfAddQuizState, setAddLog, setMessageStater, setQueryofAddQuizStater })
        }
      />
    </>
  );
};
