import { post } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { MessageState, DisplayWordTestState } from '../../../interfaces/state';

interface SubmitEnglishBotTestButtonProps {
  wordId: number;
  selectedValue: boolean | undefined;
  testType: number;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTestState?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const submitEnglishBotTestAPI = async ({
  wordId,
  selectedValue,
  testType,
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
  await post(
    selectedValue ? '/english/word/test/clear' : '/english/word/test/fail',
    {
      wordId,
      testType
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
