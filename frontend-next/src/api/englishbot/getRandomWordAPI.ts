import {
  getDateForSqlString,
  ProcessingApiReponse,
  GetRandomWordAPIResponseDto,
  EnglishBotTestFourChoiceResponse
} from 'quizzer-lib';
import { QueryOfGetWordState, MessageState, DisplayWordTestState } from '../../../interfaces/state';
import { get } from '@/api/API';

interface GetRandomWordButtonProps {
  queryOfGetWordState: QueryOfGetWordState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTest?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const getRandomWordAPI = async ({
  queryOfGetWordState,
  setMessageStater,
  setDisplayWordTest
}: GetRandomWordButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayWordTest) {
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {};
  if (queryOfGetWordState.source) {
    sendData.source = String(queryOfGetWordState.source);
  }
  if (queryOfGetWordState.subSource && queryOfGetWordState.subSource.startDate) {
    sendData.startDate = getDateForSqlString(queryOfGetWordState.subSource.startDate);
  }
  if (queryOfGetWordState.subSource && queryOfGetWordState.subSource.endDate) {
    sendData.endDate = getDateForSqlString(queryOfGetWordState.subSource.endDate);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  const wordData = await get(
    '/english/word/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: GetRandomWordAPIResponseDto[] = data.body as GetRandomWordAPIResponseDto[];
        setDisplayWordTest({
          wordName: res[0].name
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
        return {
          id: res[0].id,
          name: res[0].name
        };
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
    },
    sendData
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  });

  await get(
    '/english/word/fourchoice',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: EnglishBotTestFourChoiceResponse[] = data.body as EnglishBotTestFourChoiceResponse[];
        setDisplayWordTest({
          wordId: +wordData.id,
          wordName: wordData.name,
          choice: {
            correct: res[0].correct,
            dummy: res[0].dummy
          }
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
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
    },
    {
      wordId: String(wordData.id)
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
