import { GetPopularEventResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { get } from './API';

// TODO この辺の関数群は適切なファイル名フォルダ構成にしてわかりやすいように振り分けるべき

// イベントリストをapi通信して取ってくる
export const getPopularEventList = async (
  setEventList: React.Dispatch<React.SetStateAction<GetPopularEventResponse[]>>
) => {
  const storageKey = 'popularEventList';
  const savedEventList = sessionStorage.getItem(storageKey);
  if (!savedEventList) {
    await get('/scrape/connpass/best', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetPopularEventResponse[] = data.body as GetPopularEventResponse[];
        setEventList(result);
      } else {
        setEventList([{ name: `Error:${data.status}`, link: '' }]);
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setEventList(JSON.parse(savedEventList) as GetPopularEventResponse[]);
  }
};
