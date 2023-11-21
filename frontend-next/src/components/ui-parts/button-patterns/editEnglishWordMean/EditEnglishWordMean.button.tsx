import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { patch } from '@/common/API';
import { EditWordMeanData, MessageState } from '../../../../../interfaces/state';

interface EditEnglishWordMeanButtonProps {
  inputEditData?: EditWordMeanData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
}

const editEnglishWordMeanAPI = ({ inputEditData, setMessage }: EditEnglishWordMeanButtonProps) => {
  patch(
    '/english/word/' + String(inputEditData?.wordId),
    {
      wordId: inputEditData?.wordId,
      wordMeanId: inputEditData?.wordmeanId,
      meanId: inputEditData?.meanId,
      partofspeechId: inputEditData?.partofspeechId,
      meaning: inputEditData?.mean,
      sourceId: inputEditData?.sourceId
    },
    (data: ProcessingApiReponse) => {
      if (setMessage) {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    }
  );
};

export const EditEnglishWordMeanButton = ({ inputEditData, setMessage }: EditEnglishWordMeanButtonProps) => {
  return (
    <>
      <Button
        label={'更新'}
        variant="contained"
        color="primary"
        onClick={(e) => editEnglishWordMeanAPI({ inputEditData, setMessage })}
      />
    </>
  );
};
