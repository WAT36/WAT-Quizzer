import { put } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { WordSourceData, MessageState, WordDetailData } from '../../../interfaces/state';
import { getWordDetail } from '@/pages/api/english';

interface EditEnglishWordSourceButtonProps {
  wordDetail: WordDetailData;
  wordSourceData: WordSourceData;
  selectedWordSourceIndex: number;
  inputSourceId: number;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

// TODO ここのAPI部分は分けたい
export const editEnglishWordSourceAPI = async ({
  wordDetail,
  wordSourceData,
  selectedWordSourceIndex,
  inputSourceId,
  setMessage,
  setModalIsOpen,
  setWordDetail
}: EditEnglishWordSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (inputSourceId === -1) {
    if (setMessage) {
      setMessage({ message: 'エラー:出典を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await put(
    '/english/word/source',
    {
      meanId: wordDetail.mean.map((x) => x.id),
      oldSourceId: selectedWordSourceIndex === -1 ? -1 : wordSourceData.source[selectedWordSourceIndex].id,
      newSourceId: inputSourceId
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }
        // 更新確認後、単語の意味を再取得させる
        if (setWordDetail && setMessage) {
          getWordDetail(String(wordDetail.id), setMessage, setWordDetail);
        }
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    if (setMessage) {
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    }
  });
};
