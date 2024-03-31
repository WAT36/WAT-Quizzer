import { post } from '@/common/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { InputSayingState, MessageState } from '../../../interfaces/state';

interface AddSayingButtonProps {
  inputSaying: InputSayingState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputSaying?: React.Dispatch<React.SetStateAction<InputSayingState>>;
}

export const addSayingAPI = async ({ inputSaying, setMessageStater, setInputSaying }: AddSayingButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setInputSaying) {
    return;
  }

  if (!inputSaying.bookId || inputSaying.bookId === -1) {
    setMessageStater({ message: 'エラー:本名を選択して下さい', messageColor: 'error', isDisplay: true });
    return;
  } else if (!inputSaying.saying || inputSaying.saying === '') {
    setMessageStater({ message: 'エラー:格言を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  await post(
    '/saying',
    {
      book_id: inputSaying.bookId,
      saying: inputSaying.saying,
      explanation: inputSaying.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規格言「${inputSaying}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputSaying({
          bookId: -1,
          saying: '',
          explanation: ''
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
  //getBook(setMessageStater, setBooklistoption);
};
