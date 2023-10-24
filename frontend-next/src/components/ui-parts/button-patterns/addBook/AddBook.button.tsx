import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { MessageState, PullDownOptionState } from '../../../../../interfaces/state';
import { getBook } from '@/common/response';

interface AddBookButtonProps {
  bookName: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

const addBookAPI = ({ bookName, setMessageStater, setBooklistoption }: AddBookButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }
  if (!bookName || bookName === '') {
    setMessageStater({ message: 'エラー:本の名前を入力して下さい', messageColor: 'error' });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3' });
  post(
    '/saying/book',
    {
      book_name: bookName
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({ message: `新規ファイル「${bookName}」を追加しました`, messageColor: 'success.light' });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
      }
    }
  );
  getBook(setMessageStater, setBooklistoption);
};

export const AddBookButton = ({ bookName, attr, setMessageStater, setBooklistoption }: AddBookButtonProps) => {
  return (
    <>
      <Button
        label={'啓発本登録'}
        variant="contained"
        color="primary"
        onClick={(e) => addBookAPI({ bookName, setMessageStater, setBooklistoption })}
        attr={attr}
      />
    </>
  );
};
