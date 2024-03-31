import { EditQueryOfSaying, MessageState } from '../../interfaces/state';
import { patch } from './API';
import { ProcessingApiReponse } from 'quizzer-lib';

interface editSayingAPIProps {
  editQueryOfSaying: EditQueryOfSaying;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setEditQueryOfSaying?: React.Dispatch<React.SetStateAction<EditQueryOfSaying>>;
}

export const editSayingAPI = async ({
  editQueryOfSaying,
  setMessageStater,
  setEditQueryOfSaying
}: editSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setEditQueryOfSaying) {
    return;
  }

  await patch(
    '/saying',
    {
      id: editQueryOfSaying.id,
      saying: editQueryOfSaying.saying,
      explanation: editQueryOfSaying.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        setMessageStater({
          message: 'Success!! 編集に成功しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
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
  setEditQueryOfSaying({
    id: -1,
    saying: ''
  });
};
