import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { DisplayWordTestState, MessageState } from '../../../../../interfaces/state';

interface SubmitEnglishBotTestButtonProps {
  wordId: number;
  selectedValue: boolean | undefined;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTestState?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

const submitEnglishBotTestAPI = ({
  wordId,
  selectedValue,
  setMessageStater,
  setDisplayWordTestState
}: SubmitEnglishBotTestButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayWordTestState) {
    return;
  }

  if (selectedValue === undefined) {
    setMessageStater({
      message: 'エラー:解答が入力されていません',
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
    selectedValue ? '/english/word/test/clear' : '/english/word/test/fail',
    {
      wordId
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setDisplayWordTestState({});
        setMessageStater({
          message: `${selectedValue ? '正解+1!' : '不正解+1..'} 登録しました`,
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

export const SubmitEnglishBotTestButton = ({
  wordId,
  selectedValue,
  setMessageStater,
  setDisplayWordTestState
}: SubmitEnglishBotTestButtonProps) => {
  return (
    <>
      <Button
        label={'SUBMIT'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          submitEnglishBotTestAPI({
            wordId,
            selectedValue,
            setMessageStater,
            setDisplayWordTestState
          })
        }
        disabled={isNaN(wordId)}
      />
    </>
  );
};
