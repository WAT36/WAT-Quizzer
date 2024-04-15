import { ProcessingApiReponse, GetRandomSayingResponse } from 'quizzer-lib';
import { SayingState } from '../../../interfaces/state';
import { get } from '@/api/API';

interface getSayingAPIProps {
  setSaying?: React.Dispatch<React.SetStateAction<SayingState>>;
}

export const getSayingAPI = async ({ setSaying }: getSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setSaying) {
    return;
  }

  await get('/saying', (data: ProcessingApiReponse) => {
    if (data.status === 200) {
      const result: GetRandomSayingResponse[] = data.body as GetRandomSayingResponse[];
      setSaying({
        saying: result[0].saying,
        explanation: result[0].explanation,
        name: `出典：${result[0].selfhelp_book.name}`,
        color: 'common.black'
      });
    }
  }).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
  });
};
