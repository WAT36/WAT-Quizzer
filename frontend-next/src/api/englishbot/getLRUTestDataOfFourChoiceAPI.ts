import { getDateForSqlString, ProcessingApiSingleReponse, FourChoiceAPIResponseDto } from 'quizzer-lib';
import { QueryOfGetWordState, MessageState, DisplayWordTestState } from '../../../interfaces/state';
import { get } from '@/api/API';

interface GetLRUTestDataOfFourChoiceButtonProps {
  queryOfGetWordState: QueryOfGetWordState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTest?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const getLRUTestDataOfFourChoiceAPI = async ({
  queryOfGetWordState,
  setMessageStater,
  setDisplayWordTest
}: GetLRUTestDataOfFourChoiceButtonProps) => {
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
  await get(
    '/english/word/test/fourchoice/lru',
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200 && data.body) {
        const res: FourChoiceAPIResponseDto = data.body as FourChoiceAPIResponseDto;
        setDisplayWordTest({
          wordId: res.word.id,
          wordName: res.word.name,
          choice: {
            correct: res.correct,
            dummy: res.dummy
          }
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || !data.body) {
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
  });
};
