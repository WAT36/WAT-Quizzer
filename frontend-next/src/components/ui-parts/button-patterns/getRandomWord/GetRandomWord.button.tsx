import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { WordApiResponse } from '../../../../../interfaces/db';
import { get } from '@/common/API';
import { DisplayWordTestState, MessageState, QueryOfGetWordState } from '../../../../../interfaces/state';

interface GetRandomWordButtonProps {
  queryOfGetWordState: QueryOfGetWordState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTest?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

const getRandomWordAPI = ({ queryOfGetWordState, setMessageStater, setDisplayWordTest }: GetRandomWordButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayWordTest) {
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {};
  if (queryOfGetWordState.source) {
    sendData.sourceId = String(queryOfGetWordState.source);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
  });
  get(
    '/english/word/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: WordApiResponse[] = data.body as WordApiResponse[];
        setDisplayWordTest({
          wordName: res[0].name
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black'
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error'
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    sendData
  );
};

export const GetRandomWordButton = ({
  queryOfGetWordState,
  setMessageStater,
  setDisplayWordTest
}: GetRandomWordButtonProps) => {
  return (
    <>
      <Button
        label={'Random'}
        variant="contained"
        color="primary"
        onClick={(e) => getRandomWordAPI({ queryOfGetWordState, setMessageStater, setDisplayWordTest })}
      />
    </>
  );
};
