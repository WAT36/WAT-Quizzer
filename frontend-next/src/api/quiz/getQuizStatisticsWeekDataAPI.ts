import { get } from '@/api/API';
import { MessageState } from '../../../interfaces/state';
import { ProcessingApiReponse, QuizFileStatisticsApiResponse, QuizStatisticsWeekApiResponse } from 'quizzer-lib';

interface GetQuizFileStatisticsDataButtonProps {
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQuizStatisticsWeekData?: React.Dispatch<React.SetStateAction<QuizStatisticsWeekApiResponse[]>>;
}

export const getQuizStatisticsWeekDataAPI = async ({
  setMessage,
  setQuizStatisticsWeekData
}: GetQuizFileStatisticsDataButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setQuizStatisticsWeekData) {
    return;
  }

  await get(
    '/quiz/statistics/week',
    (data: ProcessingApiReponse) => {
      if (data.status === 404) {
        setMessage({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else if (data.status === 200) {
        const res: QuizStatisticsWeekApiResponse[] = data.body as QuizStatisticsWeekApiResponse[];
        if (setQuizStatisticsWeekData) {
          setQuizStatisticsWeekData(res);
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
