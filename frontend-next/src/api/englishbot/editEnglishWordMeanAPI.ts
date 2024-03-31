import { patch } from '@/common/API';
import { ProcessingAddApiReponse, AddDataApiResponse } from 'quizzer-lib';
import { WordMeanData, MessageState } from '../../../interfaces/state';

interface EditEnglishWordMeanButtonProps {
  meanData: WordMeanData[];
  meanDataIndex: number;
  inputEditData: WordMeanData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMeanDataIndex?: React.Dispatch<React.SetStateAction<number>>;
  setInputEditData?: React.Dispatch<React.SetStateAction<WordMeanData>>;
  setMeanData?: React.Dispatch<React.SetStateAction<WordMeanData[]>>;
}

// TODO ここのAPI部分は分けたい
export const editEnglishWordMeanAPI = async ({
  meanData,
  meanDataIndex,
  inputEditData,
  setMessage,
  setModalIsOpen,
  setMeanDataIndex,
  setInputEditData,
  setMeanData
}: EditEnglishWordMeanButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (inputEditData.partofspeechId === -1) {
    if (setMessage) {
      setMessage({ message: 'エラー:品詞を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await patch(
    '/english/word/' + String(inputEditData.wordId),
    {
      wordId: inputEditData.wordId,
      wordMeanId: inputEditData.wordmeanId,
      meanId: inputEditData.meanId,
      partofspeechId: inputEditData.partofspeechId,
      meaning: inputEditData.mean
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
        const editedMeanData = meanData;
        if (inputEditData.meanId === -1) {
          // 意味を新規追加時
          const responseBody = data.body as AddDataApiResponse;
          editedMeanData.push({ ...inputEditData, meanId: responseBody.insertId });
        } else {
          // 意味を編集時
          editedMeanData[meanDataIndex] = inputEditData;
        }
        if (setMeanData) {
          setMeanData(editedMeanData);
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
      if (setMeanDataIndex) {
        setMeanDataIndex(-1);
      }
      if (setInputEditData) {
        setInputEditData({
          wordId: inputEditData.wordId,
          wordName: '',
          wordmeanId: -1,
          meanId: -1,
          mean: '',
          partofspeechId: -1,
          partofspeechName: ''
        });
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
