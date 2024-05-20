import { get } from '@/api/API';
import { MessageState } from '../../../interfaces/state';
import { ProcessingApiReponse, QuizFileStatisticsApiResponse } from 'quizzer-lib';

interface GetQuizFileStatisticsDataButtonProps {
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQuizFileStatisticsData?: React.Dispatch<React.SetStateAction<QuizFileStatisticsApiResponse[]>>;
}

export const getQuizFileStatisticsDataAPI = async ({
  setMessage,
  setQuizFileStatisticsData
}: GetQuizFileStatisticsDataButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setQuizFileStatisticsData) {
    return;
  }

  await get(
    '/quiz/file/statistics',
    (data: ProcessingApiReponse) => {
      if (data.status === 404) {
        setMessage({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else if (data.status === 200) {
        const res: QuizFileStatisticsApiResponse[] = data.body as QuizFileStatisticsApiResponse[];
        if (setQuizFileStatisticsData) {
          setQuizFileStatisticsData(res);
        }
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {}
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessage({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
