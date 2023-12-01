import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { put } from '@/common/API';
import { MessageState, PullDownOptionState, WordMeanData, WordSourceData } from '../../../../../interfaces/state';

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
const editEnglishWordSourceAPI = ({
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

  put(
    '/english/word/source',
    {
      meanId: meanData.map((x) => x.meanId),
      oldSourceId: wordSourceData[selectedWordSourceIndex].sourceId,
      newSourceId: inputSourceId
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        }
        const editedWordSourceData = wordSourceData;
        editedWordSourceData[selectedWordSourceIndex] = {
          ...wordSourceData[selectedWordSourceIndex],
          sourceId: inputSourceId,
          sourceName: sourceList.reduce((previousValue, currentValue) => {
            return +currentValue.value === inputSourceId ? previousValue + currentValue.label : previousValue;
          }, '')
        };
        if (setWordSourceData) {
          setWordSourceData(editedWordSourceData);
        }
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    }
  );
};

export const EditEnglishWordSourceButton = ({
  meanData,
  sourceList,
  wordSourceData,
  selectedWordSourceIndex,
  inputSourceId,
  setMessage,
  setModalIsOpen,
  setWordSourceData
}: EditEnglishWordSourceButtonProps) => {
  return (
    <>
      <Button
        label={'更新'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          editEnglishWordSourceAPI({
            meanData,
            sourceList,
            wordSourceData,
            selectedWordSourceIndex,
            inputSourceId,
            setMessage,
            setModalIsOpen,
            setWordSourceData
          })
        }
      />
    </>
  );
};
