import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { AddDataApiResponse, ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { patch } from '@/common/API';
import { MessageState, WordMeanData } from '../../../../../interfaces/state';

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
const editEnglishWordMeanAPI = ({
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

  patch(
    '/english/word/' + String(inputEditData.wordId),
    {
      wordId: inputEditData.wordId,
      wordMeanId: inputEditData.wordmeanId,
      meanId: inputEditData.meanId,
      partofspeechId: inputEditData.partofspeechId,
      meaning: inputEditData.mean
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        }
        console.log(`data:${JSON.stringify(data)}`);
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
            messageColor: 'error'
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
  );
};

export const EditEnglishWordMeanButton = ({
  meanData,
  meanDataIndex,
  inputEditData,
  setMessage,
  setModalIsOpen,
  setMeanDataIndex,
  setInputEditData,
  setMeanData
}: EditEnglishWordMeanButtonProps) => {
  return (
    <>
      <Button
        label={'更新'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          editEnglishWordMeanAPI({
            meanData,
            meanDataIndex,
            inputEditData,
            setMessage,
            setModalIsOpen,
            setMeanDataIndex,
            setInputEditData,
            setMeanData
          })
        }
      />
    </>
  );
};
