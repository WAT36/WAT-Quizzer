import { GetAccuracyRateByCategoryAPIResponseDto, ProcessingApiReponse } from 'quizzer-lib';
import { QueryOfGetAccuracyState, MessageState } from '../../../interfaces/state';
import { get } from '@/common/API';

interface GetAccuracyProps {
  queryOfGetAccuracy: QueryOfGetAccuracyState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setAccuracyData?: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryAPIResponseDto>>;
}
export const getAccuracy = ({ queryOfGetAccuracy, setMessage, setAccuracyData }: GetAccuracyProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setAccuracyData) {
    return;
  }

  if (queryOfGetAccuracy.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error'
    });
    return;
  }

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  get(
    '/category/rate',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const res: GetAccuracyRateByCategoryAPIResponseDto[] = data.body as GetAccuracyRateByCategoryAPIResponseDto[];
        setAccuracyData(res[0]);
        setMessage({
          message: '　',
          messageColor: 'commmon.black',
          isDisplay: false
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
    },
    {
      file_num: String(queryOfGetAccuracy.fileNum)
    }
  );
};
