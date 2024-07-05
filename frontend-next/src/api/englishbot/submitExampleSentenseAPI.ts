import { post } from '@/api/API';
import { InputExampleData } from '@/pages/englishBot/addExample';
import { ProcessingApiReponse } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';

// 例文データ登録
interface SubmitExampleSentenseAPIProps {
  inputExampleData: InputExampleData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputExampleData?: React.Dispatch<React.SetStateAction<InputExampleData>>;
}

export const submitExampleSentenseAPI = ({
  inputExampleData,
  setMessage,
  setInputExampleData
}: SubmitExampleSentenseAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setInputExampleData) {
    return;
  }

  if (!inputExampleData || !inputExampleData.exampleEn || inputExampleData.exampleEn === '') {
    setMessage({
      message: 'エラー:例文(英文)が入力されていません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!inputExampleData.exampleJa || inputExampleData.exampleJa === '') {
    setMessage({
      message: 'エラー:例文(和文)が入力されていません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!inputExampleData.wordName || inputExampleData.wordName === '') {
    setMessage({
      message: 'エラー:単語または意味へのチェック指定がありません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
  // TODO ここに限らずだが ブログでPromise学んだんだから api系の関数の処理見直したい
  post(
    '/english/example',
    // TODO ↓inputExampleData だけでいいのでは？　と言うよりステートとAPIの方を共通化して持たせた方がやりやすそう
    {
      exampleEn: inputExampleData.exampleEn,
      exampleJa: inputExampleData.exampleJa,
      wordName: inputExampleData.wordName
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessage({
          message: '例文を登録しました',
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputExampleData({});

        // 入力データをクリア
        // TODO javascript形式でやるんじゃなくて　コンポーネントの方に削除する関数とか組み入れてやらせたい
        ['addExampleEnField', 'addExampleJaField', 'addExampleToWordName'].forEach((value) => {
          const inputField = document.getElementById(value) as HTMLTextAreaElement;
          if (inputField) {
            inputField.value = '';
          }
        });
      } else {
        // TODO APIからのエラーこれで固定じゃなくて　APIからのエラーメッセージをちゃんと表示するようにしたい（もう上げてる？）
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  );
};
