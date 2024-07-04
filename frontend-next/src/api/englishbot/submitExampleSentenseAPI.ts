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
  } else if (!inputExampleData.meanId || inputExampleData.meanId.length === 0) {
    setMessage({
      message: 'エラー:単語または意味へのチェック指定がありません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
  post(
    '/english/example',
    {
      exampleEn: inputExampleData.exampleEn,
      exampleJa: inputExampleData.exampleJa,
      meanId: inputExampleData.meanId
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
        ['addExampleEnField', 'addExampleJaField'].forEach((value) => {
          const inputField = document.getElementById(value) as HTMLTextAreaElement;
          if (inputField) {
            inputField.value = '';
          }
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  );
};
