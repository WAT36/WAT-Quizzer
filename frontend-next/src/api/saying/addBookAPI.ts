import { post } from '@/common/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { getBook } from './getBookListAPI';

interface AddBookButtonProps {
  bookName: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const addBookAPI = async ({ bookName, setMessageStater, setBooklistoption }: AddBookButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }
  if (!bookName || bookName === '') {
    setMessageStater({ message: 'エラー:本の名前を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  await post(
    '/saying/book',
    {
      book_name: bookName
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規ファイル「${bookName}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  getBook(setMessageStater, setBooklistoption);
};
