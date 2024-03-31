import { post } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { QueryOfGetAccuracyState, MessageState } from '../../../interfaces/state';

interface UpdateCategoryProps {
  queryOfGetAccuracy: QueryOfGetAccuracyState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
}
export const updateCategory = ({ queryOfGetAccuracy, setMessage }: UpdateCategoryProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage) {
    return;
  }

  if (queryOfGetAccuracy.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  post(
    '/category',
    {
      file_num: queryOfGetAccuracy.fileNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessage({
          message: '指定問題ファイルへのカテゴリ更新に成功しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404) {
        setMessage({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  );
};
