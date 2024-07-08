import { post } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { MessageState, DisplayWordTestState } from '../../../interfaces/state';

interface SubmitAssociationExampleButtonProps {
  wordName: string;
  checkedIdList: number[];
  isAssociation: boolean;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
}

export const submitAssociationExampleAPI = async ({
  wordName,
  checkedIdList,
  isAssociation,
  setMessageStater
}: SubmitAssociationExampleButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater) {
    return;
  }

  if (!wordName) {
    setMessageStater({
      message: 'エラー:単語が入力されていません',
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
  // TODO 配列でのデータをAPIでどう送るのが良いか？途中で失敗した時のロールバック方法とかも考えたい
  for (let checkedId of checkedIdList) {
    await post(
      '/english/example/association',
      {
        wordName,
        checkedId,
        isAssociation
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessageStater({
            message: `更新しました`,
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
  }
  setMessageStater({
    message: '処理が終了しました',
    messageColor: 'success.light',
    isDisplay: true
  });
};
