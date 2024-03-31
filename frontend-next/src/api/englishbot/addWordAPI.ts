import { post } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import { meanOfAddWordDto, SendToAddWordApiData } from '../../../interfaces/api/response';
import { MessageState } from '../../../interfaces/state';

interface AddWordButtonProps {
  inputWord: string;
  meanRowList: meanOfAddWordDto[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputWord?: React.Dispatch<React.SetStateAction<string>>;
  setMeanRowList?: React.Dispatch<React.SetStateAction<meanOfAddWordDto[]>>;
}

// 登録ボタン押下後。単語と意味をDBに登録
export const addWordAPI = async ({
  inputWord,
  meanRowList,
  setMessage,
  setInputWord,
  setMeanRowList
}: AddWordButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setInputWord || !setMeanRowList) {
    return;
  }

  if (inputWord === '') {
    setMessage({
      message: 'エラー:単語が入力されておりません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  for (let i = 0; i < meanRowList.length; i++) {
    if (meanRowList[i].pos.id === -1 || (meanRowList[i].pos.id === -2 && !meanRowList[i].pos.name)) {
      setMessage({
        message: `エラー:${i + 1}行目の品詞を入力してください`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (!meanRowList[i].mean || meanRowList[i].mean === '') {
      setMessage({
        message: `エラー:${i + 1}行目の意味を入力してください`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }
  }

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  await post(
    '/english/word/add',
    {
      wordName: inputWord,
      pronounce: '',
      meanArrayData: meanRowList.reduce((previousValue: SendToAddWordApiData[], currentValue) => {
        if (currentValue.pos.id !== -1) {
          previousValue.push({
            partOfSpeechId: currentValue.pos.id,
            sourceId: currentValue.source.id,
            meaning: currentValue.mean || '',
            partOfSpeechName: currentValue.pos.name,
            sourceName: currentValue.source.name
          });
        }
        return previousValue;
      }, [])
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessage({
          message: `単語「${inputWord}」を登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputWord('');
        setMeanRowList([]);
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  ).catch((err) => {
    console.error(`API Error2(word add). ${JSON.stringify(err)},err:${err}`);
    setMessage({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
