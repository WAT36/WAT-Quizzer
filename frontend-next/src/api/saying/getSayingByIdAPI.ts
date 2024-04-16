import { ProcessingApiReponse, GetSayingAPIResponseDto, ProcessingApiSingleReponse } from 'quizzer-lib';
import { MessageState, EditQueryOfSaying } from '../../../interfaces/state';
import { get } from '@/api/API';

interface getSayingAPIProps {
  id: number;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setEditQueryOfSaying?: React.Dispatch<React.SetStateAction<EditQueryOfSaying>>;
}

export const getSayingByIdAPI = async ({ id, setMessageStater, setEditQueryOfSaying }: getSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setEditQueryOfSaying) {
    return;
  }

  if (isNaN(id) || id < 0) {
    setMessageStater({
      message: `エラー:入力したIDが不正です:${id}`,
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  await get(
    `/saying/${id}`,
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200 && data.body) {
        const res: GetSayingAPIResponseDto = data.body as GetSayingAPIResponseDto;
        setEditQueryOfSaying({
          id: id,
          saying: res.saying,
          explanation: res.explanation
        });
        setMessageStater({
          message: '格言を取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || !data.body) {
        setEditQueryOfSaying({
          id: -1,
          saying: ''
        });
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setEditQueryOfSaying({
          id: -1,
          saying: ''
        });
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {}
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setEditQueryOfSaying({
      id: -1,
      saying: ''
    });
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
