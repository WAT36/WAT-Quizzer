import { put } from '@/common/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { WordSubSourceData, MessageState } from '../../../interfaces/state';

interface AddEnglishWordSubSourceButtonProps {
  wordId: number;
  subSourceName: string;
  wordSubSourceData: WordSubSourceData[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubSourceName?: React.Dispatch<React.SetStateAction<string>>;
  setWordSubSourceData?: React.Dispatch<React.SetStateAction<WordSubSourceData[]>>;
}

// TODO ここのAPI部分は分けたい
export const addEnglishWordSubSourceAPI = async ({
  wordId,
  subSourceName,
  wordSubSourceData,
  setMessage,
  setModalIsOpen,
  setSubSourceName,
  setWordSubSourceData
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
      wordId: wordId,
      subSource: subSourceName
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

        const editedWordSubSourceData = wordSubSourceData;
        editedWordSubSourceData.push({
          subSourceName: subSourceName
        });
        if (setWordSubSourceData) {
          setWordSubSourceData(editedWordSubSourceData);
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
