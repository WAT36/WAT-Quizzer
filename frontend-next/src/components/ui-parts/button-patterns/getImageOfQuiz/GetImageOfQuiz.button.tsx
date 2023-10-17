import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../interfaces/state';

interface GetImageOfQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

const getImageOfQuizAPI = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetImageOfQuizButtonProps) => {
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

  // TODO  API処理
  // そういえばまだ未実装
};

export const GetImageOfQuizButton = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetImageOfQuizButtonProps) => {
  return (
    <>
      <Button
        label={'画像表示'}
        variant="contained"
        color="info"
        disabled={true}
        onClick={(e) =>
          getImageOfQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
    </>
  );
};
