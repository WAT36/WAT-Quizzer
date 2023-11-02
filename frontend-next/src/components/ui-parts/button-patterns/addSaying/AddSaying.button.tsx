import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { getBook } from '@/common/response';

interface AddSayingButtonProps {
  selectedBookId: number;
  inputSaying: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

const addSayingAPI = ({ selectedBookId, inputSaying, setMessageStater, setBooklistoption }: AddSayingButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }

  if (!selectedBookId) {
    setMessageStater({ message: 'エラー:本名を選択して下さい', messageColor: 'error', isDisplay: true });
    return;
  } else if (!inputSaying || inputSaying === '') {
    setMessageStater({ message: 'エラー:格言を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  post(
    '/saying',
    {
      book_id: selectedBookId,
      saying: inputSaying
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規格言「${inputSaying}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  );
  getBook(setMessageStater, setBooklistoption);
};

export const AddSayingButton = ({
  selectedBookId,
  inputSaying,
  attr,
  setMessageStater,
  setBooklistoption
}: AddSayingButtonProps) => {
  return (
    <>
      <Button
        label={'格言登録'}
        variant="contained"
        color="primary"
        onClick={(e) => addSayingAPI({ selectedBookId, inputSaying, setMessageStater, setBooklistoption })}
        attr={attr}
      />
    </>
  );
};
