import { put } from '@/common/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { WordMeanData, PullDownOptionState, WordSourceData, MessageState } from '../../../interfaces/state';

interface EditEnglishWordSourceButtonProps {
  meanData: WordMeanData[];
  sourceList: PullDownOptionState[];
  wordSourceData: WordSourceData[];
  selectedWordSourceIndex: number;
  inputSourceId: number;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setWordSourceData?: React.Dispatch<React.SetStateAction<WordSourceData[]>>;
}

// TODO ここのAPI部分は分けたい
export const editEnglishWordSourceAPI = async ({
  meanData,
  sourceList,
  wordSourceData,
  selectedWordSourceIndex,
  inputSourceId,
  setMessage,
  setModalIsOpen,
  setWordSourceData
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
      meanId: meanData.map((x) => x.meanId),
      oldSourceId: selectedWordSourceIndex === -1 ? -1 : wordSourceData[selectedWordSourceIndex].sourceId,
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
        const editedWordSourceData = wordSourceData;
        if (selectedWordSourceIndex === -1) {
          editedWordSourceData.push({
            // TODO  wordidは最悪いらない、ここの扱いをどうしようか・・
            wordId: -1,
            wordName: '',
            sourceId: inputSourceId,
            sourceName: sourceList.reduce((previousValue, currentValue) => {
              return +currentValue.value === inputSourceId ? previousValue + currentValue.label : previousValue;
            }, '')
          });
        } else {
          editedWordSourceData[selectedWordSourceIndex] = {
            ...wordSourceData[selectedWordSourceIndex],
            sourceId: inputSourceId,
            sourceName: sourceList.reduce((previousValue, currentValue) => {
              return +currentValue.value === inputSourceId ? previousValue + currentValue.label : previousValue;
            }, '')
          };
        }

        if (setWordSourceData) {
          setWordSourceData(editedWordSourceData);
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
