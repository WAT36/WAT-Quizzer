import { put } from '@/api/API';
import { ProcessingAddApiReponse } from 'quizzer-lib';
import { MessageState, WordDetailData } from '../../../interfaces/state';
import { getWordDetail } from '@/pages/api/english';

interface AddEnglishWordSubSourceButtonProps {
  wordDetail: WordDetailData;
  subSourceName: string;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubSourceName?: React.Dispatch<React.SetStateAction<string>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

// TODO ここのAPI部分は分けたい
export const addEnglishWordSubSourceAPI = async ({
  wordDetail,
  subSourceName,
  setMessage,
  setModalIsOpen,
  setSubSourceName,
  setWordDetail
}: AddEnglishWordSubSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (!subSourceName || subSourceName === '') {
    if (setMessage) {
      setMessage({ message: 'エラー:出典を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await put(
    '/english/word/subsource',
    {
      wordId: wordDetail.id,
      subSource: subSourceName
    },
    (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }

        if (setWordDetail && setMessage) {
          getWordDetail(String(wordDetail.id), setMessage, setWordDetail);
        }

        setSubSourceName && setSubSourceName('');
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
